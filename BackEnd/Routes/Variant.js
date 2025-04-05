import express from "express";
import { createVariant, deleteVariant, getAllVariants, getOneVariant, updateVariant } from "../Controllers/VariantCn.js";
import isAdmin from "../MiddleWare/isAdmin.js";

const variantsRouter = express.Router();

variantsRouter.route("/").get(getAllVariants).post(isAdmin,createVariant);
variantsRouter
  .route("/:id")
  .get(isAdmin,getOneVariant)
  .patch(isAdmin,updateVariant)
  .delete(isAdmin,deleteVariant);

export default variantsRouter;
