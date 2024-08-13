import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary directly in the upload call
const CLOUDINARY_CONFIG = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
};

// Disable bodyParser for API routes
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const form = new formidable.IncomingForm();
    form.parse(req, async (error, fields, files) => {
      if (error) {
        return res.status(500).json({ error: "Failed to parse form data" });
      }

      const file = files.file as formidable.File[] | undefined;
      if (!file || !file[0]) {
        return res.status(400).json({ error: "File not found" });
      }

      try {
        // Directly configure Cloudinary and perform the upload
        const result = await cloudinary.uploader.upload(file[0].filepath, {
          upload_preset: CLOUDINARY_CONFIG.upload_preset,
          cloud_name: CLOUDINARY_CONFIG.cloud_name,
          api_key: CLOUDINARY_CONFIG.api_key,
          api_secret: CLOUDINARY_CONFIG.api_secret,
        });

        res.status(200).json(result);
      } catch (error) {
        res.status(500).json({ error: (error as Error).message });
      }
    });
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
