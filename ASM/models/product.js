const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true     
    },
    price: {
        type: Number,
        default: 0
    },
    desc: {
        type: String,
        
    },
    avatar:{
        type: String,
    }
});

const ProductModel = new mongoose.model('product', ProductSchema);

module.exports = ProductModel;