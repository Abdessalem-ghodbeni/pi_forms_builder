// import multer from "multer";

// const storage = multer.memoryStorage();

// export const singleUpload = multer({ storage }).single("file");
import multer from "multer";
import path from "path";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedExtensions = [".pdf", ".jpg", ".jpeg", ".png", ".xls", ".csv"];

  const fileExtension = path.extname(file.originalname).toLowerCase();
  if (allowedExtensions.includes(fileExtension)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file type. Only PDF, image, XLS, and CSV files are allowed."
      )
    );
  }
};

export const singleUpload = multer({ storage, fileFilter }).single("file");
