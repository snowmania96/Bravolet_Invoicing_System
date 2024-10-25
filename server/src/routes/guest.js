import express from "express";
import {
  createGuest,
  getGuests,
  deleteGuest,
  updateGuest,
  getGuest,
} from "../controllers/guest_controller.js";

const router = express.Router();
import auth from "../middleware/auth.js";

router.post("/create", auth, createGuest);
router.get("/get", auth, getGuests);
router.get("/get/:id", auth, getGuest);
router.post("/update/:id", auth, updateGuest);
router.delete("/delete/:id", auth, deleteGuest);

export default router;
