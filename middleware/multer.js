const fs = require("fs");
const multer = require("multer");

// Check if the uploads folder exists
if (!fs.existsSync("uploads")) {
  // Create the uploads folder if it doesn't exist
  fs.mkdirSync("uploads");
}

function fileUploadMiddleware() {
  return multer({
    // Where the files will be stored
    dest: "uploads/",
    limits: {
      fileSize: 5000000, // Max file size is 5MB
    },

    fileFilter: (req, file, cb) => {
      // Only allow PDF and DOC files to be uploaded
      if (
        file.mimetype === "application/pdf" ||
        file.mimetype === "application/msword"
      ) {
        cb(null, true);
      } else {
        cb(null, false);
      }
    },
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        // Save the uploaded file to the 'uploads' folder
        cb(null, "uploads/");
      },
      filename: (req, file, cb) => {
        // Use the original file name as the file name
        cb(null, file.originalname);
      },
    }),
  });
}

module.exports = fileUploadMiddleware;
