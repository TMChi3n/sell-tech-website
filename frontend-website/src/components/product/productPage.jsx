import React, { useState } from "react";
import { useQuery, useMutation, QueryClient } from "react-query";
import { Button, Form, notification } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../apis/apisRequest";
import AddingProduct from "../product/childrenProduct/add";
import UpdateProductDrawer from "../product/childrenProduct/update";
import DeleteProduct from "../product/childrenProduct/delete";
import Tables from "../product/childrenProduct/productFields";
import { success, error } from "../../components/messages/message";

const ManagementProduct = () => {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const { data: products, isLoading: isLoadingProducts } = useQuery(
    "product",
    getAllProducts
  );

  const queryClient = new QueryClient();

  const create = useMutation(createProduct, {
    onSuccess: () => {
      queryClient.invalidateQueries("product");
      setIsDrawerOpen(false);
      success("Product created successfully!");
    },
    onError: () => {
      error("Failed to create product");
    },
  });

  const update = async (id, data) => {
    try {
      const res = await updateProduct(id, data);
      success("Update product successfully!");
      setIsDrawerOpen(false);
      console.log(res);
    } catch (error) {
      console.error("Error updating product:", error);
      console.log("Error response:", error.response);
      notification.error({
        message: "Update failed",
        description: error.response?.data?.message || "Unknown error occurred",
      });
    }
  };
  

  const deleteProd = useMutation(deleteProduct, {
    onSuccess: () => {
      queryClient.invalidateQueries("product");
      setIsModalDeleteOpen(false);
      success("Product deleted successfully!");
    },
    onError: () => {
      console.log("Error deleting product", error);
      notification.error({
        message: "Failed",
        description: error.response?.data?.message || "Verify your data",
      });
    },
  });

  const handleAddProduct = () => {
    if (form) {
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  const handleEditProduct = (product) => {
    form.setFieldsValue(product);
    setSelectedProduct(product);
    setIsDrawerOpen(true);
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await deleteProd.mutateAsync(productId);
      queryClient.invalidateQueries("product");
      notification.success({
        message: "Delete product successfully!",
        description: "Success",
      });
    } catch (error) {
      console.error("Failed");
      notification.error({
        message: "Failed",
        description: error.response?.data?.message || "Verify your data",
      });
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedProduct || !selectedProduct.id_product) {
      console.error("Selected product not found");
      return;
    }
    try {
      await deleteProd.mutateAsync(selectedProduct.id_product);
      setIsModalDeleteOpen(false); // Close the confirmation modal after successful deletion
      notification.success({
        message: "Product deleted successfully!",
        description: "The selected product has been deleted.",
      });
    } catch (error) {
      console.error("Failed to delete product", error);
      notification.error({
        message: "Failed to delete product",
        description:
          error.response?.data?.message || "Please verify your data.",
      });
    }
  };

  return (
    <div>
      <h1>Product Management</h1>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={handleAddProduct}
        style={{ marginBottom: 16 }}
      >
        Add Product
      </Button>

      {isLoadingProducts ? (
        <div>Loading...</div>
      ) : (
        <Tables
          products={products || []}
          handleEdit={handleEditProduct}
          handleDelete={handleDeleteProduct}
        />
      )}

      <AddingProduct
        form={form}
        isModalOpen={isModalOpen}
        createMutation={create}
        onCancel={() => setIsModalOpen(false)}
      />

      <UpdateProductDrawer
        form={form}
        isDrawerOpen={isDrawerOpen}
        updateProduct={update}
        onClose={() => setIsDrawerOpen(false)}
      />

      <DeleteProduct
        isModalDeleteOpen={isModalDeleteOpen}
        handleConfirmDelete={handleConfirmDelete}
        onCancel={() => setIsModalDeleteOpen(false)}
      />
    </div>
  );
};

export default ManagementProduct;
