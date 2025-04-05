import ProductVariant from "../Models/ProductVariantMd.js";
import ApiFeatures from "../Utils/apiFeatures.js";
import catchAsync from "../Utils/catchAsync.js";
import HandleERROR from "../Utils/handleError.js";
export const createProductVariant = catchAsync(async (req, res, next) => {
  const productVariant = await ProductVariant.create(req.body);
  return res.status(201).json({
    success: true,
    message: "ProductVariant Created Successfully",
    data: productVariant,
  });
});

export const getAllProductVariants = catchAsync(async (req, res, next) => {
    const features = new ApiFeatures(ProductVariant, req.query, req?.role)
    .filter()
    .limitFields()
    .sort()
    .paginate()
    .populate("variantId");
  const data = await features.execute();
  return res.status(200).json({
    data,
  });
  });

export const getOneProductVariant = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const productVariant = await ProductVariant.findById(id).populate(
    "variantId"
  );
  if (!productVariant) {
    return next(new HandleERROR("ProductVariant not found", 404));
  }
  return res.status(200).json({
    success: true,
    data: productVariant,
  });
});

export const updateProductVariant = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const newProductVariant = await ProductVariant.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!newProductVariant) {
    return next(new HandleERROR("ProductVariant not found", 404));
  }
  return res.status(200).json({
    success: true,
    data: newProductVariant,
  });
});

export const deleteProductVariant = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const productVariant = await ProductVariant.findByIdAndDelete(id);
  if (productVariant) {
    return next(
      new HandleERROR(
        "Product Variant not found",
        400
      )
    );
  }
  return res.status(200).json({
    success: true,
    message: "ProductVariant deleted successfully",
  });
});
