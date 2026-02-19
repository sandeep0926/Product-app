import { Products } from "../models/Product.js";

export const CreFun = async (req, res) => {
  try {
    const images = req.files
      ? req.files.map((file) => `/uploads/${file.filename}`)
      : [];

    const proData = {
      title: req.body.title,
      des: req.body.des,
      price: req.body.price,
      image: images,
      color: req.body.color,
      dimension: req.body.dimension,
      size: req.body.size ,
    };

    const pro = await Products.create(proData);
    res.status(201).json(pro);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "ERROR IN CREATE PRODUCT" });
  }
};

export const GetFun = async (req, res) => {
  try {
    const { color, dimension, size } = req.query;
    let filter = {};

    if (color) {
      filter.color = color;
    }
    if (dimension) {
      filter.dimension = dimension;
    }
    if (size) {
      filter.size = size;
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
