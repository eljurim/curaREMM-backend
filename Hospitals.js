const mongoose = require('mongoose')

const {
    Schema
} = mongoose

const hospitals = new Schema({
    name: {
        required: true,
        type: String
    },
    plan: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    position: {
        latitude:Number,
        longitude:Number
    },
    searchableAddress: String
})

module.exports = {
    model: mongoose.model('hospital', hospitals),
    hospitals
}