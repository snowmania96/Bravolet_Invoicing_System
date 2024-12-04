import express from "express";
import {
  idUpload,
  sendToPolicyService,
  fetchReservation,
  getIdInfos,
  getIdInfo,
  test,
  autosave,
} from "../controllers/id_controller.js";
import multer from "multer";

const router = express.Router();

// Configure multer for file uploads
const upload = multer({ storage: multer.memoryStorage() });

router.post("/upload/:id", upload.single("file"), idUpload);
router.post("/input/:id", sendToPolicyService);
router.get("/fetch/:id", fetchReservation);
router.get("/service", getIdInfos);
router.get("/service/:id", getIdInfo);
router.get("/test/:id", test);
router.post("/autosave/:id", autosave);
export default router;
