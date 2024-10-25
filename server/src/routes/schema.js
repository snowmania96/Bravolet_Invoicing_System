import express from "express";
import { getSchema, updateSchema } from "../controllers/schema_controller.js";

import auth from "../middleware/auth.js";
const router = express.Router();

router.get("/get", auth, getSchema);
router.post("/update", auth, updateSchema);

export default router;
