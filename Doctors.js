const mongoose = require('mongoose')

const {
    Schema
} = mongoose

const doctors = new Schema({
    name: {
        required: true,
        type: String
    },
    workPlaces: {
        type: String,
        required: true
    },
    specialties: {
        type: Array,
        required: true
    },
    qualification: {
        type:Number,
        required:true,
        min:0,
        max: 5
    }
})

module.exports = {
    model: mongoose.model('doctor', doctors),
    doctors
}