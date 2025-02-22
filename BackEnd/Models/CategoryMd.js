import mongoose from "mongoose";
const categorySchema=new mongoose.Schema({
    title:{
        type:String,
        required:[true,"title is required"]
    },
    image:{
        type:String
    },
    subCategory:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category"
    }
})
const Category=mongoose.Schema("Category",categorySchema)
export default Category