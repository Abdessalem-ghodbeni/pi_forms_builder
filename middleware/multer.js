import multer from "multer";

const storage = multer.memoryStorage();

export const singleUpload = multer({ storage }).single("file");

export const uploadMultipleImages = multer({ storage }).array("files", 5);
