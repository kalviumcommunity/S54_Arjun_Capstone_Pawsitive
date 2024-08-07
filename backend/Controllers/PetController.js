const Pets = require("../Models/PetModel");

const getAllPets = async (req, res) => {
    try {
        const allPets = await Pets.find();
        res.status(200).json(allPets);
    } catch (error) {
        console.error('Error getting pets:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getPet = async (req, res) => {
    const { petId } = req.params;

    try {
        const pet = await Pets.findOne({ _id: petId });

        if (!pet) {
            return res.status(404).json({ message: 'Pet Not Found', pet });
        }
        res.status(200).json(pet);
    } catch (err) {
        console.error(err);
        res.status(500).json({ err: 'Internal Server Error' });
    }
};

const postPet = async (req, res) => {
    try {
        const {
            name,
            species,
            breed,
            age,
            gender,
            // size,
            // color,
            weight,
            // spayedNeutered,
            // vaccinationStatus,
            // healthStatus,
            // temperament,
            // history,
            contact,
            ageUnit,
            photos,
            location,
            adoptionFee,
            additionalInfo,
            createdBy
        } = req.body;

        const newPet = new Pets({
            name,
            species,
            breed,
            age,
            gender,
            // size,
            // color,
            weight,
            // spayedNeutered,
            // vaccinationStatus,
            // healthStatus,
            // temperament,
            // history,
            contact,
            ageUnit,
            photos,
            location,
            adoptionFee,
            additionalInfo,
            createdBy
        });

        const savedPet = await newPet.save();
        res.status(201).json({ message: "Pet Created Successfully", pet: savedPet });
    } catch (error) {
        console.error("Error creating Pet:", error);
        res.status(500).json({ message:error.message });
    }
};

const editPet = async (req, res) => {
    const { petId } = req.params;
    const { name, species, age, owner } = req.body;

    try {
        const pet = await Pets.findById(petId);

        if (!pet) {
            return res.status(404).json({ message: 'Pet not found' });
        }

        pet.name = name;
        pet.species = species;
        pet.age = age;
        pet.owner = owner;

        const updatedPet = await pet.save();

        res.status(200).json({ message: 'Pet updated successfully', pet: updatedPet });
    } catch (error) {
        console.error('Error updating pet:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
const getFavoritePets = async (req, res) => {
    const { petIds } = req.query;
    try {
        const pets = await Pets.find({ _id: { $in: petIds.split(',') } });
        res.status(200).json(pets);
    } catch (error) {
        console.error('Error getting favorite pets:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
module.exports = {
    getAllPets,
    getPet,
    postPet,
    editPet,
    getFavoritePets
};
