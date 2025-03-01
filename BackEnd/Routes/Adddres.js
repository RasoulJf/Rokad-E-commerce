import express from "express";
import {
  createAddress,
  getAllAddresses,
  getOneAddress,
  removeAddress,
  updateAddress,
} from "../Controllers/AdddresCn.js";

const addressRouter = express.Router();

addressRouter.route("/").get(getAllAddresses).post(createAddress);
addressRouter
  .route("/:id")
  .get(getOneAddress)
  .patch(updateAddress)
  .delete(removeAddress);

export default addressRouter;
