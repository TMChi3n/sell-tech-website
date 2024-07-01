import React, { useState } from "react";
import { useQuery, useMutation, QueryClient } from "react-query";
import { Button, Form, notification } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import {
  getAllProducts,
  createProduct,
  updateProduct as updateProductAPI,
  deleteProduct,
} from "../../apis/apisRequest";
import AddingProduct from "../product/childrenProduct/add";
import UpdateProduct from "../product/childrenProduct/update";
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

  const update = async (productId, data) => {
    try {
      console.log("Update payload:", data); // Log data being sent
      await updateProductAPI(productId, data);
      success("Product updated successfully!");
      setIsDrawerOpen(false);
      queryClient.invalidateQueries("product");
    } catch (err) {
      console.error("Error details:", err); // Log the error details
      error("Failed to update product");
    }
  };

  const deleteProd = useMutation(deleteProduct, {
    onSuccess: () => {
      queryClient.invalidateQueries("product");
      setIsModalDeleteOpen(false);
      success("Product deleted successfully!");
    },
    onError: (err) => {
      console.error("Error deleting product", err);
      error("Failed to delete product");
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
    } catch (err) {
      console.error("Failed to delete product", err);
      error("Failed to delete product");
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
      success("Product deleted successfully!");
    } catch (err) {
      console.error("Failed to delete product", err);
      error("Failed to delete product");
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

      <UpdateProduct
        form={form}
        isDrawerOpen={isDrawerOpen}
        updateProduct={update}
        onClose={() => setIsDrawerOpen(false)}
        selectedProduct={selectedProduct}
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
