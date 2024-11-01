import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import managementRoutes from "./routes/management.js";
import guestRoutes from "./routes/guest.js";
import apartmentRoutes from "./routes/apartment.js";
import invoiceRoutes from "./routes/invoice.js";
import idRoutes from "./routes/id.js";
import cron from "node-cron";
import { cronWork } from "./cron/cronWork.js";
import schemaRoutes from "./routes/schema.js";
import path from "path";
import { fileURLToPath } from "url";

/* CONFIGURATION */
dotenv.config();
const app = express();
app.use(express.json());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

/* ROUTES */
app.use("/api/management", managementRoutes);
app.use("/api/guest", guestRoutes);
app.use("/api/apartment", apartmentRoutes);
app.use("/api/schema", schemaRoutes);
app.use("/api/invoice", invoiceRoutes);
app.use("/api/idupload", idRoutes);
/* MONGOOSE SETUP */
const PORT = process.env.PORT || 5001;

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "../build")));

// The "catchall" route (GET 404) for any request that doesn't match an API route
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../build", "index.html"));
});

app.listen(PORT, () =>
  console.log(`Server Running on Port: http://localhost:${PORT}`)
);

//Node cron

cron.schedule(
  "1 0 * * *",
  async () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const formattedDate = tomorrow.toISOString().split("T")[0];
    // const today = new Date().toISOString().split("T")[0];
    await cronWork(formattedDate);
  },
  {
    scheduled: true,
    timezone: "Europe/Rome",
  }
);
