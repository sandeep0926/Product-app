import { Products } from "../models/Product.js";

export const CreFun = async (req, res) => {
  try {
    const pro = await Products.create(req.body);
    res.status(201).json(pro);
  } catch (error) {
    res.status(500).json({ message: "ERROR IN CREATE PRODUCT"});
  }
};

export const GetFun = async (req, res) => {
  try {
    
    const { color, dimension, size } = req.query;
    let filter = {};

    if (color) {
      filter.color = [color];
    }
    if (dimension) {
      filter.dimension = [dimension];
    }
    if (size) {
      filter.size = [size];
    }

    const Data = await Products.find(filter);
    res.status(200).json(Data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "ERROR IN GET PRODUCT" });
  }
};

export const GetDetFun = async (req, res) => {
  try {
    const Data = await Products.findById(req.params.id);
    if (!Data) return res.status(404).json({ message: "Product not found" });

    res.status(200).json(Data);
  } catch (error) {
    res.status(500).json({ message: "ERROR IN GET DETAILS" });
  }
};

export const UpdFun = async (req, res) => {
  try {
    
    const Updated = await Products.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(Updated);
  } catch (error) {
    res.status(500).json({ message: "ERROR IN UPDATE PRODUCT" });
  }
};

export const DelFun = async (req, res) => {
  try {
    const Deleted = await Products.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Product deleted successfully", Deleted });
  } catch (error) {
    res.status(500).json({ message: "ERROR IN DELETE PRODUCT" });
  }
};
