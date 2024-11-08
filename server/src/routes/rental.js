import express from "express";
import { fetchNote } from "../controllers/rental_controller.js";

const router = express.Router();

// Configure multer for file uploads

router.get("/:id", fetchNote);

export default router;
