import express from "express";
import { createProductVariant, deleteProductVariant, getAllProductVariants, getOneProductVariant, updateProductVariant } from "../Controllers/ProductVariantCn.js";
import isAdmin from "../MiddleWare/isAdmin.js";

const productVariantsRouter = express.Router();

productVariantsRouter.route("/").get(getAllProductVariants).post(isAdmin,createProductVariant);
productVariantsRouter
  .route("/:id")
  .get(isAdmin,getOneProductVariant)
  .patch(isAdmin,updateProductVariant)
  .delete(isAdmin,deleteProductVariant);

export default productVariantsRouter;
