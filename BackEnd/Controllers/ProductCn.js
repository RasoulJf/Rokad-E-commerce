import Product from "../Models/ProductMd.js";
import ProductVariant from "../Models/ProductVariantMd.js";
import ApiFeatures from "../Utils/apiFeatures.js";
import catchAsync from "../Utils/catchAsync.js";
import HandleERROR from "../Utils/handleError.js";
import fs from "fs";
import { __dirname } from "../app.js";
export const createProduct = catchAsync(async (req, res, next) => {
  const product = await Product.create(req.body);
  return res.status(201).json({
    success: true,
    message: "Product Created Successfully",
    data: product,
  });
});

export const getAllProducts = catchAsync(async (req, res, next) => {
    const features = new ApiFeatures(Product, req.query, req?.role)
    .filter()
    .limitFields()
    .sort()
    .paginate()
    .populate("defaultProductVariantId");
  const data = await features.execute();
  return res.status(200).json({
    data,
  });
  });

export const getOneProduct = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findById(id).populate(
    "defaultProductVariantId categoryId brandId"
  );
  if (!product) {
    return next(new HandleERROR("Product not found", 404));
  }
  return res.status(200).json({
    success: true,
    data: product,
  });
});

export const updateProduct = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const newProduct = await Product.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!newProduct) {
    return next(new HandleERROR("Product not found", 404));
  }
  return res.status(200).json({
    success: true,
    data: newProduct,
  });
});

export const deleteProduct = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const productVariants = await ProductVariant.deleteMany({ productId: id });
  if (productVariants) {
    return next(
      new HandleERROR(
        "Cannot delete productVariant with associated products",
        400
      )
    );
  }
  const deletedProduct = await Product.findByIdAndDelete(id);
  if (!deletedProduct) {
    return next(new HandleERROR("Product not found", 404));
  }

  for (let image of deletedProduct.imagesUrl) {
    fs.unlinkSync(`${__dirname}/Public/${image}`);
  }

  return res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
});
