import express from "express";
import { createBrand, deleteBrand, getAllBrands, getOneBrand, updateBrand } from "../Controllers/BrandsCn.js";
import isAdmin from "../MiddleWare/isAdmin.js";

const brandsRouter = express.Router();

brandsRouter.route("/").get(getAllBrands).post(isAdmin,createBrand);
brandsRouter
  .route("/:id")
  .get(isAdmin,getOneBrand)
  .patch(isAdmin,updateBrand)
  .delete(isAdmin,deleteBrand);

export default brandsRouter;
