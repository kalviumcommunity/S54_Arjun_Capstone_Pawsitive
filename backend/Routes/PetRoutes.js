const express = require("express");
const router = express.Router();

const { postPet, getAllPets, getPet, editPet } = require("../Controllers/PetController");

router.post("/", postPet);
router.get("/all", getAllPets);
router.get("/:petId", getPet);
router.put("/:petId", editPet);

module.exports = router;
