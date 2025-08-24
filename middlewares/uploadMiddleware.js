import multer from "multer";
import path from "path";
import fs from "fs";

const ensureUploads = () => {
  if (!fs.existsSync("uploads")) fs.mkdirSync("uploads");
};
ensureUploads();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + "-" + Math.round(Math.random() * 1e9) + ext);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype?.startsWith("image/")) cb(null, true);
  else cb(new Error("Only image files are allowed"), false);
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});
