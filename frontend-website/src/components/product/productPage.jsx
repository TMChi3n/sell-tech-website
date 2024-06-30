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
      setIsModalOpen(false);
      success("Product created successfully!");
    },
    onError: () => {
      error("Failed to create product");
    },
  });

  const update = useMutation(updateProduct, {
    onSuccess: () => {
      queryClient.invalidateQueries("product");
      setIsDrawerOpen(false);
      success("Product updated successfully!");
    },
    onError: (error) => {
      console.error("Failed to update product", error);
      notification.error({
        message: "Failed to update product",
        description: error.response?.data?.message || "Please check your data.",
      });
    },
  });

  const deleteProd = useMutation(deleteProduct, {
    onSuccess: () => {
      queryClient.invalidateQueries("product");
      setIsModalDeleteOpen(false);
      success("Product deleted successfully!");
    },
    onError: (error) => {
      console.error("Error deleting product", error);
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
    setSelectedProduct(product);
    form.setFieldsValue(product);
    setIsDrawerOpen(true);
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await deleteProd.mutateAsync(productId);
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
      setIsModalDeleteOpen(false);
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
        updateProduct={(id, data) => update.mutate({ id, data })}
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
