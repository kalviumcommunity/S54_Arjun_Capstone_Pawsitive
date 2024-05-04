import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar.jsx';
import AdoptCarousal from '../../sub-components/AdoptCarousal.jsx';
import AdoptCard from '../../sub-components/AdoptCard.jsx';
import { Box, SimpleGrid, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import dogAdopt from '../../assets/dogAdopt.png';
import catAdopt from '../../assets/catAdopt.png';
import pawAdopt from '../../assets/pawAdopt.png';
import plusAdopt from '../../assets/plusAdopt.png';

const CategoryBox = ({ image, text, onClick,big }) => (
  <Box
    bg="white"
    padding="1vw 2vw"
    display="flex"
    flexDirection="column"
    alignItems="center"
    justifyContent="center"
    borderRadius="10px"
    boxShadow="lg"
    _hover={{ bg: '#FFE28D', boxShadow: 'xl' }}
    cursor="pointer"
    transition="background-color 0.4s, box-shadow 0.3s"
    color="grey"
    onClick={onClick}
    textAlign={"center"}
  >
    <img src={image} alt={text} />
    <Text fontSize={{ base: 'sm', md: '2xl' }}>{text}</Text>
  </Box>
);

const Adopt = () => {
  const navigate = useNavigate();
  const [pets, setPets] = useState([]);
  const [filteredPets, setFilteredPets] = useState([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    getPets();
  }, []);

  const getPets = async () => {
    try {
      const response = await axios.get('https://pawsitive-backend-seven.vercel.app/pet/all');
      setPets(response.data);
      setFilteredPets(response.data);
    } catch (error) {
      console.error('Error fetching pets:', error);
    }
  };

  const handleCategoryClick = (category) => {
    if (category === 'dog') {
      setFilter('dog');
      setFilteredPets(pets.filter((pet) => pet.species === 'dog'));
    } else if (category === 'cat') {
      setFilter('cat');
      setFilteredPets(pets.filter((pet) => pet.species === 'cat'));
    } else if (category === 'other') {
      setFilter('other');
      setFilteredPets(pets.filter((pet) => pet.species !== 'dog' && pet.species !== 'cat'));
    }
  };

  const handlePostPetClick = () => {
    navigate('/PostPet');
  };

  return (
    <>
      <Navbar />
      <AdoptCarousal />
      <SimpleGrid
        maxBlockSize="200px"
        columns={{ base: 4, md: 4 }}
        spacing={{ base: 2, md: 10 }}
        padding="2vw"
        mt={{ base: '-5vw', md: '-4vw' }}
        mx="auto"
        maxW={{ base: '95%', md: '55%' }}
        zIndex="1"
        position="relative"
      >
        <CategoryBox image={dogAdopt} text="Dogs" onClick={() => handleCategoryClick('dog')} />
        <CategoryBox image={catAdopt} text="Cats" onClick={() => handleCategoryClick('cat')} />
        <CategoryBox image={pawAdopt} text="Others" onClick={() => handleCategoryClick('other')} />
        <CategoryBox image={plusAdopt} text="Add Pet" big={true} onClick={handlePostPetClick} />
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4} padding="1vw" mt={4} mx="auto" maxW={{ base: '100%', md: '90%' }} pl={{ base: 0, md: 8 }}>
        {filteredPets.map((pet) => (
          <AdoptCard key={pet._id} pet={pet} />
        ))}
      </SimpleGrid>
    </>
  );
};

export default Adopt;
