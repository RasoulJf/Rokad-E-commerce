import express from "express";
import { createProduct, deleteProduct, getAllProducts, getOneProduct, updateProduct } from "../Controllers/ProductCn.js";
import isAdmin from "../MiddleWare/isAdmin.js";

const productsRouter = express.Router();

productsRouter.route("/").get(getAllProducts).post(isAdmin,createProduct);
productsRouter
  .route("/:id")
  .get(isAdmin,getOneProduct)
  .patch(isAdmin,updateProduct)
  .delete(isAdmin,deleteProduct);

export default productsRouter;
