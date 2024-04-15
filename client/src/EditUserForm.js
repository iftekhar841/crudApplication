import { useState } from "react";

// EditUserForm component
export const EditUserForm = ({ user, onSubmit, onCancel }) => {
  const [editedUser, setEditedUser] = useState(user);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser({ ...editedUser, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(editedUser);
  };

  return (
    <div
      className="w-100 d-flex justify-content-center align-items-center"
      style={{ height: "100vh" }}
    >
      <form onSubmit={handleSubmit} className="form-control w-50 row p-5">
        <h2 className="mb-3">Edit User</h2>
        <label className="mb-2 col-lg-12 col-12">
          First Name:
          <input
            type="text"
            name="firstName"
            className="form-control w-100 mt-2"
            value={editedUser.firstName}
            onChange={handleChange}
          />
        </label>
        <label className="mb-2 col-lg-12 col-12">
          Last Name:
          <input
            type="text"
            name="lastName"
            className="form-control w-100 mt-2"
            value={editedUser.lastName}
            onChange={handleChange}
          />
        </label>
        <label className="mb-2 col-lg-12 col-12">
          Email:
          <input
            type="email"
            name="email"
            className="form-control w-100 mt-2"
            value={editedUser.email}
            onChange={handleChange}
          />
        </label>
        <label className="mb-2 col-lg-12 col-12">
          Role:
          <input
            type="text"
            name="role"
            className="form-control w-100 mt-2"
            value={editedUser.role}
            onChange={handleChange}
          />
        </label>
        <div className="d-flex justify-content-center my-3">
          <button className="mx-1 btn btn-success" type="submit">
            Submit
          </button>
          <button
            className="mx-1 btn btn-danger"
            type="button"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};
