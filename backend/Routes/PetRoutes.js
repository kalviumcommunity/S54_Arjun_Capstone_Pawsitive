const express = require("express");
const router = express.Router();

const { postPet, getAllPets, getPet, editPet,getFavoritePets } = require("../Controllers/PetController");

router.post("/", postPet);
router.get("/all", getAllPets);
router.get("/:petId", getPet);
router.put("/:petId", editPet);
router.get('/pets/favorite', getFavoritePets);

module.exports = router;
