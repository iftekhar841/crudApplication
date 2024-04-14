import { Router } from "express";
import { verifyJWT} from "../middlewares/auth.middleware.js";


const user_route = Router();

import userController from "../controllers/user.controller.js";

user_route.post("/register", userController.register);

user_route.post("/login", userController.login);

user_route.put("/update", verifyJWT, userController.updateUser);

user_route.delete("/delete", verifyJWT, userController.deleteUser);

user_route.get("/", userController.getAllUsers);


export default user_route;
