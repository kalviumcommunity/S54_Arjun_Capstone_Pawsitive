const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    species: {
        type: String,
        required: true
    },
    breed: String,
    age: {
        type: Number,
        required: true
    },
    gender: {
        type: String,
        enum: ['Male', 'Female'],
        required: true
    },
    ageUnit:{
        type :String ,
        enum:[ "years", "months","weeks"],
        required:"true"
    },
    // size: {
    //     type: String,
    //     enum: ['small', 'medium', 'large']
    // },
    // color: String,
    weight: Number,
    // spayedNeutered: {
    //     type: Boolean,
    //     default: false
    // },
    // vaccinationStatus: String,
    // healthStatus: String,
    // temperament: String,
    // history: String,
    photos: [String],
    location: {
        type: String,
        required: true
    },
    additionalInfo: {
        type: String
    },
    contact:{
        type: String,
        required: true
    },
    adoptionFee: Number,
    createdBy:{
        type:String,
        required:true
    },
    dateCreated: {
        type: Date,
        default: Date.now(),
    },
});

const Pet = mongoose.model('Pet', petSchema);

module.exports = Pet;
