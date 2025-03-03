import multer from "multer";
import path from "path";

// Configure storage
const storage = multer.diskStorage({
  destination: "uploads/", // Uploads folder
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  }
});

// File filter (only allow JPEG & PNG)
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png"];
  cb(null, allowedTypes.includes(file.mimetype));
};

// Configure multer
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});



export default upload
