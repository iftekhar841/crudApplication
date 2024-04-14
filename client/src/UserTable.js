import React, { useState, useEffect } from 'react';
import AddUserForm from './AddUser'; // Import the AddUserForm component
  
const baseUrl = "http://localhost:5000/api/v1/users"
const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [showAddUserForm, setShowAddUserForm] = useState(false); // State to control the visibility of the add user form
  const [userRole, setUserRole] = useState(null); // State to track if the logged-in user is an admin
    console.log("Userrole", userRole);
  // Example of fetched user data (replace with actual API call)
  useEffect(() => {
    // Replace this fetch call with your actual API call to fetch users
    const fetchData = async () => {
      try {
        // Fetch user data from API
        const response = await fetch(`${baseUrl}/`);
        const userData = await response.json();
        console.log("data", userData);
        setUsers(userData.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchData();
  }, []);

  // Check if the logged-in user is an admin
  useEffect(() => {
      // Logic to check if the logged-in user is an admin
      // For demonstration purposes, let's assume admin role is stored in localStorage
      const role = localStorage.getItem('userRole');
      console.log("userRole----->", role);
        setUserRole(role);
  }, []);

  const handleEdit = async (userId) => {
    try {
      // Fetch user data for the specified userId
      const response = await fetch(`${baseUrl}/update?userId=${userId}`);
      const userData = await response.json();
      console.log("data", userData);

      // Update the user in the state with the edited data
      setUsers(users.map(user => (user._id === userId ? userData.data : user)));
    } catch (error) {
      console.error('Error editing user:', error);
    }
  };

  const handleDelete = async (userId) => {
    try {
      console.log('Delete user:', userId);

      // Get the access token from local storage
      const accessToken = JSON.parse(localStorage.getItem('accessToken'));
      console.log("access token", accessToken);

      // Send delete request to the backend
      const deleteUserResponse = await fetch(`${baseUrl}/delete?userId=${userId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${accessToken}`
          }
      });

      // Check the message from the response
      const deleteResponseData = await deleteUserResponse.json();
      console.log("deleteResponseData", deleteResponseData);
      if (deleteResponseData.message === 'Unauthorized request') {
        alert(deleteResponseData.message);
        // Handle unauthorized access gracefully (e.g., display a notification)
      console.log('User not authorized to delete.');
      return; // Exit function to prevent further execution
      } else if(deleteResponseData.message === 'Invalid Access Token') {
        alert(deleteResponseData.message);
      } else if(deleteResponseData.message === 'You are not authorized to delete own user') {
        alert(deleteResponseData.message);
      }
    else if(deleteResponseData.data.message === 'User deleted successfully') {
        alert(deleteResponseData.data.message);
      // Remove the deleted user from the state
      setUsers(users.filter(user => user._id !== userId));
      } 
  
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };
  

  const handleAddUser = () => {
    // Implement add functionality (e.g., navigate to add page)
    console.log('Add user');
    setShowAddUserForm(true);
    
  };
return (
    <>
      {showAddUserForm ? (
        <AddUserForm /> // Render the AddUserForm component if showAddUserForm is true
      ) : (
        <>
          <table>
            <thead>
              <tr>
                <th>FirstName</th>
                <th>LastName</th>
                <th>Role</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users?.map((user) => (
                <tr key={user._id}>
                  <td>{user.firstName}</td>
                  <td>{user.lastName}</td>
                  <td>{user.role}</td>
                  <td>{user.email}</td>
                  {console.log("UserRole in JSX:", userRole)}
                  {console.log("UserRole ----->344:", user.role)}

                  {user.role === "admin" && ( // Show edit/delete only for non-admin users if logged in
                   <td>
                      <button onClick={() => handleEdit(user._id)}>Edit</button>
                      <button onClick={() => handleDelete(user._id)}>Delete</button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          <div>
            <button onClick={handleAddUser}>Add User</button>
          </div>
        </>
      )}
    </>
  );
};

export default UserTable;