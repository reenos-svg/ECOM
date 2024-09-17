const cloudinary = require("cloudinary").v2;
const fs = require("fs");

// Configuration
cloudinary.config({
  cloud_name: "dqx9qlbtu",
  api_key: "294644313861265",
  api_secret: "AfMXsr_Ugfu_H3hIhNolftC_Mh8", // Click 'View Credentials' below to copy your API secret
});

// Upload an image
const uploadOnCloud = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    const response = await cloudinary.uploader
      .upload(localFilePath, {
        resource_type: "image",
      })
      .catch((error) => {
        console.log(error);
      });
    return response;

    //   const optimizeUrl = cloudinary.url("shoes", {
    //     fetch_format: "auto",
    //     quality: "auto",
    //   });

    //   console.log(optimizeUrl);

    //   // Transform the image: auto-crop to square aspect_ratio
    //   const autoCropUrl = cloudinary.url("shoes", {
    //     crop: "auto",
    //     gravity: "auto",
    //     width: 500,
    //     height: 500,
    //   });
    // console.log(autoCropUrl);
  } catch (error) {
    //remove local file as the upload operation failed.
    fs.unlinkSync(localFilePath);
    return null;
  }
};

module.exports = uploadOnCloud ;
