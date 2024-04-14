import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const baseUrl = "http://localhost:5000/api/v1/users"
const LoginForm = () => {
  const navigate = useNavigate();  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const requestBody = {
      email: username,
      password: password
    };
  
    try {
      const loginData = await fetch(`${baseUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody) // Convert request body to JSON string
      });
  
      const data = await loginData.json();
      console.log("--->",data);
      if(data.message === 'Invalid user credentials.') {
        alert(data.message);
      } else if(data.message === 'User does not exists') {
        alert(data.message);
      } else if( data.message === 'User logged in Successfully') {
        alert(data.message);
        localStorage.setItem('accessToken', JSON.stringify(data.data.accessToken));
        localStorage.setItem('userRole', JSON.stringify(data.data.user.role));
        navigate("/users");
      }
    } catch (error) {
      console.error('Error:', error);
      // Handle error (e.g., display error message to user)
    }
  };
  

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="username">Email:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginForm;