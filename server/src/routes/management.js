import express from "express";
import {
  fetchAdmins,
  createAdmins,
  authAdmins,
} from "../controllers/management_controller.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/admin", auth, fetchAdmins);
router.post("/admin", createAdmins);
router.post("/auth", authAdmins);
export default router;
