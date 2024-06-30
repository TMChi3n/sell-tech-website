import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Menu } from "antd";
import {
  UserOutlined,
  ProductOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { setUser } from "../redux/userSlice.js";
import ManagementProduct from "../components/product/productPage";
import UserList from "../components/user/userPage";
import OrdersList from "../components/order/ordersList.jsx";

function AdminPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const items = [
    {
      key: "sub1",
      icon: null,
      children: [
        { key: "user", icon: <UserOutlined />, label: "Users" },
        { key: "product", icon: <ProductOutlined />, label: "Products" },
        { key: "order", icon: <ShoppingCartOutlined />, label: "Orders" },
      ],
      label: "Management",
    },
  ];

  const [current, setCurrent] = useState("");

  const onClick = (e) => {
    setCurrent(e.key);
  };

  const handleRenderPage = (type) => {
    switch (type) {
      case "product":
        return <ManagementProduct />;
      case "user":
        return <UserList />;
      case "order":
        return <OrdersList />;
      default:
        return <div>Select a menu item to view</div>;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_info");
    navigate("/login");
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Menu
        onClick={onClick}
        style={{
          width: 256,
          height: "100vh",
          position: "fixed",
          top: 60,
          left: 0,
        }}
        defaultOpenKeys={["sub1"]}
        selectedKeys={[current]}
        mode="inline"
        items={items}
      />
      <div style={{ marginLeft: "256px", padding: "15px 15px", flex: 1 }}>
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h1>Clothes Shop</h1>

          <div>
            <button
              onClick={handleLogout}
              style={{
                padding: "10px 20px",
                backgroundColor: "red",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          </div>
        </header>
        {handleRenderPage(current)}
      </div>
    </div>
  );
}

export default AdminPage;
