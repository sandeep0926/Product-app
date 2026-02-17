import mongoose from "mongoose";

const ProMod = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    des: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    image: [String],
    color: [String],
    dimension: [String],
    size: [String],
  },
  { timestamps: true },
);

export const Products = mongoose.model("Product", ProMod);
