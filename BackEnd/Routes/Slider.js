import express from "express";
import { createSlider, deleteSlider, getAllSliders, getOneSlider } from "../Controllers/SliderCn.js";
import isAdmin from "../MiddleWare/isAdmin.js";

const sliderRouter = express.Router();

sliderRouter.route("/").get(getAllSliders).post(isAdmin,createSlider);
sliderRouter
  .route("/:id")
  .get(isAdmin,getOneSlider)
  .delete(isAdmin,deleteSlider);

export default sliderRouter;
