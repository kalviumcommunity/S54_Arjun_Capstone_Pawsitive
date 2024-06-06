import React, { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { arrayRemove, arrayUnion, doc, getDoc, getDocs, onSnapshot, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import axios from 'axios';
import Navbar from '../Navbar';
import { Box, Button, Flex, Heading, Image, Modal, ModalOverlay, ModalContent, ModalBody, ModalCloseButton, Text, HStack, Circle, AspectRatio, Icon, VStack, ModalHeader, useDisclosure, AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter, useToast } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { FaHeart, FaMapMarkerAlt, FaRegHeart } from 'react-icons/fa';
import { AuthContext } from '../../context/AuthContext';
import { ChatContext } from '../../context/ChatContext';
import { FaShareFromSquare } from "react-icons/fa6";

const ViewPet = () => {
  const { petId } = useParams();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isAlertOpen, onOpen: onAlertOpen, onClose: onAlertClose } = useDisclosure()
  const cancelRef = useRef()
  const toast = useToast()
  const [pet, setPet] = useState(null);
  const [owner, setOwner] = useState(null);
  const [loading, setLoading] = useState(false);
  const [liked, setLiked] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [err, setErr] = useState(false);
  const { currentUser, setMob } = useContext(AuthContext)
  const { dispatch } = useContext(ChatContext)
  const navigate = useNavigate()
  const getPet = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`https://pawsitive-backend-seven.vercel.app/pet/${petId}`);
      setPet(res.data);
      getOwner(res.data.createdBy);
    } catch (err) {
      console.error('Error getting Pet:', err);
    }
  };

  const getOwner = async (uid) => {
    try {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const userData = docSnap.data();
        setOwner(userData);
        console.log("ownerData: ", userData);
        setLoading(false)
      } else {
        console.log("No such Owner found!");
        setLoading(false)
      }
    } catch (err) {
      console.error("Error fetching user:", err);
    }
  };

  useEffect(() => {
    getPet();
  }, [petId]);

  const handleOpenFullscreen = (photo) => {
    setFullscreenImage(photo);
    setIsFullscreenOpen(true);
  };

  const handleCloseFullscreen = () => {
    setIsFullscreenOpen(false);
    setFullscreenImage(null);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? pet.photos.length - 1 : prevIndex - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === pet.photos.length - 1 ? 0 : prevIndex + 1));
  };
  const handleProfileClick = (userId) => {
    navigate(`/Profile/${userId}`);
  };

  const ContactOwner = async () => {
    const combinedId =
      currentUser.uid > owner.uid
        ? currentUser.uid + owner.uid
        : owner.uid + currentUser.uid;
    try {
      setLoading(true)
      // Check if the chat already exists
      const chatSnapshot = await getDoc(doc(db, "chats", combinedId));

      if (chatSnapshot.exists()) {
        // If the chat exists, dispatch its info to the chat context
        const chatInfo = {
          uid: owner.uid,
          displayName: owner.displayName,
          photoURL: owner.photoURL,
        };
        dispatch({ type: "CHANGE_USER", payload: chatInfo });
        setMob(true)

      } else {
        // If the chat doesn't exist, create it and then dispatch its info
        await Promise.all([
          // Create the chat document
          setDoc(doc(db, "chats", combinedId), { messages: [] }),
          // Update userChats for current user
          updateDoc(doc(db, "userChats", currentUser.uid), {
            [combinedId]: {
              userInfo: {
                uid: owner.uid,
                displayName: owner.displayName,
                photoURL: owner.photoURL,
              },
              date: serverTimestamp(),
            },
          }),
          // Update userChats for owner
          updateDoc(doc(db, "userChats", owner.uid), {
            [combinedId]: {
              userInfo: {
                uid: currentUser.uid,
                displayName: currentUser.displayName,
                photoURL: currentUser.photoURL,
              },
              date: serverTimestamp(),
            },
          }),
        ]);

        // Dispatch the chat info
        const chatInfo = {
          uid: owner.uid,
          displayName: owner.displayName,
          photoURL: owner.photoURL,
        };
        dispatch({ type: "CHANGE_USER", payload: chatInfo });
        setMob(true)
      }
      setLoading(false)
      navigate("/community");

    } catch (err) {
      console.log("Error contacting owner:", err);
      setErr(true);
      setLoading(false)
    }
  };
  const Adoptpet = async () => {
    try {
      setLoading(true);
      const timestamp = new Date().toISOString();

      const notification = {
        text: `${currentUser?.displayName} has decided to adopt ${pet?.name}`,
        petId: petId,
        adopter: currentUser?.uid,
        timestamp:timestamp
      };
  
      await setDoc(doc(db, "Inbox", owner.uid), {
        notifications: arrayUnion(notification),
      });
  
      await updateDoc(doc(db, 'users', currentUser?.uid), {
        adoptedPets: arrayUnion(pet._id),
      });
  
      onOpen();
    } catch (err) {
      console.error("Error adopting pet:", err);
      toast({
        title: 'Error',
        description: "There was an error processing your adoption request. Please try again later.",
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
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
        favpetadded()
      }
    } catch (err) {
      console.error('Error updating favorites:', err);
    }
  };
  const favpetadded = () => {
    toast({
      title: 'Added to favourites',
      position: 'top-right',
      description: "Visit profile page for your favourite pets",
      status: 'success',
      duration: 3000
    })
  }
  return (
    <>
      <Navbar />

      {loading ? <img id='loader-img' src='https://dogfood2mydoor.com/static/media/dog_load.3a3190f9.gif' /> : <Box mt={8} display={"flex"} flexDirection={{ base: "column", md: "row" }} alignItems={{ base: "inherit", md: "center" }} >

        <Box flex="1" mr={8} ml={8} position="relative" borderRadius={"20px"} padding={"1vw"} >
          {pet && (
            <>
              <Box display={"flex"} justifyContent={"center"} mb={4}>
                <Image onClick={() => handleOpenFullscreen(pet.photos[currentImageIndex])} cursor={"pointer"} src={pet.photos[currentImageIndex]} alt={"photo"} borderRadius="md" boxShadow="md" maxW="95%" minW={"40%"} maxH={{ base: "50vh", md: "60vh" }} />
                <Button position="absolute" left={{ base: "0", md: "1rem" }} top="50%" colorScheme="blue" onClick={handlePrevImage} width={"40px"} transform="translateY(-50%)" borderRadius={"50%"}>
                  <ChevronLeftIcon w={6} h={6} />
                </Button>
                <Button position="absolute" right={{ base: "0", md: "1rem" }} top="50%" colorScheme="blue" onClick={handleNextImage} width={"40px"} transform="translateY(-50%)" borderRadius={"50%"}>
                  <ChevronRightIcon w={6} h={6} />
                </Button>
              </Box>
              <HStack spacing={2} justify="center">
                {pet.photos.map((_, index) => (
                  <Circle
                    key={index}
                    size="10px"
                    bg={index === currentImageIndex ? 'blue.400' : 'gray.300'}
                    _hover={{ cursor: 'pointer' }}
                    onClick={() => setCurrentImageIndex(index)}
                  />
                ))}
              </HStack>
            </>
          )}
        </Box>

        <Box flex="1" mt={"2vw"} ml={{ base: "10vw" }}>
          {pet && (
            <Box boxShadow={"lg"} border={"2px solid grey"} width={{ base: "90%", md: "80%" }} mt={3} borderRadius={"lg"} padding={"2vw"} mb={8} position={"relative"}>
              <Heading as="h1" size="xl" mb={4}>{pet.name}</Heading>
              <Box colorScheme="white" mb={3} mr={3} cursor="pointer" onClick={handleLikeClick} position={"absolute"} top={"2vw"} right={"1vw"}>
                <Icon as={liked ? FaHeart : FaRegHeart} color="red" w={8} h={8} />
                <Icon as={FaShareFromSquare} ml={4} w={8} h={8} />
              </Box>
              <Text fontSize={"xl"} mb={3}>
                {pet.species} &middot; {pet.gender} &middot; {pet.breed}
              </Text>
              <HStack alignItems={"center"} mb={4}>
                <Icon as={FaMapMarkerAlt} color="black" w={5} h={5} />
                <Text fontSize="xl">
                  {pet.location}
                </Text>
              </HStack>
              {owner && <div style={{ display: "flex", gap: "1vw", alignItems: "center", marginBottom: "2vw" }}>
                <img id='blogger-pic' onClick={() => handleProfileClick(owner.uid)} style={{ borderRadius: "50%", cursor: "pointer" }} src={owner.photoURL} alt="profile-pic" />
                <Text fontSize={"xl"} onClick={() => handleProfileClick(owner.uid)} cursor={"pointer"}>
                  {owner.displayName}
                </Text>
              </div>}
              {/* {pet.species}  {pet.breed} {pet.age} {pet.gender} */}
              {/* <strong>Breed:</strong> {pet.breed} <br />
              <strong>Age:</strong> {pet.age} <br />
              <strong>Gender:</strong> {pet.gender} <br /> */}
              {/* <Flex justifyContent="space-between" alignItems="center">
                <Button colorScheme="blue">Contact Owner</Button>
                <Button colorScheme="green">Adopt Now</Button>
              </Flex> */}
              <VStack alignItems={"spread"} padding={"0 3vw"} >
                <Button borderRadius={"15px"} padding={"1.5vw"} _hover={{ bg: "#FFECB7" }} fontSize={"xl"} bg={"#FFECB7"} onClick={ContactOwner}>
                  Contact owner
                </Button>
                <Button onClick={onAlertOpen} borderRadius={"15px"} padding={"1.5vw"} fontSize={"xl"} _hover={{ bg: "#FFCC37" }} bg={"#FFCC37"} color={"white"}>
                  Adopt now
                </Button>
              </VStack>
            </Box>

          )}
        </Box>
      </Box>}

      <Modal isOpen={isFullscreenOpen} onClose={handleCloseFullscreen} blockScrollOnMount={false} motionPreset='slideInBottom' isCentered size={"xl"}>
        <ModalOverlay bg="rgba(0, 0, 0, 0.8)" />
        <ModalContent bg={"transparent"}>
          {/* <ModalCloseButton color="white" bg={"transparent"} position={"absolute"} top={"0"} right={"0"}/> */}
          <ModalBody display="flex" justifyContent="center" alignItems="center">
            {fullscreenImage && (
              <Image src={fullscreenImage} alt="Fullscreen" maxW="90vw" maxH="85vh" borderRadius="md" />
            )}
            {/* {Adopted && 
              <Box>

              </Box>
              } */}
          </ModalBody>
        </ModalContent>
      </Modal>
      <Modal isOpen={isOpen} onClose={onClose} isCentered size={"xl"} motionPreset='slideInBottom'>
        <ModalOverlay />
        <ModalContent textAlign={"center"} justifyContent={"center"} alignItems={"center"}>
          <ModalCloseButton />
          <img
            src="https://mobigram.s3.amazonaws.com/production/suggested_mobigram/cover_image/3588/Funny-dog-says-thank-you.gif"
            alt="Thank you"
            style={{ height: "50vh", alignSelf: "center" }}
          />
          <ModalHeader>
            Thank you for helping us give {pet?.name} a loving home!
            <br />
            <Text fontSize="lg" mt={4}>
              Your adoption request has been sent to the owner of {pet?.name}. We will notify you once the owner responds to your request.
            </Text>
            <Text fontSize="lg" mt={4}>
              In the meantime, you can contact the owner directly to discuss any further details or queries regarding the adoption process.
            </Text>
          </ModalHeader>
        </ModalContent>
      </Modal>

      <AlertDialog
        isOpen={isAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={onAlertClose}
        motionPreset='slideInBottom'
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              Adopt {pet?.name}
            </AlertDialogHeader>

            <AlertDialogBody>
              Do you confirm to Adopt {pet?.name}
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onAlertClose}>
                No
              </Button>
              <Button colorScheme='blue' onClick={() => {
                onAlertClose();
                Adoptpet()
              }} ml={3}>
                I confirm
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default ViewPet;
