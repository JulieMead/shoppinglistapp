const mongoose = require('mongoose')
const shoppinglistSchema = new mongoose.Schema({
    item: {
        type: String,
        required: true
    },
    quantity: {
        type: String,
        required: false
    },
    date: {
        type: Date,
        default: Date.now
    }
})
module.exports = mongoose.model('shoppinglist', shoppinglistSchema, 'items')