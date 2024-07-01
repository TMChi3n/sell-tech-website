import React, { useState, useEffect } from "react";
import { Table, Spin, Alert, Select, message } from "antd";
import { getAllUsers, setPermissionRole } from "../../apis/apisRequest";
import ImageError from "../../assets/images/images.jpeg";
import { useSelector } from "react-redux";

const { Option } = Select;

const UserList = () => {
  const user = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getAllUsers();
        console.log("Response from API:", response); // Add logging
        setUsers(response || []); // Ensure response is always an array
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [user]);

  const handleChangeRole = async (id_user, role) => {
    try {
      await setPermissionRole(id_user, role, user.access_token);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id_user === id_user ? { ...user, role } : user
        )
      );
      message.success("Role updated successfully");
    } catch (err) {
      message.error("Failed to update role");
    }
  };

  if (loading) {
    return <Spin tip="Loading users..." />;
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
      title: "ID User",
      dataIndex: "id_user",
      key: "id_user",
    },
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
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role, record) => (
        <Select
          defaultValue={role}
          style={{ width: 120 }}
          onChange={(newRole) => handleChangeRole(record.id_user, newRole)}
        >
          <Option value="user">User</Option>
          <Option value="admin">Admin</Option>
        </Select>
      ),
    },
  ];

  const expandedRowRender = (record) => {
    return (
      <div>
        <p>
          <b>Phone Number:</b> {record.phone_number}
        </p>
        <p>
          <b>Address:</b> {record.address}
        </p>
        <p>
          <b>Gender:</b> {record.gender}
        </p>
        <p>
          <b>Birthday:</b> {record.birthday}
        </p>
      </div>
    );
  };

  const data = users.map((user, index) => ({
    key: index,
    id_user: user.id_user,
    username: user.username,
    email: user.email,
    gender: user.gender,
    avatar: user.avatar,
    birthday: user.birthday,
    address: user.address,
    phone_number: user.phone_number,
    role: user.role,
  }));

  return (
    <div>
      <h4 style={{ marginBottom: "50px", marginTop: "20px" }}>Users List</h4>
      <Table
        columns={columns}
        dataSource={data}
        expandable={{
          expandedRowRender,
        }}
        style={{ width: "1000px", height: "100%" }}
      />
    </div>
  );
};

export default UserList;
