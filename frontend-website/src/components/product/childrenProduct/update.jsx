import React, { useEffect } from "react";
import {
  Drawer,
  Form,
  Button,
  notification,
  Select,
  Upload,
  Input,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { updateProduct } from "../../../apis/apisRequest";

const { Option } = Select;

const UpdateProductDrawer = ({
  form,
  isDrawerOpen,
  onClose,
  product,
  updateProduct,
}) => {
  useEffect(() => {
    if (product) {
      form.setFieldsValue({
        id_product: product.id_product,
        name: product.name,
        price: product.price,
        material: product.material,
        overview: product.overview,
        type: product.type,
        img_url: product.img_url, // Assuming img_url is a string URL initially
        person: product.person,
      });
    }
  }, [product, form]);

  const handleUploadChange = (info) => {
    if (info.file.status !== "uploading") {
      form.setFieldsValue({
        img_url: info.fileList,
      });
    }
  };

  const onFinish = async (values) => {
    const productId = parseInt(values.id_product, 10);
    if (isNaN(productId)) {
      notification.error({
        message: "Invalid product ID",
        description: "Please enter a valid product ID.",
      });
      return;
    }

    const productData = {
      id_product: productId,
      name: values.name,
      material: values.material,
      overview: values.overview,
      price: parseFloat(values.price),
      type: values.type,
      person: values.person,
      img_url:
        values.img_url && values.img_url[0] && values.img_url[0].originFileObj,
    };

    try {
      await updateProduct(productId, productData);
      notification.success({
        message: "Product updated successfully!",
      });
      onClose(); // Close the drawer after updating
    } catch (error) {
      console.error("Axios error:", error);
      console.log("Error response:", error.response); // Log the error response for detailed information
      notification.error({
        message: "Update failed",
        description: error.response?.data?.message || "Unknown error occurred",
      });
    }
  };

  return (
    <Drawer
      title="Update product"
      visible={isDrawerOpen}
      onClose={onClose}
      width={480}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item label="ID Product" name="id_product">
          <Input disabled />
        </Form.Item>

        <Form.Item label="Product Name" name="name">
          <Input allowClear placeholder="Enter product name" />
        </Form.Item>

        <Form.Item label="Price" name="price">
          <Input allowClear placeholder="Enter product price" />
        </Form.Item>

        <Form.Item label="Material" name="material">
          <Input allowClear placeholder="Enter product material" />
        </Form.Item>

        <Form.Item label="Overview" name="overview">
          <Input.TextArea allowClear placeholder="Enter product overview" />
        </Form.Item>

        <Form.Item label="Type" name="type">
          <Select placeholder="Choose type" allowClear>
            <Option value="trouser">Trouser</Option>
            <Option value="jacket">Jacket</Option>
            <Option value="polo shirt">Polo Shirt</Option>
            <Option value="t-shirt">T-Shirt</Option>
            <Option value="dress">Dress</Option>
          </Select>
        </Form.Item>

        <Form.Item label="Image" name="img_url">
          <Upload
            name="img"
            listType="picture"
            beforeUpload={() => false}
            onChange={handleUploadChange}
          >
            <Button icon={<UploadOutlined />}>Click to upload</Button>
          </Upload>
        </Form.Item>

        <Form.Item label="Person" name="person">
          <Select placeholder="Choose person" allowClear>
            <Option value="male">Male</Option>
            <Option value="female">Female</Option>
            <Option value="children">Children</Option>
          </Select>
        </Form.Item>

        <Button type="primary" htmlType="submit">
          Update Product
        </Button>
      </Form>
    </Drawer>
  );
};

export default UpdateProductDrawer;
