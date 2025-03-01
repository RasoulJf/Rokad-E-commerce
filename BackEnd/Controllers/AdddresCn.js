import Address from "../Models/AdddressMd.js";
import ApiFeatures from "../Utils/apiFeatures.js";
import catchAsync from "../Utils/catchAsync.js";
import HandleERROR from "../Utils/handleError.js";
export const createAddress = catchAsync(async (req,res,next) => {
    const address = await Address.create({...req.body,userId:req.userId})
    return res.status(201).json({
        success: true,
        meesage: 'Address Created Successfully',
        data: address,
      });
})
export const getAllAddresses = catchAsync(async (req, res, next) => {
  let queryString = { ...req.query };
  if (req.role != "admin") {
    queryString = {
      ...queryString,
      filter: [...queryString.filters, { userId: req.userId }],
    };
  }
  const features = new ApiFeatures(Address, queryString)
    .filter()
    .limitFields()
    .sort()
    .paginate()
    .secondPopulate({
      path: "userId",
      select: "fullname username phoneNumber",
    });
  const addresses = await features.query;
  return res.status(200).json({
    success: true,
    data: addresses,
  });
});

export const getOneAddress = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const address = await Address.findById(id);
  if (req.role != "admin" && address?.userId != req.userId) {
    return new HandleERROR("You Dont Have Permission", 401);
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
    return new HandleERROR("You Dont Have Permission", 401);
  }
  const newAddress = await Address.findByIdAndUpdate(id, others, {
    new: true,
    runValidators: true,
  });
  return res.status(200).json({
    success: true,
    message: "Address Updated Successfuly",
    data: newAddress,
  });
});

export const removeAddress = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const address = await Address.findById(id);
  if (req.role != "admin" && address?.userId != req.userId) {
    return new HandleERROR("You Dont Have Permission", 401);
  }
  await Address.findByIdAndDelete(id);
  return res.status(200).json({
    success: true,
    message: "Address Removed Successfuly",
  });
});
