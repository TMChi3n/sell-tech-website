import React from "react";
import { Input, Button, Form } from "antd";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { loginAccount, getUserById } from "../../../apis/apisRequest";
import { error, success } from "../../messages/message";
import { setUser } from "../../../redux/userSlice";
import { WrapperContainerLeft } from "./style";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (values) => {
    try {
      const result = await loginAccount(values);
      if (result && result.access_token) {
        success("Login success");
        localStorage.setItem("access_token", result.access_token);
        localStorage.setItem("refresh_token", result.refresh_token);
  
        const decoded = jwtDecode(result.access_token);
        const userInfo = await getUserById(decoded?.sub, result.access_token);
  
        const user = { ...userInfo.data, access_token: result.access_token };
  
        localStorage.setItem("user_info", JSON.stringify(user));
  
        dispatch(setUser(user));
  
        navigate("/");
      } else {
        console.log("Error: ", result ? result.message : "No response"); // Debugging
        error(result ? result.message : "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err); // Debugging
      error("The email and/or password incorrect! Please try again");
    }
  };  

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0, 0, 0, 0.53)",
        height: "100vh",
      }}
    >
      <div
        id="sign-in-form"
        style={{
          width: "600px",
          height: "400px",
          borderRadius: "6px",
          background: "#fff",
          display: "flex",
          position: "relative",
        }}
      >
        <WrapperContainerLeft>
          <h1 style={{ marginBottom: "20px", textAlign: "center" }}>
            Welcome!
          </h1>
          <Form
            onFinish={handleLogin}
            style={{ display: "flex", flexDirection: "column", gap: "5px" }}
          >
            <Form.Item
              name="email"
              rules={[
                {
                  required: true,
                  message: "Required",
                },
              ]}
            >
              <Input placeholder="Email" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: "Required" }]}
            >
              <Input.Password placeholder="Password" />
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              style={{
                backgroundColor: "red",
                borderColor: "red",
              }}
            >
              Sign In
            </Button>
          </Form>
        </WrapperContainerLeft>
      </div>
    </div>
  );
};

export default Login;
