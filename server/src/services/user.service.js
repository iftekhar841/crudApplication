import { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { checkIsValidEmail } from "../utils/helperFunctions.js";

//Generate Access and Refresh Tokens
const generateAccessAndRefreshTokens = async (userId) => {
    try {
      const user = await User.findById(userId);
      console.log("user--->", user);
      const accessToken = user.generateAccessToken(); // Call synchronously
      console.log("accessToken--->", accessToken);
      const refreshToken = user.generateRefreshToken(); // Call synchronously
      console.log("refreshToken--->", refreshToken);
  
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
   
    const { firstName, lastName, email, password, role } = userDetails
    console.log("userdetails", userDetails);

    if(
        [firstName, lastName, email, password].some((field) => !field || field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required, Cannot be empty");
    }

    const validEmail = checkIsValidEmail(email);
    if(!validEmail) {
        throw new ApiError(400, "Invalid email address");
    }

    const existingUser = await User.findOne({ email });

    if(existingUser) {
        throw new ApiError(400, "Email already exists");
    }
     // Capitalize the first letter of firstName and lastName and convert the rest to lowercase
     const formattedFirstName = firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
     const formattedLastName = lastName.charAt(0).toUpperCase() + lastName.slice(1).toLowerCase();

    // Create a new user with formatted first name and last name
    const newUser = await User.create({
        firstName: formattedFirstName,
        lastName: formattedLastName,
        email,
        password,
        role: role
    });

    console.log("New user", newUser);
    // Fetch the created user excluding password and refreshToken fields
    const createdUser = await User.findById(newUser._id).select("-password -refreshToken");

    if(!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user");
    }

    return createdUser;
}

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
    console.log("login", loginDetails);
  
    if (!email || !password) {
      throw new ApiError(400, "Email or PassWord are required.");
    }
  
    const user = await User.findOne({ email: email });
  
    if (!user) {
      throw new ApiError(404, "User does not exists");
    }
  
    const isPasswordValid = await user.isPasswordCorrect(password);
    console.log("isPasswordValid", isPasswordValid);
  
    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid user credentials.");
    }
    console.log("user", user);
  
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
const updateUser = async (userDetails, queryParams, loggedInUser) => {
    const { firstName, lastName, email, password } = userDetails;
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

     // Update user properties if provided
     if (firstName) {
        existingUser.firstName = firstName;
    }
    if (lastName) {
        existingUser.lastName = lastName;
    }
    if (password) {
        existingUser.password = password;
    }

    // Save the changes to the user
    await existingUser.save();
    
    return existingUser;
};

// Delete user 
const deleteUser = async (queryParams, loggedInUser) => {
    console.log("logged in user", loggedInUser);
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

    if(existingUser._id.toString() !== loggedInUser.toString()) {
        throw new ApiError(401, "You are not authorized to delete own user");
    }

    // Delete the user document
         await User.deleteOne({ _id: userId});
    return {
        message: "User deleted successfully"
    };

}


// Get All Users
const getAllUsers = async () => {
    const users = await User.find().lean();
    
    if(users.length === 0) {
        throw new ApiError(404, "No users found");
    }

    return users;
}


export default {
    register,
    login,
    updateUser,
    deleteUser,
    getAllUsers
}