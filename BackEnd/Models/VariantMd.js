import mongoose from "mongoose";
const variantSchema=new mongoose.Schema({
    color:{
        type:String
    },
    size:{
        type:String
    }
})
const Variant=mongoose.model("User",variantSchema)
export default Variant