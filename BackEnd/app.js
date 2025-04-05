import express from "express";
import { fileURLToPath } from "url";
import catchError from "./Utils/catchError.js";
import HandleERROR from "./Utils/handleError.js";
import path from "path";
import cors from "cors";
import authRouter from "./Routes/auth.js";
import userRouter from "./Routes/User.js";
import isLogin from "./MiddleWare/isLogin.js";
import addressRouter from "./Routes/Adddres.js";
import brandsRouter from "./Routes/Brands.js";
import categoryRouter from "./Routes/Category.js";
import sliderRouter from "./Routes/Slider.js";
import variantsRouter from "./Routes/Variant.js";
import uploadRouter from "./Routes/upload.js";

const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("Public"));
app.use('/api/upload',uploadRouter)
app.use('/api/auth',authRouter)
app.use('/api/users',userRouter)
app.use('/api/addresses',isLogin,addressRouter)
app.use('/api/brands',brandsRouter)
app.use('/api/categories',categoryRouter)
app.use('/api/sliders',sliderRouter)
app.use('/api/variants',variantsRouter)
app.use("*", (req, res, next) => {
  next(new HandleERROR("Route not Found", 404));
});
app.use(catchError);

export default app;
