import React from "react";
import { Modal, Form, Button, Input, Upload, Select } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import InputComponent from "../../input/inputCpn.jsx";

const { Option } = Select;

const AddingProduct = ({ form, isModalOpen, createMutation, onCancel }) => {
  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handleFinish = async (values) => {
    try {
      const imgBase64 = await getBase64(values.img_url[0].originFileObj);
      createMutation.mutate({
        ...values,
        price: parseFloat(values.price),
        stock_quantity: parseInt(values.stock_quantity, 10),
        img_url: imgBase64,
      });
    } catch (error) {
      console.error("Failed to create product", error);
    }
  };

  return (
    <Modal
      title="Adding product"
      visible={isModalOpen}
      onCancel={onCancel}
      footer={null}
    >
      <Form form={form} onFinish={handleFinish} layout="vertical">
        <Form.Item
          label="Product Name"
          name="name"
          rules={[{ required: true, message: "Please enter the product name" }]}
        >
          <InputComponent allowClear placeholder="Enter product name" />
        </Form.Item>

        <Form.Item
          label="Price"
          name="price"
          rules={[
            { required: true, message: "Please enter the product price" },
          ]}
        >
          <InputComponent allowClear placeholder="Enter product price" />
        </Form.Item>

        <Form.Item
          label="Material"
          name="material"
          rules={[
            { required: true, message: "Please enter the product material" },
          ]}
        >
          <InputComponent allowClear placeholder="Enter product material" />
        </Form.Item>

        <Form.Item
          label="Overview"
          name="overview"
          rules={[
            { required: true, message: "Please enter the product overview" },
          ]}
        >
          <InputComponent allowClear placeholder="Enter product overview" />
        </Form.Item>

        <Form.Item
          label="Type"
          name="type"
          rules={[{ required: true, message: "Please choose a type" }]}
        >
          <Select placeholder="Choose type" allowClear>
            <Option value="trouser">Trouser</Option>
            <Option value="jacket">Jacket</Option>
            <Option value="polo shirt">Polo Shirt</Option>
            <Option value="t-shirt">T-Shirt</Option>
            <Option value="dress">Dress</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Image"
          name="img_url"
          valuePropName="fileList"
          getValueFromEvent={(e) => (Array.isArray(e) ? e : e && e.fileList)}
          rules={[{ required: true, message: "Please provide an image" }]}
        >
          <Upload name="img" listType="picture" beforeUpload={() => false}>
            <Button icon={<UploadOutlined />}>Click to upload</Button>
          </Upload>
        </Form.Item>

        <Form.Item
          label="Person"
          name="person"
          rules={[{ required: true, message: "Please choose a person" }]}
        >
          <Select placeholder="Choose person" allowClear>
            <Option value="male">Male</Option>
            <Option value="female">Female</Option>
            <Option value="children">Children</Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Add Product
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddingProduct;
