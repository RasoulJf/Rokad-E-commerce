import User from "../Models/UserMd";
import ApiFeatures from "../Utils/apiFeatures";
import catchAsync from "../Utils/catchAsync";
import HandleERROR from "../Utils/handleError";

export const getAllUsers = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(User, req.query)
    .filter()
    .limitFields()
    .sort()
    .paginate()
    .populate();
  const users = await features.query;
  return res.status(200).json({
    success: true,
    data: users,
  });
});

export const getOneUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  if (req.role != "admin" && req.userId != id) {
    return new HandleERROR("You Dont Have Permission", 401);
  }
  const user = await User.findById(id);
  return res.status(200).json({
    success: true,
    data: user,
  });
});

export const updateUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  if (req.role != "admin" && req.userId != id) {
    return new HandleERROR("You Dont Have Permission", 401);
  }
  const { fullName = null, username = null, role = null } = req.body;

  const user = await User.findById(id);
  user.fullname = fullName || user?.fullname;
  user.username = username || user?.username;
  if (req.role == "admin" && role) {
    user.role = role;
  }
  if (user?.fullname && user?.username && user?.password) {
    user.isComplete = true;
  }
  const newUser = await user.save();
  return ews.status(200).json({
    success: true,
    data: newUser,
  });
});
