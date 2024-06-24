import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { resetPassword } from "../../../apis/apisRequest.jsx";

const ChangePassword = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const location = useLocation();
  const [token, setToken] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");
    setToken(token); // Store token in state
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    const resetPasswordData = {
      email,
      token, // Ensure token is included
      newPassword,
      confirmPassword,
    };

    console.log("Reset Password Data:", resetPasswordData); // Log data being sent

    try {
      const response = await resetPassword(token, resetPasswordData);
      setMessage(response.message);
      navigate("/login"); // Redirect to login page after successful reset
    } catch (error) {
      console.error("Error resetting password:", error);
      setMessage("Failed to reset password. Please try again.");
    }
  };

  return (
    <div>
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>New Password:</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Confirm Password:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Reset Password</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ChangePassword;
