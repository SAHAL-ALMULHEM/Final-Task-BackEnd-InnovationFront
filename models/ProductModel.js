const mongoose = require ('mongoose');
const bcrypt = require ('bcrypt');
const validator = require ('validator');
const crypto = require ('crypto');

const ProductSchema = new mongoose.Schema({
name: {
    type: String,
    required: [true, 'name is required'],
},
description: {
    type: String,
    required: [true, 'description is required'],
},
    price: {
        type: Number,
        required: [true, 'price is required'],
        min: [0, 'Price must be a positive number'],
        validate:{
            validator: (v) => /^[v >= 0]+$/.test(v),
            message: props => `Price ${props.value} must be a positive number.`
        }
    },
    category: {
        type: String,
        required: [true, 'category is required'],
    },
    stock: {
        type: Number,
        required: [true, 'stock is required'],
        min: [0, 'Price must be a non-negative number'],
        validate:{
            validator: (v) => /^[Number.isInteger(v)]+$/.test(v),
            message: props => `Price ${props.value} must be a non-negative integer.`
        }
    },
    
});


module.exports = mongoose.model('Product',ProductSchema);