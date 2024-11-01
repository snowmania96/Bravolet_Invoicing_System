import AWS from "aws-sdk";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

export const idUpload = async (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }
  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: req.file.originalname,
    Body: req.file.buffer,
    ContentType: req.file.mimetype,
  };

  const s3Client = new S3Client({
    region: "us-west-2", // e.g., 'us-west-2'
    endpoint: process.env.S3_END_POINT,
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET_KEY,
    },
  });

  try {
    const command = new PutObjectCommand(params);
    await s3Client.send(command);
    res
      .status(200)
      .send(`File uploaded successfully: ${req.file.originalname}`);
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).send("Error uploading file");
  }
};
