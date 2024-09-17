const express = require("express");
const multer = require("multer");
const CarouselImage = require("../models/carouselImages"); // Updated to use the new model
const SizeChartImage = require("../models/sizechartImages"); // Updated to use the new model
const uploadOnCloud = require("../utils/cloudinary");
const router = express.Router();

const upload = multer({ dest: "uploads/" });

// POST: Add image to carousel
router.post(
  "/carousel/upload",
  upload.any([{ name: "carouselImages", maxCount: 4 }]),
  async (req, res) => {
    const { title } = req.body;

    try {
      const files = req.files;
      if (!files || files.length === 0) {
        return res.status(400).json({ message: "No files uploaded" });
      }

      const uploadedUrls = [];

      // Upload each file to cloud
      for (const file of files) {
        const filePath = file.path;
        const uploadResponse = await uploadOnCloud(filePath);

        if (uploadResponse) {
          uploadedUrls.push(uploadResponse.secure_url);
        } else {
          console.error(`Failed to upload file: ${filePath}`);
        }
      }

      if (uploadedUrls.length === 0) {
        return res.status(500).json({ message: "Failed to upload images" });
      }

      // Create carousel image documents
      const carouselImages = uploadedUrls.map((url) => ({
        url,
        title,
      }));

      await CarouselImage.insertMany(carouselImages);

      res
        .status(201)
        .json({ message: "Carousel images uploaded", carouselImages });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Failed to upload carousel images", error });
    }
  }
);

// GET: Fetch all carousel images
router.get("/carousel", async (req, res) => {
  try {
    const carouselImages = await CarouselImage.find({});
    if (!carouselImages || carouselImages.length === 0) {
      return res.status(404).json({ message: "No Carousel Images Found" });
    }

    res.status(200).json(carouselImages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch carousel images", error });
  }
});

// DELETE: Delete carousel image by ID
router.delete("/carousel/delete/:imageId", async (req, res) => {
  const { imageId } = req.params;

  try {
    const image = await CarouselImage.findById(imageId);
    if (!image) {
      return res.status(404).json({ message: "Carousel image not found" });
    }

    await CarouselImage.findByIdAndDelete(imageId);

    res.status(200).json({ message: "Carousel image deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete carousel image", error });
  }
});

// POST: Add image to size chart
router.post("/sizechart/upload", upload.any([{ name: "sizeChartImages", maxCount: 1 }]), async (req, res) => {
  const { title } = req.body;

  try {
    const files = req.files;

    
    if (!files || files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const uploadResponse = await uploadOnCloud(files[0].path);

    if (!uploadResponse) {
      return res.status(500).json({ message: "Failed to upload image" });
    }

    // Create a new SizeChartImage document
    const sizeChartImage = new SizeChartImage({
      url: uploadResponse.secure_url,
      title,
    });

    await sizeChartImage.save();

    res.status(201).json(sizeChartImage);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to upload size chart image", error });
  }
});

// GET: Fetch all size chart images
router.get("/sizechart", async (req, res) => {
  try {
    const sizeChartImages = await SizeChartImage.find({});
    if (!sizeChartImages || sizeChartImages.length === 0) {
      return res.status(404).json({ message: "No Size Chart Images Found" });
    }

    res.status(200).json(sizeChartImages);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to fetch size chart images", error });
  }
});

// PUT: Set only one size chart image as active
router.put("/sizechart/setActive/:imageId", async (req, res) => {
  const { imageId } = req.params;

  try {
    // Set all images to inactive
    await SizeChartImage.updateMany({}, { status: false });

    // Set the specified image as active
    const imageToActivate = await SizeChartImage.findByIdAndUpdate(
      imageId,
      { status: true },
      { new: true }
    );

    if (!imageToActivate) {
      return res.status(404).json({ message: "Size chart image not found" });
    }

    res
      .status(200)
      .json({ message: "Size chart image activated", imageToActivate });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to set active size chart image", error });
  }
});

// DELETE: Delete size chart image by ID
router.delete("/sizechart/delete/:imageId", async (req, res) => {
  const { imageId } = req.params;

  try {
    const image = await SizeChartImage.findById(imageId);
    if (!image) {
      return res.status(404).json({ message: "Size chart image not found" });
    }

    await SizeChartImage.findByIdAndDelete(imageId);

    res.status(200).json({ message: "Size chart image deleted successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to delete size chart image", error });
  }
});

module.exports = router;
