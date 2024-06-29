import React, { useState, useEffect } from "react";
import { Table, Spin, Alert, Select } from "antd";
import { getAllOrders, updateOrderStatus } from "../../apis/apisRequest";
import { useSelector } from "react-redux";

const { Option } = Select;

const OrdersList = () => {
  const user = useSelector((state) => state.user);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await getAllOrders(user.access_token);
        res.forEach((order) => {
          console.log("Order ID:", order.id_order);
        });
        setOrders(res || []);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  const handleStatusChange = async (id_order, status) => {
    try {
      console.log(`Updating order ${id_order} to status ${status}`);
      await updateOrderStatus(id_order, status, user.access_token);
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id_order === id_order ? { ...order, status } : order
        )
      );
      console.log(`Successfully updated order ${id_order} to status ${status}`);
    } catch (err) {
      console.error("Error updating status", err);
      setError(err);
    }
  };

  if (loading) {
    return <Spin tip="Loading orders..." />;
  }

  if (error) {
    return (
      <Alert
        message="Error"
        description={error.message}
        type="error"
        showIcon
      />
    );
  }

  const columns = [
    {
      title: "ID order",
      dataIndex: "id_order",
      key: "id_order",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text, record) => (
        <Select
          value={text}
          onChange={(value) => handleStatusChange(record.id_order, value)}
        >
          <Option value="pending">Pending</Option>
          <Option value="processing">Processing</Option>
          <Option value="completed">Completed</Option>
          <Option value="cancelled">Cancelled</Option>
        </Select>
      ),
    },
    {
      title: "Order date",
      dataIndex: "order_date",
      key: "order_date",
    },
    {
      title: "Completed date",
      dataIndex: "completed_date",
      key: "completed_date",
    },
    {
      title: "Total Quantity",
      dataIndex: "total_quantity",
      key: "total_quantity",
    },
    {
      title: "Total Price",
      dataIndex: "total_price",
      key: "total_price",
    },
  ];

  const expandedRowRender = (record) => {
    const orderItemColumns = [
      {
        title: "Product ID",
        dataIndex: "id_product",
        key: "id_product",
      },
      {
        title: "Quantity",
        dataIndex: "quantity",
        key: "quantity",
      },
      {
        title: "Price",
        dataIndex: "price",
        key: "price",
      },
      {
        title: "Address",
        dataIndex: "address",
        key: "address",
      },
      {
        title: "Phone number",
        dataIndex: "phone_number",
        key: "phone_number",
      },
    ];

    return (
      <Table
        columns={orderItemColumns}
        dataSource={record.orderItems}
        pagination={false}
        rowKey={(item) => item.id_order_detail}
      />
    );
  };

  const data = orders.map((order) => ({
    key: order.id_order,
    id_order: order.id_order,
    status: order.status,
    order_date: order.order_date,
    completed_date: order.completed_date,
    total_quantity:
      order.orderItems?.reduce((acc, item) => acc + item.quantity, 0) || 0,
    total_price:
      order.orderItems?.reduce((acc, item) => acc + item.price, 0) || 0,
    orderItems: order.orderItems || [],
  }));

  return (
    <div>
      <h4 style={{ marginBottom: "50px", marginTop: "20px" }}>Orders List</h4>
      <Table
        columns={columns}
        expandable={{ expandedRowRender }}
        dataSource={data}
        style={{ width: "1000px", height: "100%" }}
      />
    </div>
  );
};

export default OrdersList;
