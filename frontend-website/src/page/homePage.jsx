import React, { useState } from "react";
import {
  UserOutlined,
  ProductOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import ManagementProduct from "../components/product/productPage";
import UserList from "../components/user/userPage";

function AdminPage() {
  function getItem(label, key, icon, children, type) {
    return {
      key,
      icon,
      children,
      label,
      type,
    };
  }

  const items = [
    getItem("Management", "sub1", null, [
      getItem("Users", "user", <UserOutlined />),
      getItem("Products", "product", <ProductOutlined />),
      getItem("Orders", "order", <ShoppingCartOutlined />),
    ]),
  ];

  const [current, setCurrent] = useState("");

  const onClick = (e) => {
    setCurrent(e.key);
  };
  console.log(current);

  const handleRenderPage = (type) => {
    switch (type) {
      case "product":
        return <ManagementProduct />;
      case "user":
        return <UserList />;
      default:
        return <></>;
    }
  };

  return (
    <div style={{ display: "flex" }}>
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
      <div
        style={{
          marginLeft: "350px",
          padding: "15px 0 15px 15px",
          flex: "1",
        }}
      >
        <header style={{ marginBottom: "20px" }}>
          <h1>Clothes Shop</h1>
        </header>
        {handleRenderPage(current)}
      </div>
    </div>
  );
}

export default AdminPage;
