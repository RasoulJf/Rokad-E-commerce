import mongoose from "mongoose";
const addresSchema = new mongoose.Schema({
  city: {
    type: String,
    required: [true, "City is Required"],
  },
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  receiverName: {
    type: String,
    required: [true, "Name is Required"],
  },
  receiverPhoneNumber: {
    type: String,
    required: [true, "Phone Number is Required"],
    match: [/^(\+98|0)?9\d{9}$/, "Phone Number Ivalid"],
  },
  postalCode: {
    type: String,
    required: [true, "Postal Code is Required"],
  },
  street: {
    type: String,
    required: [true, "Street is Required"],
  },
  plaque: {
    type: String,
    required: [true, "Plaque is Required"],
  },
  province: {
    type: String,
    required: [true, "Province is Required"],
  },
  description: {
    type: String,
  },
},{timestamps: true});

const Addres = mongoose.model('Addres',addresSchema)
export default Addres
