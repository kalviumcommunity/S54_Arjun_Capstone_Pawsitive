import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar.jsx';
import AdoptCarousal from './AdoptCarousal.jsx';
import { FaArrowCircleDown } from "react-icons/fa";
import { Box, SimpleGrid, Text, Button, Spinner } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import dogAdopt from '../../assets/dogAdopt.png';
import catAdopt from '../../assets/catAdopt.png';
import pawAdopt from '../../assets/pawAdopt.png';
import plusAdopt from '../../assets/plusAdopt.png';
import AdoptCard from './AdoptCard.jsx';

const CategoryBox = ({ image, text, onClick }) => (
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
  const [rowsToShow, setRowsToShow] = useState(3);
  const [loaded, setLoaded] = useState(false)
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    getPets();
  }, []);

  const getPets = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${import.meta.env.VITE_backendURL}/pet/all`);
      setPets(response.data.reverse());
      setFilteredPets(response.data.reverse());
      setLoaded(true)
    } catch (error) {
      console.error('Error fetching pets:', error);
    } finally {
      setLoading(false)
    }
  };

  const handleCategoryClick = (category) => {
    setRowsToShow(3);
    if (category === 'dog') {
      setFilter('dog');
      setFilteredPets(pets.filter((pet) => pet.species.toLowerCase() === 'dog'));
    } else if (category === 'cat') {
      setFilter('cat');
      setFilteredPets(pets.filter((pet) => pet.species.toLowerCase() === 'cat'));
    } else if (category === 'other') {
      setFilter('other');
      setFilteredPets(pets.filter((pet) => pet.species.toLowerCase() !== 'dog' && pet.species.toLowerCase() !== 'cat'));
    }
  };

  const handlePostPetClick = () => {
    navigate('/PostPet');
  };

  const handleViewMore = () => {
    setRowsToShow(rowsToShow + 1);
  };

  return (
    <>
      <Navbar />
      <AdoptCarousal />
      <SimpleGrid
        maxBlockSize="200px"
        columns={{ base: 4, md: 4 }}
        spacing={{ base: 4, md: 10 }}
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
        <CategoryBox image={plusAdopt} text="Add Pet" onClick={handlePostPetClick} />
      </SimpleGrid>
      {
        loading && (
          <Box width={'100%'} display={'flex'} justifyContent={'center'} mt={7}>
            <Spinner
              thickness='4px'
              speed='0.65s'
              emptyColor='gray.200'
              color='blue.500'
              size='xl' />
          </Box>
        )
      }
      {filteredPets?.length === 0 && loaded == true ? (
        <Box textAlign="center" mt={4}>
          <Text fontSize="xl">No pets available in this category.</Text>
        </Box>
      ) : (
        <>
          <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4} padding="1vw" mt={4} mx="auto" maxW={{ base: '100%', md: '90%' }} pl={{ base: 0, md: 8 }}>
            {filteredPets.slice(0, rowsToShow * 4).map((pet) => (
              <AdoptCard key={pet._id} pet={pet} />
            ))}
          </SimpleGrid>

          {filteredPets.length > rowsToShow * 4 && (
            <Box textAlign="center" mt={4} mb={4}>
              <Button colorScheme='blue' onClick={handleViewMore} rightIcon={<FaArrowCircleDown />} >View More</Button>
            </Box>
          )}
        </>
      )}
    </>
  );
};

export default Adopt;