import React, { useEffect } from "react";
import { Drawer, Form, Button, notification, Select, Input } from "antd";

const { Option } = Select;

const UpdateProduct = ({
  form,
  isDrawerOpen,
  onClose,
  updateProduct,
  selectedProduct,
}) => {
  useEffect(() => {
    if (selectedProduct) {
      form.setFieldsValue(selectedProduct);
    }
  }, [selectedProduct, form]);

  return (
    <Drawer
      title="Update Product"
      visible={isDrawerOpen}
      onClose={onClose}
      width={480}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={(values) => {
          const productId = parseInt(values.id_product, 10);
          if (isNaN(productId)) {
            notification.error({
              message: "Invalid product ID",
              description: "Please enter a valid product ID.",
            });
            return;
          }

          const productData = {
            name: values.name,
            material: values.material,
            overview: values.overview,
            price: parseInt(values.price, 10),
            type: values.type,
            person: values.person,
          };
          updateProduct(productId, productData);
        }}
      >
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
            <Option value="Polo shirt">Polo Shirt</Option>
            <Option value="T-Shirt">T-Shirt</Option>
            <Option value="dress">Dress</Option>
          </Select>
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

export default UpdateProduct;
