import mongoose from "mongoose";
const sliderSchema = new mongoose.Schema({
  image: {
    type: String,
  },
  content: {
    type: String
  },
  href: {
    type: String
  }
},{timestamps:true});
const Slider=mongoose.model("Slider",sliderSchema)
export default Slider