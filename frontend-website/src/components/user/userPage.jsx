import React, { useState, useEffect } from "react";
import { Table, Spin, Alert } from "antd";
import { getAllUsers } from "../../apis/apisRequest";
import ImageError from "../../assets/images/images.jpeg";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getAllUsers();
        console.log('Response from API:', response); // Add logging
        setUsers(response || []); // Ensure response is always an array
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading) {
    return <Spin tip="Loading users..." />;
  }

  if (error) {
    return <Alert message="Error" description={error.message} type="error" showIcon />;
  }

  const columns = [
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Avatar",
      dataIndex: "avatar",
      key: "avatar",
      render: (avatar) => {
        const img_avatar = avatar?.data
          ? String.fromCharCode(...avatar.data)
          : ImageError;
        return (
          <img
            src={img_avatar}
            alt="User"
            style={{ width: "50px", height: "50px", objectFit: "cover" }}
          />
        );
      },
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Birthday",
      dataIndex: "birthday",
      key: "birthday",
    },
    {
      title: "Phone",
      dataIndex: "phone_number",
      key: "phone_number",
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (isRole) => (
        <div>
          <h5>{isRole ? "Admin" : "Customer"}</h5>
        </div>
      ),
    },
  ];

  const data = users.map((user, index) => ({
    key: index,
    username: user.username,
    email: user.email,
    gender: user.gender,
    avatar: user.avatar,
    birthday: user.birthday,
    address: user.address,
    phone_number: user.phone_number,
    role: user.isRole,
  }));

  return (
    <div>
      <h4 style={{ marginBottom: "50px", marginTop: "20px" }}>Users List</h4>
      <Table columns={columns} dataSource={data} style={{ width: "1000px", height: "100%" }} />
    </div>
  );
};

export default UserList;
