import mongoose from "mongoose";
const sliderSchema=mongoose.Schema({
    image:{
        type:String,
        required:[true,"image is required"]
    },
    content:{
        type:String
    },
    href:{
        type:String,
    }
})
const Slider=mongoose.model("Slider",sliderSchema)
export default Slider