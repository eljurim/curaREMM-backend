const mongoose = require('mongoose')

const {
    Schema
} = mongoose

const doctors = new Schema({
    name: {
        required: true,
        type: String
    },
    workPlaces: {latitude:Number,
                    longitude:Number},
    specialties: {
        type: Array,
        required: true
    },
    plan: {
        type: Array,
        required: true
    },
    qualification: {
        stars:{
                type:Number,
                required:false,
                min:0,
                max: 5
                },
        count: Number
    },
    phoneNumber: {
        type: String,
        required: true
    },
})

module.exports = {
    model: mongoose.model('doctor', doctors),
    doctors
}