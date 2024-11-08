const ProductModel = require("../models/product");
const CategoryModel = require("../models/category");
const AuthorModel = require("../models/author");
const PulisherModel = require("../models/pulisher");

const productController = {
  getAllProduct: async (req, res) => {
    const page = req.body.page || 1;
    const limit = req.body.limit || 10;

    const options = {
      page: page,
      limit: limit,
      populate: [
        { path: "category", select: "name" }, // Populate category
        { path: "author", select: "name" }, // Populate author
        { path: "pulisher", select: "name" }, // Populate author
      ],
    };

    try {
      const products = await ProductModel.paginate({}, options);
      res.status(200).json({ data: products });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  getProductById: (req, res) => {
    try {
      res.status(200).json(res);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  createProduct: async (req, res) => {
    const {
      name,
      price,
      description,
      category,
      image,
      salePrice,
      year,
      stock,
      slide,
      pages,
      weight,
      size,
      form,
      author,
      pulisher,
      status,
    } = req.body;

    const product = new ProductModel({
      name,
      price,
      description,
      category,
      image,
      salePrice,
      year,
      stock,
      slide,
      pages,
      weight,
      size,
      form,
      author,
      pulisher,
      status,
    });

    try {
      // Kiểm tra category
      const checkCategory = await CategoryModel.findById(category);
      if (!checkCategory) {
        return res.status(400).json({ error: "Invalid category" });
      }
      // Kiểm tra author
      const checkAuthor = await AuthorModel.findById(author);
      if (!checkAuthor) {
        return res.status(400).json({ error: "Invalid author" });
      }
      // Kiểm tra pulisher
      const checkPulisher = await PulisherModel.findById(author);
      if (!checkPulisher) {
        return res.status(400).json({ error: "Invalid pulisher" });
      }
      // Lưu sản phẩm nếu tất cả đều hợp lệ
      const newProduct = await product.save();
      return res.status(200).json(newProduct);
    } catch (err) {
      return res.status(500).json({ error: "Something broke!" });
    }
  },

  deleteProduct: async (req, res) => {
    try {
      const product = await ProductModel.findByIdAndDelete(req.params.id);
      if (!product) {
        return res.status(200).json("Product does not exist");
      }
      res.status(200).json("Delete product success");
    } catch (err) {
      res.status(500).json(err);
    }
  },

  updateProduct: async (req, res) => {
    const id = req.params.id;
    const {
      name,
      price,
      description,
      category,
      image,
      salePrice,
      year,
      stock,
      pages,
      weight,
      size,
      form,
      author,
      pulisher,
      status,
    } = req.body;

    try {
      const product = await ProductModel.findByIdAndUpdate(
        id,
        {
          name,
          price,
          description,
          category,
          image,
          salePrice,
          year,
          stock,
          pages,
          weight,
          size,
          form,
          pulisher,
          author,
          status,
        },
        { new: true }
      );
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.status(200).json(product);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  searchCateByName: async (req, res) => {
    const page = req.body.page || 1;
    const limit = req.body.limit || 10;

    const options = {
      page: page,
      limit: limit,
    };

    const name = req.query.name;

    try {
      const productList = await ProductModel.paginate(
        { name: { $regex: `.*${name}.*`, $options: "i" } },
        options
      );

      res.status(200).json({ data: productList });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
  searchAuthorByName: async (req, res) => {
    const page = req.body.page || 1;
    const limit = req.body.limit || 10;

    const options = {
      page: page,
      limit: limit,
    };

    const name = req.query.name;

    try {
      const productList = await ProductModel.paginate(
        { name: { $regex: `.*${name}.*`, $options: "i" } },
        options
      );

      res.status(200).json({ data: productList });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
};

module.exports = productController;
