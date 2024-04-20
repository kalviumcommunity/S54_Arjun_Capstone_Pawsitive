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
        enum: ['m', 'f', 'unknown'],
        required: true
    },
    size: {
        type: String,
        enum: ['small', 'medium', 'large']
    },
    color: String,
    weight: Number,
    spayedNeutered: {
        type: Boolean,
        default: false
    },
    vaccinationStatus: String,
    healthStatus: String,
    temperament: String,
    history: String,
    photos: [String],
    location: {
        type: String,
        required: true
    },
    adoptionFee: Number,
    additionalInfo: String
});

const Pet = mongoose.model('Pet', petSchema);

module.exports = Pet;
