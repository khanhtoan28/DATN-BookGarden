"use strict";

const jwt = require("jsonwebtoken");
const _const = require("../app/config/constant");
const Category = require("../app/models/category");
const Author = require("../app/models/author");
const Pulisher = require("../app/models/pulisher");
const Product = require("../app/models/product");
const User = require("../app/models/user");

module.exports = {
  checkLogin: (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) return res.status(401).send("Access Denied");

    try {
      const verified = jwt.verify(token, _const.JWT_ACCESS_KEY);
      next();
    } catch (err) {
      return res.status(400).send("Invalid Token");
    }
  },

  getCategory: async (req, res, next) => {
    let category;
    try {
      category = await Category.findById(req.params.id);
      if (category == null) {
        return res.status(404).json({ message: "Cannot find category" });
      }
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }

    res.category = category;
    next();
  },
  getAuthor: async (req, res, next) => {
    let author;
    try {
      author = await Author.findById(req.params.id);
      if (author == null) {
        return res.status(404).json({ message: "Cannot find author" });
      }
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }

    res.author = author;
    next();
  },
  getPulisher: async (req, res, next) => {
    let pulisher;
    try {
      pulisher = await Pulisher.findById(req.params.id);
      if (pulisher == null) {
        return res.status(404).json({ message: "Cannot find pulisher" });
      }
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }

    res.pulisher = pulisher;
    next();
  },
  getProduct: async (req, res, next) => {
    try {
      const productId = req.params.id;
      console.log("Product ID:", productId);

      // Lấy thông tin sản phẩm
      const product = await Product.findById(productId).populate("category");
      if (!product) {
        return res.status(404).json({ message: "Cannot find product" });
      }

      res.status(200).json({
        product: product,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
    next();
  },
};
