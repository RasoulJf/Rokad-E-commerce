import express from "express";
import { createProductVariant, deleteProductVariant, getAllProductVariants, getOneProductVariant, updateProductVariant } from "../Controllers/ProductVariantCn.js";
import isAdmin from "../MiddleWare/isAdmin.js";

const productsRouter = express.Router();

productsRouter.route("/").get(getAllProductVariants).post(isAdmin,createProductVariant);
productsRouter
  .route("/:id")
  .get(isAdmin,getOneProductVariant)
  .patch(isAdmin,updateProductVariant)
  .delete(isAdmin,deleteProductVariant);

export default productsRouter;
