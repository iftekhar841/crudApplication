import React, { useState, useEffect } from "react";
import AddUserForm from "./AddUser"; // Import the AddUserForm component
import { EditUserForm } from "./EditUserForm";

const baseUrl = "http://localhost:5000/api/v1/users";
const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [showAddUserForm, setShowAddUserForm] = useState(false); // State to control the visibility of the add user form
  const [showEditForm, setShowEditForm] = useState(false); // State to control the visibility of the edit form
  const [editUserData, setEditUserData] = useState(null); // State to hold the data of the user being edited
  const [userRole, setUserRole] = useState(null); // State to track if the logged-in user is an admin
  // Example of fetched user data (replace with actual API call)
  useEffect(() => {
    // Replace this fetch call with your actual API call to fetch users
    const fetchData = async () => {
      try {
        // Fetch user data from API
        const response = await fetch(`${baseUrl}/`);
        const userData = await response.json();
        setUsers(userData.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchData();
  }, []);

  // Check if the logged-in user is an admin
  useEffect(() => {
    // Logic to check if the logged-in user is an admin
    // For demonstration purposes, let's assume admin role is stored in localStorage
    const role = JSON.parse(localStorage.getItem("userRole"));
    setUserRole(role);
  }, []);

  const handleEdit = (user) => {
    setEditUserData(user);
    setShowEditForm(true);
  };

  const handleEditSubmit = async (editedUserData) => {
    try {
      // Get the access token from local storage
      const accessToken = JSON.parse(localStorage.getItem("accessToken"));
      // Fetch user data for the specified
      const response = await fetch(`${baseUrl}/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(editedUserData), // Convert request body to JSON string
      }).then(() => {
        window.location.reload();
      });
      // Check the message from the response
      const editResponse = await response.json();
      if (editResponse.message === "Unauthorized request") {
        alert(editResponse.message);
      } else if (editResponse.message === "Invalid Access Token") {
        alert(editResponse.message);
      } else {
        // Update the user in the state with the edited data
        setUsers(
          users.map((user) =>
            user._id === editResponse._id ? editResponse.data : user
          )
        );
        setShowEditForm(false);
      }
    } catch (error) {
      console.error("Error editing user:", error);
    }
  };

  const handleDelete = async (userId) => {
    try {

      // Get the access token from local storage
      const accessToken = JSON.parse(localStorage.getItem("accessToken"));

      // Send delete request to the backend
      const deleteUserResponse = await fetch(
        `${baseUrl}/delete?userId=${userId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      // Check the message from the response
      const deleteResponseData = await deleteUserResponse.json();
      if (deleteResponseData.message === "Unauthorized request") {
        alert(deleteResponseData.message);
        // Handle unauthorized access gracefully (e.g., display a notification)
        return; // Exit function to prevent further execution
      } else if (deleteResponseData.message === "Invalid Access Token") {
        alert(deleteResponseData.message);
      } else if (
        deleteResponseData.data.message === "User deleted successfully"
      ) {
        alert(deleteResponseData.data.message);
        // Remove the deleted user from the state
        setUsers(users.filter((user) => user._id !== userId));
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleAddUser = () => {
    // Implement add functionality (e.g., navigate to add page)
    setShowAddUserForm(true);
  };

  return (
    <>
      {showAddUserForm ? (
        <AddUserForm />
      ) : showEditForm ? (
        // Render the edit form if showEditForm is true
        <EditUserForm
          user={editUserData}
          onSubmit={handleEditSubmit}
          onCancel={() => setShowEditForm(false)}
        />
      ) : (
        <>
          <div className="p-5 ">
            <h2 className="text-center mb-2"> User Table</h2>
            <table className="table border ">
              <thead>
                <tr>
                  <th>FirstName</th>
                  <th>LastName</th>
                  <th>Role</th>
                  <th>Email</th>
                  <th style={{ width: "130px" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users?.map((user) => (
                  <tr key={user._id}>
                    <td>{user.firstName}</td>
                    <td>{user.lastName}</td>
                    <td>{user.role}</td>
                    <td>{user.email}</td>
                    {userRole === "admin" && user.role !== "admin" && (
                      <td className="d-flex gap-2"> {/* Use flexbox to align buttons horizontally */}
                        <button
                          className="btn btn-success mx-1"
                          onClick={() => handleEdit(user)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger mx-1"
                          onClick={() => handleDelete(user._id)}
                        >
                          Delete
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="d-flex justify-content-center my-3">
              <button className="btn btn-primary " onClick={handleAddUser}>
                Add User
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default UserTable;
