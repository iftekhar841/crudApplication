import { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { checkIsValidEmail } from "../utils/helperFunctions.js";

//Generate Access and Refresh Tokens
const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken(); // Call synchronously
    const refreshToken = user.generateRefreshToken(); // Call synchronously

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong, while generating refresh and access token"
    );
  }
};

// Register a new user
const register = async (userDetails) => {
  const { firstName, lastName, email, password, role } = userDetails;

  if (
    [firstName, lastName, email, password].some(
      (field) => !field || field?.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required, Cannot be empty");
  }

  const validEmail = checkIsValidEmail(email);
  if (!validEmail) {
    throw new ApiError(400, "Invalid email address");
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(400, "Email already exists");
  }
  // Capitalize the first letter of firstName and lastName and convert the rest to lowercase
  const formattedFirstName =
    firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
  const formattedLastName =
    lastName.charAt(0).toUpperCase() + lastName.slice(1).toLowerCase();

  // Create a new user with formatted first name and last name
  const newUser = await User.create({
    firstName: formattedFirstName,
    lastName: formattedLastName,
    email,
    password,
    role: role,
  });

  // Fetch the created user excluding password and refreshToken fields
  const createdUser = await User.findById(newUser._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return createdUser;
};

//Login User
const login = async (loginDetails) => {
  //TODO
  // req.body - data
  //email exists
  //find the user
  //check password
  //access & refresh token generation
  //send tokens in secure cookies

  const { email, password } = loginDetails;

  if (!email || !password) {
    throw new ApiError(400, "Email or PassWord are required.");
  }

  const user = await User.findOne({ email: email });

  if (!user) {
    throw new ApiError(404, "User does not exists");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials.");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  return {
    loggedInUser,
    accessToken,
    refreshToken,
  };
};

// Update User
const updateUser = async (userDetails) => {
  const {
    firstName,
    lastName,
    email,
    password,
    role,
    _id: userId,
  } = userDetails;

  const isValid = isValidObjectId(userId);
  if (!isValid) {
    throw new ApiError(400, "Invalid user id");
  }

  // Find the existing user by ID
  const existingUser = await User.findById(userId);
  if (!existingUser) {
    throw new ApiError(404, "User not found");
  }

  // If email is provided, check for validity and uniqueness
  if (email) {
    const validEmail = checkIsValidEmail(email);
    if (!validEmail) {
      throw new ApiError(400, "Invalid email address");
    }
    const userWithSameEmail = await User.findOne({ email });
    if (userWithSameEmail && userWithSameEmail._id.toString() !== userId) {
      throw new ApiError(400, "Email already exists");
    }
    // Update user properties
    existingUser.email = email;
  }
  // Capitalize the first letter of firstName and lastName and convert the rest to lowercase
  const formattedFirstName =
    firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
  const formattedLastName =
    lastName.charAt(0).toUpperCase() + lastName.slice(1).toLowerCase();

  // Update user properties if provided
  if (firstName) {
    existingUser.firstName = formattedFirstName;
  }
  if (lastName) {
    existingUser.lastName = formattedLastName;
  }
  if (password) {
    existingUser.password = password;
  }
  if (role) {
    existingUser.role = role;
  }
  // Save the changes to the user
  await existingUser.save();

  return existingUser;
};

// Delete user
const deleteUser = async (queryParams, loggedInUser) => {
  const { userId } = queryParams;
  const isValid = isValidObjectId(userId);
  if (!isValid) {
    throw new ApiError(400, "Invalid user id");
  }
  // Find the existing user by ID
  const existingUser = await User.findById(userId);
  if (!existingUser) {
    throw new ApiError(404, "User not found");
  }

  // Delete the user document
  await User.deleteOne({ _id: userId });
  return {
    message: "User deleted successfully",
  };
};

// Get All Users
const getAllUsers = async () => {
  const users = await User.find().lean();

  if (users.length === 0) {
    throw new ApiError(404, "No users found");
  }

  return users;
};

export default {
  register,
  login,
  updateUser,
  deleteUser,
  getAllUsers,
};
