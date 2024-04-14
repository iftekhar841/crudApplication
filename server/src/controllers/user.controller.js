import userService from "../services/user.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const register = asyncHandler( async (req, res) => {
    try {
        const userDetails = req.body;
        const userResponse = await userService.register(userDetails);

        return res.status(201).json( new ApiResponse(201, userResponse, "User registered successfully"))

    } catch (error) {
        const statusCode = error.statusCode || 500;
        const errorMessage = error.message || "Internal Server Error";
        return res.status(statusCode).json({
            statusCode,
            message: errorMessage, // Include the error message directly
            data: null,
            success: false,
            error: [],
        });
    }
});


const login = asyncHandler(async (req, res) => {
    try {
      const { loggedInUser, accessToken, refreshToken } = await userService.login(req.body);
  
      // Set cookie options
      const options = {
        httpOnly: true,
        secure: true,
      };
  
      return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
          new ApiResponse(
            200,
            { user: loggedInUser, accessToken, refreshToken },
            "User logged in Successfully"
          )
        );
    } catch (error) {
        const statusCode = error.statusCode || 500;
        const errorMessage = error.message || "Internal Server Error";
        return res.status(statusCode).json({
            statusCode,
            message: errorMessage, // Include the error message directly
            data: null,
            success: false,
            error: [],
        });
    }
});


const updateUser = asyncHandler(async (req, res) => {
    try {
        const loggedInUser = req.user;
        const updateResponse = await userService.updateUser(
            req.body,
            req.query,
            loggedInUser
        )

        return res.status(200).json( new ApiResponse(200, updateResponse, "User updated successfully"));
        
    } catch (error) {
        const statusCode = error.statusCode || 500;
        const errorMessage = error.message || "Internal Server Error";
        return res.status(statusCode).json({
            statusCode,
            message: errorMessage, // Include the error message directly
            data: null,
            success: false,
            error: [],
        });
    }
})

const deleteUser = asyncHandler (async (req, res) => {
    try {
        const loggedInUser = req.user._id;
        const deleteResponse = await userService.deleteUser(
            req.query,
            loggedInUser
        )
        
        return res.status(200).json( new ApiResponse(200, deleteResponse, "User deleted successfully"));
        
    } catch (error) {
        const statusCode = error.statusCode || 500;
        const errorMessage = error.message || "Internal Server Error";
        return res.status(statusCode).json({
            statusCode,
            message: errorMessage, // Include the error message directly
            data: null,
            success: false,
            error: [],
        });
    }    
})

const getAllUsers = asyncHandler (async (req, res) => {
    try {
        const getAllResponse = await userService.getAllUsers();
        return res.status(200).json( new ApiResponse(200, getAllResponse, "Users retrieved successfully"));
        
    } catch (error) {
        const statusCode = error.statusCode || 500;
        const errorMessage = error.message || "Internal Server Error";
        return res.status(statusCode).json({
            statusCode,
            message: errorMessage, // Include the error message directly
            data: null,
            success: false,
            error: [],
        });
    }
})

export default {
    register,
    login,
    updateUser,
    deleteUser,
    getAllUsers
}