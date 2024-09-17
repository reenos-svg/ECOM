const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    const filename = `${Date.now()}-${file.fieldname}-${file.originalname}`;
    cb(null, filename);
  },
});

// Define the file filter function to allow only image files
const fileFilter = (req, file, cb) => {
  // Check if the file mimetype is one of the allowed image types
  if (file.mimetype.startsWith("image/")) {
    cb(null, true); // Accept the file
  } else {
    cb(new Error("Invalid file type. Only images are allowed."), false); // Reject the file
  }
};

// Create the multer instance with storage configuration
const upload = multer({
  storage: storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // Limit file size to 5MB (optional)
  },
});

// Export the multer upload instance
module.exports = upload;
