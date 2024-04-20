import { Box, Flex, Image, Text, Button, VStack } from '@chakra-ui/react';
import { FaMapMarkerAlt, FaHeart, FaPaw } from 'react-icons/fa';
import { IoMdMale, IoMdFemale } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

export const AdoptCard = ({ pet }) => {
    const navigate = useNavigate();
    
    const handleProfileClick = (userId) => {
        navigate(`/Profile/${userId}`);
    };
    return (
        <Box
            maxW="20vw"
            borderWidth="1px"
            borderRadius="30px"
            overflow="hidden"
            boxShadow="lg"
            bg="white"
            p={4}
            m={4}
        >
            <Image borderRadius={"20px"} src={pet.image} alt={pet.name} />

            <Flex justify="space-between" mt={4} align="center" padding={"2"}>
                <VStack align="flex-start">
                    <Flex align="center">
                        <Text fontWeight="bold" fontSize="xl" textAlign="left" mr={2}>
                            {pet.name}
                        </Text>
                        {pet.gender === 'male' ? (
                            <IoMdMale />
                        ) : (
                            <IoMdFemale />
                        )}
                    </Flex>

                    <Flex align="center">
                        <FaMapMarkerAlt color="gray.500" />
                        <Text ml={2} textAlign="left">{pet.location}</Text>
                    </Flex>
                </VStack>
                <Box>
                    <Button colorScheme="red" variant="ghost" >
                        <FaHeart size={"30px"} />
                    </Button>
                </Box>
            </Flex>

            <div style={{ display: "flex", gap: "1vw", alignItems: "center",marginLeft:"0.5vw" }}>
                <img onClick={() => handleProfileClick(pet.owner)} id='blogger-pic' style={{ borderRadius: "50%", cursor: "pointer" }} src={pet.image} alt="profile-pic" />
                <Text fontSize={{ base: "2xl", md: "1xl" }}>Lisa</Text>
            </div>

            <Button outline={'none'} colorScheme="blue" width={"100%"} mt={4}>Know More</Button>
        </Box>
    );
};

export default AdoptCard;
