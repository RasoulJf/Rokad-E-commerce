import Address from "../Models/AddressMd.js";
import ApiFeatures from "../Utils/apiFeatures.js";
import catchAsync from "../Utils/catchAsync.js";
import HandleERROR from "../Utils/handleError.js";

export const createAddress = catchAsync(async (req, res, next) => {
  const address = await Address.create({ ...req.body, userId: req.userId });
  return res.status(201).json({
    success: true,
    message: "Address Created Successfully",
    data: address,
  });
});

export const getAllAddresses = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(Address, req.query, req?.role)
    .filter()
    .manualFilters(req?.role != "admin" ? { userId: req.userId } : "")
    .limitFields()
    .sort()
    .paginate()
    .populate({
      path: "userId",
      select: "fullname username phoneNumber",
    });
  const data = await features.execute();
  return res.status(200).json({
    data,
  });
});

export const getOneAddress = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const address = await Address.findById(id);
  if (req.role != "admin" && address?.userId != req.userId) {
    return next(new HandleERROR("You Dont Have Permission", 401));
  }
  return res.status(200).json({
    success: true,
    data: address,
  });
});

export const updateAddress = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { userId = null, ...others } = req.body;
  const address = await Address.findById(id);
  if (req.role != "admin" && address?.userId != req.userId) {
    return next(new HandleERROR("You Dont Have Permission", 401));
  }
  const newAddress = await Address.findByIdAndUpdate(id, others, {
    new: true,
    runValidators: true,
  });
  return res.status(200).json({
    success: true,
    message: "Address Updated Successfully",
    data: newAddress,
  });
});

export const removeAddress = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const address = await Address.findById(id);
  if (req.role != "admin" && address?.userId != req.userId) {
    return next(new HandleERROR("You Dont Have Permission", 401));
  }
  await Address.findByIdAndDelete(id);
  return res.status(200).json({
    success: true,
    message: "Address Removed Successfully",
  });
});
