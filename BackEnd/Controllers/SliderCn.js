import Slider from "../Models/SliderMd.js";
import ApiFeatures from "../Utils/apiFeatures.js";
import catchAsync from "../Utils/catchAsync.js";
import HandleERROR from "../Utils/handleError.js";
import fs from "fs";
import { __dirname } from "../app.js";
export const createSlider = catchAsync(async (req, res, next) => {
  const slider = await Slider.create(req.body);
  return res.status(201).json({
    success: true,
    message: "Slider Created Successfully",
    data: slider,
  });
});

export const getAllSliders = catchAsync(async (req, res, next) => {

  const features = new ApiFeatures(Slider, req.query)
    .filter()
    .limitFields()
    .sort()
    .paginate()
    .populate();
  const sliders = await features.query;
  const count = await Slider.countDocuments(req?.query?.filters);
  return res.status(200).json({
    success: true,
    data: sliders,
    count,
  });
});

export const getOneSlider = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const slider = await Slider.findById(id);
  if (!slider) {
    return next(new HandleERROR("Slider not found", 404));
  }
  return res.status(200).json({
    success: true,
    data: slider,
  });
});


export const deleteSlider = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const deletedSlider = await Slider.findByIdAndDelete(id);
  if(deleteSlider?.image){
    fs.unlinkSync(`${__dirname}/Public/${deleteSlider?.image}`);
  }
  if (!deletedSlider) {
    return next(new HandleERROR("Slider not found", 404));
  }
  return res.status(200).json({
    success: true,
    message: "Slider deleted successfully",
  });
});
