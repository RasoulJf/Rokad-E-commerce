import Variant from "../Models/VariantMd.js";
import ApiFeatures from "../Utils/apiFeatures.js";
import catchAsync from "../Utils/catchAsync.js";
import HandleERROR from "../Utils/handleError.js";
import ProductVariant from "../Models/ProductVariantMd.js";
export const createVariant = catchAsync(async (req, res, next) => {
  const variant = await Variant.create(req.body);
  return res.status(201).json({
    success: true,
    message: "Variant Created Successfully",
    data: variant,
  });
});

export const getAllVariants = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(Variant, req.query)
    .filter()
    .limitFields()
    .sort()
    .paginate()
    .populate();
  const variants = await features.query;
  const count = await Variant.countDocuments(req?.query?.filters);
  return res.status(200).json({
    success: true,
    data: variants,
    count,
  });
});

export const getOneVariant = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const variant = await Variant.findById(id);
  if (!variant) {
    return next(new HandleERROR("Variant not found", 404));
  }
  return res.status(200).json({
    success: true,
    data: variant,
  });
});

export const updateVariant = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const newVariant = await Variant.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!newVariant) {
    return next(new HandleERROR("Variant not found", 404));
  }
  return res.status(200).json({
    success: true,
    data: newVariant,
  });
});

export const deleteVariant = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const products = await ProductVariant.findOne({ variantId: id });
  if (products) {
    return next(
      new HandleERROR("Cannot delete variant with associated products", 400)
    );
  }
  const deletedVariant = await Variant.findByIdAndDelete(id);
  if (!deletedVariant) {
    return next(new HandleERROR("Variant not found", 404));
  }
  return res.status(200).json({
    success: true,
    message: "Variant deleted successfully",
  });
});
