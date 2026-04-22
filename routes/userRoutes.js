import express from "express";
import { showRegister, registerUser } from "../controllers/userController.js";

const router = express.Router();

router.get("/registro", showRegister);
router.post("/registro", registerUser);

export default router;