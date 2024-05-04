import React, { useContext, useEffect, useState } from 'react';
import { Box, Flex, Image, Text, Button, VStack, Icon } from '@chakra-ui/react';
import { FaMapMarkerAlt, FaHeart, FaRegHeart } from 'react-icons/fa';
import { IoMdMale, IoMdFemale } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { AuthContext } from '../context/AuthContext';

const AdoptCard = ({ pet }) => {
    const navigate = useNavigate();
    const [owner, setOwner] = useState(null);
    const [liked, setLiked] = useState(false);
    const {currentUser}=useContext(AuthContext)
    useEffect(() => {
        const getOwnerData = async () => {
            try {
                const docRef = doc(db, 'users', pet.createdBy);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const userData = docSnap.data();
                    setOwner(userData);
                } else {
                    console.log('No such owner found!');
                }
            } catch (err) {
                console.error('Error fetching user:', err);
            }
        };
    
        const checkLiked = async () => {
            try {
                const userRef = doc(db, 'users', currentUser.uid);
                const docSnap = await getDoc(userRef);
                if (docSnap.exists()) {
                    const userData = docSnap.data();
                    const isLiked = userData.favPets.includes(pet._id);
                    setLiked(isLiked);
                }
            } catch (err) {
                console.error('Error checking favorites:', err);
            }
        };
    
        getOwnerData();
        checkLiked();
    }, [pet.createdBy, currentUser.uid, pet._id]);
    

    const handleProfileClick = (userId) => {
        navigate(`/Profile/${userId}`);
    };

    const handlePetClick = (petId) => {
        navigate(`/ViewPet/${petId}`);
    };

    const handleLikeClick = async () => {
        try {
            const userRef = doc(db, 'users', currentUser.uid);
            setLiked((prevLiked) => !prevLiked);
            if (liked) {
                await updateDoc(userRef, {
                    favPets: arrayRemove(pet._id),
                });
            } else {
                await updateDoc(userRef, {
                    favPets: arrayUnion(pet._id),
                });
            }
        } catch (err) {
            console.error('Error updating favorites:', err);
        }
    };

    return (
        <Box
            display="flex"
            flexDirection="column"
            maxW={{ base: '85vw', md: '20vw' }}
            borderWidth="1px"
            borderRadius="30px"
            justifyContent="space-between"
            boxShadow="lg"
            _hover={{ boxShadow: '2xl' }}
            transition="box-shadow 0.3s"
            bg="white"
            p={4}
            m={4}
            ml={{ base: '7vw', md: '0' }}
        >
            <Image onClick={() => handlePetClick(pet._id)} cursor="pointer" borderRadius="10%" src={pet.photos[0]} alt={pet.name} minH="35vh" maxH="35vh" objectFit="cover" maxW="100%" />

            <Flex justify="space-between" mt={4} align="center" padding={2}>
                <VStack align="flex-start">
                    <Flex align="center">
                        <Text fontWeight="bold" fontSize="2xl" textAlign="left" mr={2}>
                            {pet.name}
                        </Text>
                        {pet.gender === 'Male' ? (
                            <Icon as={IoMdMale} color="blue" w={6} h={6} />
                        ) : (
                            <Icon as={IoMdFemale} color="red" w={6} h={6} />
                        )}
                    </Flex>

                    <Flex align="center">
                        <Icon as={FaMapMarkerAlt} color="black" w={5} h={5} />
                        {/* <Text ml={2} textAlign="left" color="grey" w={"5vw"} textOverflow={"ellipsis"}>
                            {pet.location}
                        </Text> */}
                        <h2 style={{marginLeft:"0.5vw",width:"6vw",color:"grey",textOverflow:"ellipsis",overflow:"hidden",whiteSpace:"nowrap"}}>
                            {pet.location}
                        </h2>
                    </Flex>
                </VStack>
                <Box>
                    <Box colorScheme="white" mb={3} mr={3} cursor="pointer" onClick={handleLikeClick}>
                        <Icon as={liked ? FaHeart : FaRegHeart} color="red" w={6} h={6} />
                    </Box>
                </Box>
            </Flex>

            <Flex align="center" mt={4}>
                <Image onClick={() => handleProfileClick(owner?.uid)} borderRadius="full" cursor="pointer" src={owner?.photoURL} alt="profile-pic" boxSize="30px" mx={2} />
                <Text fontSize={{ base: 'sm', md: 'md' }} onClick={() => handleProfileClick(owner?.uid)} cursor="pointer" textDecoration="underline" mb={1}>
                    {owner?.displayName}
                </Text>
            </Flex>

            <Button onClick={() => handlePetClick(pet._id)} outline="none" colorScheme="blue" width="100%" mt={4}>
                Know More
            </Button>
        </Box>
    );
};

export default AdoptCard;
