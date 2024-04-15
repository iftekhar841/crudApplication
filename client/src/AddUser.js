import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddUserForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:5000/api/v1/users/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      // Parse the JSON response data
      const registerResponse = await response.json();
      // Check the message from the response
      if (registerResponse.message === "User registered successfully") {
        alert(registerResponse.message);
        navigate("/");
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          role: "",
        });
      } else if (registerResponse.message === "Email already exists") {
        alert(registerResponse.message);
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          role: "",
        });
      } else if (
        registerResponse.message === "All fields are required, Cannot be empty"
      ) {
        alert(registerResponse.message);
      }
    } catch (error) {
      console.error("Error registering user:", error);
      // Handle error (e.g., display error message to user)
    }
  };

  return (
    <div
      className="w-100 d-flex justify-content-center align-items-center"
      style={{ height: "100vh" }}
    >
      <form onSubmit={handleSubmit} className="form-control w-50 px-5 py-1">
        <h2 className="mb-3">Add User</h2>
        <div>
          <label className="mb-2" htmlFor="firstName">
            First Name:
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            placeholder="First Name"
            className="form-control mb-3"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="mb-2" htmlFor="lastName">
            Last Name:
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            placeholder="Last Name"
            className="form-control mb-3"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="mb-2" htmlFor="email">
            Email:
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Email Address"
            className="form-control mb-3"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="mb-2" htmlFor="password">
            Password:
          </label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Password"
            className="form-control mb-3"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="mb-2" htmlFor="role">
            Role:
          </label>
          <input
            type="text"
            id="role"
            name="role"
            placeholder="Role"
            className="form-control mb-3"
            value={formData.role}
            onChange={handleChange}
            required
          />
        </div>
        <div className="d-flex justify-content-center mb-3">
          <button className="btn btn-success" type="submit">
            Register
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddUserForm;
