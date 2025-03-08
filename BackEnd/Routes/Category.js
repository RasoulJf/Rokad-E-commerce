import express from "express";
import { createCategory, deleteCategory, getAllCategories, getOneCategory, updateCategory } from "../Controllers/CategoryCn.js";
import isAdmin from "../MiddleWare/isAdmin.js";

const categoryRouter = express.Router();

categoryRouter.route("/").get(getAllCategories).post(isAdmin,createCategory);
categoryRouter
  .route("/:id")
  .get(getOneCategory)
  .patch(isAdmin,updateCategory)
  .delete(isAdmin,deleteCategory);

export default categoryRouter;
