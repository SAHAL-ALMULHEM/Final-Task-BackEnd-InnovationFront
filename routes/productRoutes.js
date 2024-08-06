const express = require('express');

const productController = require('../controllers/productController');

const router = express.Router();

router.get('/products', productController.getAllProduct);
router.get('/products/:id', productController.getProductById);
router.post('/products', productController.creatProduct);
router.put('/products/:id', productController.updateProduct);
router.delete('/products/:id', productController.deleteProduct);

module.exports = router;