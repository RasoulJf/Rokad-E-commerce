import mongoose from "mongoose";

const informationSchema = new mongoose.Schema({
  key: {
    type: String,
    required: [true, "key is required"],
  },
  value: {
    type: String,
    required: [true, "value is required"],
  },
});

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "title is required"],
    trim: true,
  },
  imagesUrl: {
    type: [String],
    default: [],
  },
  information: {
    type:[informationSchema],
    default:[]
  },
  description:{
    type: String,
    required: [true, "desc is required"],
    trim: true,
  },
  categoryId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Category',
    required:[true,'Category is required']
  },
  brandId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Brand',
    required:[true,'Brand is required']
  },
  defaultProductVariantId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'ProductVariant',
    required:[true,'default variant is required']
  }
},{timestamps:true});
const Product = mongoose.model("Product", productSchema);
export default Product;
