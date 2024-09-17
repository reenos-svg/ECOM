const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const Category = require("../models/category");
const upload = require("../middleware/multer");
const catchAsyncError = require("../middleware/catchAsyncError");
const ErrorHandler = require("../utils/ErrorHandler");
const Vendor = require("../models/vendor"); // Import Vendor model correctly
const uploadOnCloud = require("../utils/cloudinary");

router.post(
  "/create-product/:id",
  upload.any([
    { name: "productImages", maxCount: 4 },
    { name: "productColors", maxCount: 4 },
  ]), // Multer middleware for file uploads
  catchAsyncError(async (req, res, next) => {
    try {
      const vendorId = req.params.id;
      const vendor = await Vendor.findById(vendorId);
      if (!vendor) {
        throw new ErrorHandler("Invalid Vendor Id", 400);
      }

      const productData = req.body;
      productData.vendorId = vendor._id;

      const lowerCaseCategoryName = productData.productCategory.toLowerCase();
      const lowerCaseSubCategoryName = productData.productSubCategory
        ? productData.productSubCategory.toLowerCase()
        : "";

      // Check if the category exists
      const category = await Category.findOne({ _id: lowerCaseCategoryName });
      if (!category) {
        return next(new ErrorHandler("Category not found", 404));
      }

      // Check if the subcategory exists
      let subcategory = null;
      if (lowerCaseSubCategoryName) {
        subcategory = await Category.findOne({
          _id: category._id,
          subCategories: lowerCaseSubCategoryName,
        });
        if (!subcategory) {
          return next(
            new ErrorHandler("Subcategory not found under this category", 404)
          );
        }
      }

      // Extract productColors files
      const prodcutColorVariant = req.files.filter((file) =>
        file.fieldname.startsWith("productColors")
      );
      const productColors = req.body.productColors;
      // Upload the image files to Cloudinary and map the URLs to the correct index in productColors
      const uploadPromises = prodcutColorVariant.map(async (file) => {
        const indexMatch = file.fieldname.match(/\[(\d+)\]/);

        if (indexMatch) {
          const index = parseInt(indexMatch[1]);

          // Upload the image to Cloudinary
          const result = await uploadOnCloud(file.path);
          // Update the productColors array with the Cloudinary image URL
          if (productColors) {
            productColors[index].imageUrl = result.secure_url; // Get the URL of the uploaded image
          
          }
        }
      });

      await Promise.all(uploadPromises);

      const productImageFiles = req.files.filter(
        (file) => file.fieldname === "productImages"
      );

      // Process file uploads if using multer
      const fileLocalPaths = productImageFiles.map((file) => file.path);

      if (!fileLocalPaths || fileLocalPaths.length === 0) {
        throw new ErrorHandler("Images are Required", 400);
      }

      const productImages = await Promise.all(
        fileLocalPaths.map(uploadOnCloud)
      );

      if (!productImages || productImages.length === 0) {
        throw new ErrorHandler("Image upload failed", 400);
      }

      const newProduct = await Product.create({
        ...productData,
        productImages: productImages.map((image) => image.url),
        productColors,
      });

      // Populate the category and subcategory details
      const populatedProduct = await Product.findById(newProduct._id)
        .populate("productCategory", "name")
        .populate("productSubCategory", "name");

      res.status(201).json({
        success: true,
        product: populatedProduct,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message || "Server error", 500));
    }
  })
);

// Route to get all product, protected and role-based
router.get(
  "/products/:id",
  catchAsyncError(async (req, res, next) => {
    try {
      const vendorId = req.params.id;
      const vendor = await Vendor.findById(vendorId);

      if (!vendor) {
        return next(new ErrorHandler("Invalid Vendor Id", 400));
      }
      const products = await Product.find({ vendorId })
        .populate({
          path: "productCategory", // Populate the category field
          select: "name", // Select only the name field
        })
        .populate({
          path: "productSubCategory", // Populate the subcategory field
          select: "name", // Select only the name field
        })
        .populate({
          path: "vendorId",
          select: "name _id",
        });
      if (!products.length) {
        return next(new ErrorHandler("No products found for this vendor", 404));
      }
      res.status(200).json({
        success: true,
        products,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message || "Server error", 500));
    }
  })
);

router.get(
  "/products",
  catchAsyncError(async (req, res, next) => {
    try {
      const products = await Product.find({})
        .populate({
          path: "productCategory", // Populate the category field
          select: "name", // Select only the name field
        })
        .populate({
          path: "productSubCategory", // Populate the subcategory field
          select: "name", // Select only the name field
        })
        .populate({
          path: "vendorId",
          select: "name _id",
        })
        .populate({
          path: "reviews.userId",
          select: "name",
        });
      if (!products.length) {
        return next(new ErrorHandler("No products found", 404));
      }
      res.status(200).json({
        success: true,
        products,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message || "Server error", 500));
    }
  })
);


router.get(
  "/search",
  catchAsyncError(async (req, res, next) => {
    try {
      const { keyword } = req.query;

      if (!keyword) {
        return next(new ErrorHandler("Keyword is required", 400));
      }

      // Use regular expressions for case-insensitive search
      const searchQuery = {
        $or: [{ productName: new RegExp(keyword, "i") }],
      };
      const products = await Product.find(searchQuery);

      if (products.length === 0) {
        return next(new ErrorHandler("No products found", 404));
      }

      res.status(200).json({
        success: true,
        products,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message || "Server error", 500));
    }
  })
);

router.get(
  "/:vendorId/products",
  catchAsyncError(async (req, res, next) => {
    const { vendorId } = req.params;

    // Check if vendor exists
    const vendor = await Vendor.findById(vendorId);

    if (!vendor) {
      return next(new ErrorHandler("Invalid Vendor Id", 400));
    }

    try {
      // Fetch products with populated category and subcategory
      const products = await Product.find({ vendorId })
        .sort({ createdAt: -1 })
        .limit(3)
        .populate({
          path: "productCategory", // Populate the category field
          select: "name", // Select only the name field
        })
        .populate({
          path: "productSubCategory", // Populate the subcategory field
          select: "name", // Select only the name field
        });

      res.status(200).json({
        success: true,
        products,
      });
    } catch (error) {
      res.status(500).json({ message: "Error fetching products", error });
    }
  })
);
router.post("/:userId/:productId/reviews", async (req, res, next) => {
  const { rating, comment } = req.body;
  const userId = req.params.userId; // Assuming user is authenticated

  if (!userId) {
    return next(new ErrorHandler("Please Login to add reviews", 400));
  }

  try {
    const product = await Product.findById(req.params.productId);
    if (!product) {
      return next(new ErrorHandler("Product not found", 404));
    }

    product.reviews.push({ userId, rating, comment });
    await product.save();
    res.status(200).send(product);
  } catch (err) {
    next(err);
  }
});
router.put(
  "/update-product/:vendorId/:productId",
  catchAsyncError(async (req, res, next) => {
    try {
      const { vendorId, productId } = req.params;

      // Check if vendor exists
      const vendor = await Vendor.findById(vendorId);
      if (!vendor) {
        return next(new ErrorHandler("Invalid Vendor Id", 400));
      }

      // Update the product
      const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        req.body,
        {
          new: true, // Return updated document
          runValidators: true, // Validate updates against model schema
        }
      );

      // Handle if product not found
      if (!updatedProduct) {
        return next(new ErrorHandler("Product not found", 404));
      }

      // Return success response
      res.status(200).json({
        success: true,
        product: updatedProduct,
      });
    } catch (error) {
      // Handle other errors
      return next(new ErrorHandler(error.message || "Server error", 500));
    }
  })
);

router.delete(
  "/delete-product/:vendorId/:productId",
  catchAsyncError(async (req, res, next) => {
    try {
      const { vendorId, productId } = req.params;

      // Check if vendor exists
      const vendor = await Vendor.findById(vendorId);
      if (!vendor) {
        return next(new ErrorHandler("Invalid Vendor Id", 400));
      }
      const deletedProduct = await Product.findByIdAndDelete(productId);
      if (!deletedProduct) {
        return next(new ErrorHandler("Product not found", 404));
      }
      res.status(200).json({
        success: true,
        message: "Product deleted successfully",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message || "Server error", 500));
    }
  })
);

module.exports = router;
