const Product = require('../models/ProductModel');

const getAllProduct = async (req, res, next) => {
    const products = await Product.find();
    res.status(200).json({products});
};

const getProductById = async (req, res, next) => {
    const id = req.params.id;
    const product = await Product.findById(id);
    if (!product) {
        const error = new Error("Product id not found");
        error.statusCode = 400;
        throw error;
    }
    res.status(200).json({product});
};

const creatProduct = async (req, res, next) => {
    const data = req.body;
    const product = new Product(product);
    await Product.create(product);
    res.status(201).json({product});
};

const updateProduct = async (req, res, next) => {
    const id = req.params.id;
    const data = req.body;
    const product = await Product.findByIdAndUpdate(id, data, {new: true});
    if (!product) {
        const error = new Error("Product id not found");
        error.statusCode = 404;
        throw error;
    }
    res.status(200).json({product});
};

const deleteProduct = async (req, res, next) => {
    const id = req.params.id;
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
        const error = new Error("Product id not found");
        error.statusCode = 404;
        throw error;
    }
    res.status(204).json({message: 'Product id deleted'});
};

module.exports = {
    getAllProduct,
    getProductById,
    creatProduct,
    updateProduct,
    deleteProduct,
}