import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const baseUrl = "http://localhost:5000/api/v1/users";
const LoginForm = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requestBody = {
      email: username,
      password: password,
    };

    try {
      const loginData = await fetch(`${baseUrl}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody), // Convert request body to JSON string
      });

      const data = await loginData.json();
      console.log("--->", data);
      if (data.message === "Invalid user credentials.") {
        alert(data.message);
      } else if (data.message === "User does not exists") {
        alert(data.message);
      } else if (data.message === "User logged in Successfully") {
        alert(data.message);
        localStorage.setItem(
          "accessToken",
          JSON.stringify(data.data.accessToken)
        );
        localStorage.setItem("userRole", JSON.stringify(data.data.user.role));
        navigate("/users");
      }
    } catch (error) {
      console.error("Error:", error);
      // Handle error (e.g., display error message to user)
    }
  };

  return (
    <div
      className="w-100 d-flex justify-content-center align-items-center"
      style={{ height: "100vh" }}
    >
      <form onSubmit={handleSubmit} className="form-control w-50 p-5">
        <h3 className="mb-3">Login</h3>
        <div>
          <label className="mb-2" htmlFor="username">
            Email:
          </label>
          <input
            type="text"
            id="username"
            className="form-control mb-3"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="Email address"
          />
        </div>
        <div>
          <label className="mb-2" htmlFor="password">
            Password:
          </label>
          <input
            type="password"
            id="password"
            className="form-control mb-3"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Password"
          />
        </div>
        <div className="d-flex justify-content-center mb-3">
          <button className="btn btn-success" type="submit">
            Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
