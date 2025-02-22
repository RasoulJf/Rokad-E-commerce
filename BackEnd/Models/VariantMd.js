import mongoose from "mongoose";
const variantSchema=new mongoose.Schema({
    color:{
        type:String
    },
    size:{
        type:String
    }
})
const Variant=mongoose.Schema("User",variantSchema)
export default Variant