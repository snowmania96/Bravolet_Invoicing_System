import express from "express";
import {
  getReservationInfo,
  sendInvoiceInfo,
} from "../controllers/invoice_controller.js";

const router = express.Router();

router.get("/:id", getReservationInfo);
router.post("/:id", sendInvoiceInfo);

export default router;
