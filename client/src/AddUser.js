import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddUserForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch("http://localhost:5000/api/v1/users/register", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
  
      // Parse the JSON response data
      const registerResponse = await response.json();
      console.log("registerResponse: " , registerResponse);
  
      // Check the message from the response
      if (registerResponse.message === 'User registered successfully') {
        alert(registerResponse.message);
        navigate('/');
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          role: ''
        });
      } else if (registerResponse.message === 'Email already exists') {
        alert(registerResponse.message);
        setFormData({
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            role: ''
          });
      } else if (registerResponse.message === 'All fields are required, Cannot be empty') {
        alert(registerResponse.message);
      }
    } catch (error) {
      console.error('Error registering user:', error);
      // Handle error (e.g., display error message to user)
    }
  };
  

  return (
    <div>
      <h2>Add User</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="firstName">First Name:</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="lastName">Last Name:</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="role">Role:</label>
          <input
            type="text"
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default AddUserForm;
