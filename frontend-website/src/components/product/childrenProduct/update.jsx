import React, { useState } from "react";
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

const { Option } = Select;

const UpdateProduct = ({ form, isDrawerOpen, onClose, updateProduct }) => {
  const [fileList, setFileList] = useState([]);
  const [existingImage, setExistingImage] = useState(null);

  const handleUploadChange = (info) => {
    setFileList(info.fileList);
    form.setFieldsValue({
      img_url: info.fileList,
    });
  };

  const handleRemoveImage = () => {
    setExistingImage(null);
    setFileList([]);
    form.setFieldsValue({
      img_url: null,
    });
  };

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
            price: parseFloat(values.price),
            type: values.type,
            person: values.person,
            img_url:
              existingImage ||
              (values.img_url &&
                values.img_url[0] &&
                values.img_url[0].originFileObj),
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

        <Form.Item label="Image" name="img_url">
          <Upload
            name="img"
            listType="picture"
            fileList={fileList}
            beforeUpload={() => false}
            onChange={handleUploadChange}
            onRemove={handleRemoveImage}
          >
            <Button icon={<UploadOutlined />}>Click to upload</Button>
          </Upload>
          {existingImage && (
            <div>
              <img
                src={existingImage}
                alt="Existing"
                style={{ width: "100px", marginTop: "10px" }}
              />
              <Button onClick={handleRemoveImage}>Remove Image</Button>
            </div>
          )}
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
