import express from "express";
import {
  idUpload,
  sendToPolicyService,
  fetchReservation,
  fetchNote,
} from "../controllers/id_controller.js";
import multer from "multer";

const router = express.Router();

// Configure multer for file uploads
const upload = multer({ storage: multer.memoryStorage() });

router.post("/:id", upload.single("file"), idUpload);
router.post("/input/:id", sendToPolicyService);
router.get("/:id", fetchReservation);
router.get("/rentalagreement/:id", fetchNote);

export default router;
