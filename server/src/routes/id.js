import express from "express";
import { idUpload } from "../controllers/id_controller.js";
import multer from "multer";

const router = express.Router();

// Configure multer for file uploads
const upload = multer({ storage: multer.memoryStorage() });

// Create an S3 client

router.post("/:id", upload.single("file"), idUpload);

export default router;
