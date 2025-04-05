import mongoose from "mongoose";

const productVariantSchema = new mongoose.Schema({

},{timestamps:true})

const ProductVariant = mongoose.model('ProductVariant',productVariantSchema)

export default ProductVariant