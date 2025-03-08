import Category from "../Models/BrandsMd.js";
import Product from "../Models/ProductMd.js";
import ApiFeatures from "../Utils/apiFeatures.js";
import catchAsync from "../Utils/catchAsync.js";
import HandleERROR from "../Utils/handleError.js";
import fs from "fs";
import { __dirname } from "../app.js";
export const createCategory = catchAsync(async (req, res, next) => {
  const category = await Category.create(req.body);
  return res.status(201).json({
    success: true,
    message: "Category Created Successfully",
    data: category,
  });
});

export const getAllCategories = catchAsync(async (req, res, next) => {
    let queryString;
    if(req?.userId && req?.role == 'admin'){
queryString = req.query
    }else{
        queryString = {...req.query,filters:{...req.query.filters,isActive:true}}
    }
  const features = new ApiFeatures(Category, queryString)
    .filter()
    .limitFields()
    .sort()
    .paginate()
    .populate();
  const categories = await features.query;
  const count = await Category.countDocuments(queryString?.filters);
  return res.status(200).json({
    success: true,
    data: categories,
    count,
  });
});

export const getOneCategory = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const category = await Category.findById(id);
  if (!category) {
    return next(new HandleERROR("Category not found", 404));
  }
  return res.status(200).json({
    success: true,
    data: category,
  });
});

export const updateCategory = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const newCategory = await Category.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!newCategory) {
    return next(new HandleERROR("Category not found", 404));
  }
  return res.status(200).json({
    success: true,
    data: newCategory,
  });
});

export const deleteCategory = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const products = await Product.findOne({ categoryId: id });
  if (products) {
    return next(
      new HandleERROR("Cannot delete category with associated products", 400)
    );
  }
  const deletedCategory = await Category.findByIdAndDelete(id);
  if (!deletedCategory) {
    return next(new HandleERROR("Category not found", 404));
  }
  if(deletedCategory?.image){
    fs.unlinkSync(`${__dirname}/Public/${deletedCategory?.image}`);
  }
  return res.status(200).json({
    success: true,
    message: "Category deleted successfully",
  });
});
