import Brand from "../Models/BrandsMd.js";
import Product from "../Models/ProductMd.js";
import ApiFeatures from "../Utils/apiFeatures.js";
import catchAsync from "../Utils/catchAsync.js";
import HandleERROR from "../Utils/handleError.js";
import fs from "fs";
import { __dirname } from "../app.js";
export const createBrand = catchAsync(async (req, res, next) => {
  const brand = await Brand.create(req.body);
  return res.status(201).json({
    success: true,
    message: "Brand Created Successfully",
    data: brand,
  });
});

export const getAllBrands = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(Brand, req.query, req?.role)
  .filter()
  .limitFields()
  .sort()
  .paginate()
  .populate();
const data = await features.execute();
return res.status(200).json({
  data,
});
});

export const getOneBrand = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const brand = await Brand.findById(id);
  if (!brand) {
    return next(new HandleERROR("Brand not found", 404));
  }
  return res.status(200).json({
    success: true,
    data: brand,
  });
});

export const updateBrand = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const newBrand = await Brand.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!newBrand) {
    return next(new HandleERROR("Brand not found", 404));
  }
  return res.status(200).json({
    success: true,
    data: newBrand,
  });
});

export const deleteBrand = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const products = await Product.findOne({ brandId: id });
  if (products) {
    return next(
      new HandleERROR("Cannot delete brand with associated products", 400)
    );
  }
  const deletedBrand = await Brand.findByIdAndDelete(id);
  if (!deletedBrand) {
    return next(new HandleERROR("Brand not found", 404));
  }
  if(deletedBrand?.image){
    fs.unlinkSync(`${__dirname}/Public/${deletedBrand?.image}`);
  }
  return res.status(200).json({
    success: true,
    message: "Brand deleted successfully",
  });
});
