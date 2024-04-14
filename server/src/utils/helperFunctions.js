import { ApiError } from "./ApiError.js";

// Validate email format using a regular expression
const checkIsValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
       throw new ApiError(400, "Invalid email format");
    }
    return true;
};

export { checkIsValidEmail };
