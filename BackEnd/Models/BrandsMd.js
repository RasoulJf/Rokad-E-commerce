import mongoose from "mongoose";
const brandSchema=new mongoose.Schema({
    name:{
        type:String
    },
    image:{
        type:String
    },
    
})
const Brand=mongoose.model("Brand",brandSchema)
export default Brand