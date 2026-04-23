import express from "express";
import { 
    showRegister, 
    registerUser, 
    showLogin, 
    loginUser 
} from "../controllers/userController.js";

const router = express.Router();

// Registro
router.get("/registro", showRegister);
router.post("/registro", registerUser);

// Login
router.get("/login", showLogin);
router.post("/login", loginUser);

export default router;