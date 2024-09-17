const express = require("express");
const router = express.Router();
const Category = require("../models/category");
const catchAsyncError = require("../middleware/catchAsyncError");
const ErrorHandler = require("../utils/ErrorHandler");

// Create a new category
router.post(
  "/create-category",
  catchAsyncError(async (req, res, next) => {
    const { name, parentCategory } = req.body;

    if (!name) {
      return next(new ErrorHandler("Category name is required", 400));
    }

    const lowerCaseName = name.toLowerCase();
    const existingCategory = await Category.findOne({ name: lowerCaseName });
    if (existingCategory) {
      return next(new ErrorHandler("Category already exists", 400));
    }

    // Create the new category
    const newCategory = await Category.create({
      name: lowerCaseName,
      parentCategory: parentCategory || null, // Set parentCategory if provided
    });

    // If a parentCategory is provided, add this category to the parentCategory's subCategories list
    if (parentCategory) {
      await Category.findByIdAndUpdate(parentCategory, {
        $push: { subCategories: newCategory._id },
      });
    }

    res.status(201).json({
      success: true,
      newCategory,
    });
  })
);

// Create a new subcategory
router.post(
  "/categories/:categoryId/subcategories",
  catchAsyncError(async (req, res, next) => {
    const { name } = req.body;
    const { categoryId } = req.params;

    if (!name) {
      return next(new ErrorHandler("Subcategory name is required", 400));
    }

    const lowerCaseName = name.toLowerCase();

    // Check if the parent category exists
    const parentCategory = await Category.findById(categoryId);
    if (!parentCategory) {
      return next(new ErrorHandler("Category not found", 404));
    }

    // Check if the subcategory already exists under the same parent category
    const existingSubcategory = await Category.findOne({
      name: lowerCaseName,
      parentCategory: categoryId,
    });
    
    if (existingSubcategory) {
      return next(new ErrorHandler("Subcategory with this name already exists under this category", 400));
    }

    // Check if the subcategory already exists (possibly under a different parent category)
    const subcategory = await Category.findOne({ name: lowerCaseName });

    if (subcategory) {
      // Check if the existing subcategory is associated with the current parent category
      if (subcategory.parentCategory.toString() === categoryId) {
        return next(new ErrorHandler("Subcategory already exists under this category", 400));
      }
    } else {
      // Create the subcategory if it doesn't exist
      await Category.create({
        name: lowerCaseName,
        parentCategory: categoryId,
      });
    }

    // Add the new subcategory to the parentCategory's subCategories list if it's a new subcategory
    if (!subcategory || subcategory.parentCategory.toString() !== categoryId) {
      await Category.findByIdAndUpdate(categoryId, {
        $push: { subCategories: subcategory ? subcategory._id : (await Category.findOne({ name: lowerCaseName }))._id },
      });
    }

    res.status(201).json({
      success: true,
      subcategory: subcategory ? subcategory : await Category.findOne({ name: lowerCaseName }),
    });
  })
);



// Fetch a Category and Its Subcategories
router.get(
  "/categories/:categoryId",
  catchAsyncError(async (req, res, next) => {
    const { categoryId } = req.params;

    // Find the category and populate its subCategories
    const category = await Category.findById(categoryId)
      .populate("subCategories") // Populate subCategories
      .populate("parentCategory"); // Populate parentCategory

    if (!category) {
      return next(new ErrorHandler("Category not found", 404));
    }

    res.status(200).json({
      success: true,
      category,
    });
  })
);

// Fetch a Category and Its Subcategories
router.get(
  "/categories",
  catchAsyncError(async (req, res, next) => {
    // Find the category and populate its subCategories
    const category = await Category.find({})
      .populate("subCategories") // Populate subCategories
      .populate("parentCategory"); // Populate parentCategory

    if (!category) {
      return next(new ErrorHandler("Category not found", 404));
    }

    res.status(200).json({
      success: true,
      category,
    });
  })
);

// Delete a Category
router.delete(
  "/categories/:categoryId",
  catchAsyncError(async (req, res, next) => {
    const { categoryId } = req.params;

    // Find the category and delete it
    const category = await Category.findById(categoryId);
    if (!category) {
      return next(new ErrorHandler("Category not found", 404));
    }

    // Remove the category from its parent's subCategories list
    if (category.parentCategory) {
      await Category.findByIdAndUpdate(category.parentCategory, {
        $pull: { subCategories: categoryId },
      });
    }

    // Delete the category
    await Category.findByIdAndDelete(categoryId);

    // Also delete all subcategories of this category
    await Category.deleteMany({ parentCategory: categoryId });

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  })
);

module.exports = router;
