import React from "react";
import { Table, Button, Space } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import ImageError from "../../../assets/images/images.jpeg";

const Tables = ({ products, handleEdit, handleDelete }) => {
  const fields = [
    {
      title: "ID",
      dataIndex: "id_product",
      key: "id_product",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Material",
      dataIndex: "material",
      key: "material",
    },
    {
      title: "Overview",
      dataIndex: "overview",
      key: "overview",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Image",
      dataIndex: "img_url",
      key: "img_url",
      render: (img_url) => {
        const img = img_url?.data
          ? String.fromCharCode(...img_url.data)
          : ImageError;
        return (
          <img
            src={img}
            alt="Product"
            style={{ width: "50px", height: "50px", objectFit: "cover" }}
          />
        );
      },
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Person",
      dataIndex: "person",
      key: "person",
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Button
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id_product)}
          />
        </Space>
      ),
    },
  ];

  return (
    <Table
      dataSource={products}
      columns={fields}
      rowKey={(record) => record.id_product}
    />
  );
};

export default Tables;
