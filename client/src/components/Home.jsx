import React, { useContext, useState } from 'react';
import { Box, Heading, Image, Text, Flex, VStack, Button, Input, SimpleGrid, HStack, Icon, useToast } from '@chakra-ui/react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import Navbar from './Navbar';
import DC from '../assets/DC.svg';
import { FaSearch, FaHandshake, FaHeart } from 'react-icons/fa';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Timestamp, doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import AdoptMe from '../assets/AdoptMe.jpg';
import DonateImg from '../assets/DonateImg.jpeg';

const Home = () => {

  const toast = useToast()
  const key = import.meta.env.VITE_RAZORPAY_KEY_ID
  const [donation, setDonation] = useState(0)
  const { signin, currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const pets = [
    { id: 1,UID:"664c971f82617af1647fc2dc", name: 'Tyson', image: 'https://firebasestorage.googleapis.com/v0/b/pawsitive-64728.appspot.com/o/pet-image-4344.jpeg?alt=media&token=1746caec-85ee-4051-86e2-db8c783a372f' },
    // { id: 2, name: 'Isha', image: 'https://firebasestorage.googleapis.com/v0/b/pawsitive-64728.appspot.com/o/pet-image-039b.jpeg?alt=media&token=4c4be4d1-3bb5-466a-aabe-6b610a6840e5' },
    { id: 3,UID:"6629edd04823ddb7fee7a022", name: 'Archie', image: 'https://firebasestorage.googleapis.com/v0/b/pawsitive-64728.appspot.com/o/ietb.jpeg?alt=media&token=f9293814-de92-4df0-9598-550c8f66620c' },
    { id: 4,UID:"664c97bc82617af1647fc2df", name: 'Mikey', image: 'https://firebasestorage.googleapis.com/v0/b/pawsitive-64728.appspot.com/o/pet-image-f4b1.jpeg?alt=media&token=0d0c4391-26cd-4f3f-a83a-dac41c9b4735' },
    { id: 5,UID:"664c90ac01824d321fd238ea", name: 'Liger', image: 'https://firebasestorage.googleapis.com/v0/b/pawsitive-64728.appspot.com/o/liger.jpeg?alt=media&token=6cbc2fe5-a6c2-470e-9899-1987219750a1' },
    { id: 6,UID:"664ca12ae044e4ceaa64c1ed", name: 'Yuri', image: 'https://firebasestorage.googleapis.com/v0/b/pawsitive-64728.appspot.com/o/pet-image-d665.jpeg?alt=media&token=9ecf0911-455b-4466-9e21-9d12da863576' },
  ];

  const checkoutHandler = async (amount) => {
    try {
      if (!signin) {
        toast({
          title: "Please login to donate",
          position: 'top-right',
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        navigate('/login')
      }
      const { data: { order } } = await axios.post(`${import.meta.env.VITE_backendURL}/checkout`, { amount });

      const options = {
        key,
        amount: order.amount,
        currency: "INR",
        name: "Pawsitive",
        description: "razorpay",
        image: "",
        order_id: order.id,
        prefill: {
          name: currentUser.displayName,
          email: currentUser.email,
          contact: "1234567890",
        },
        notes: {
          address: "razorpay",
        },
        theme: {
          color: "#3399cc",
        },
        payment_capture: 1,
        handler: async function (response) {
          toast({
            title: "Payment Success",
            description: "Your payment was successful!",
            position: 'top-right',
            status: "success",
            duration: 5000,
            isClosable: true,
          });
          const donationData={
            'donationDetails':response,
            'donatorName': currentUser.displayName,
            'donationDateTime':Timestamp.now(),
            'donationAmount':donation,
          }
          const docRef = doc(db, 'Donations', currentUser.uid);
          await setDoc(docRef, donationData);
        },
        modal: {
          ondismiss: function () {
            toast({
              title: "Payment Cancelled",
              description: "You cancelled the payment.",
              status: "error",
              duration: 5000,
              isClosable: true,
            });
          },
        },
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (error) {
      toast({
        title: "Payment Error",
        description: error.message,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };
  const HandlePetClick = (UID) => {
    navigate(`/ViewPet/${UID}`);
  };
  return (
    <>
      <Navbar />
      <Box display='flex' flexDirection={{ base: 'column', md: 'row' }} p={{ base: '3vw', md: '2rem' }}>
        <Image className='dog-imagee' src={DC} h={{ base: '35vh', md: '35vw' }} m={{ base: '1rem', md: '2rem' }} alignSelf="center" />
        <Box display='flex' flexDirection='column' alignItems="center" justifyContent="center" textAlign='center' p={{ base: '5vw', md: '3vw' }}>
          <Heading fontSize={{ base: '9vw', md: '6xl' }} fontWeight='bold' mb={{ base: '1rem', md: '2rem' }}>Welcome to Pawsitive where we spread <Heading size={{ base: '9vw', md: '3xl' }} className='paytone-one-regular' id='yellow'>Pawsitivity :)</Heading> </Heading>
          <Text fontSize={{ base: '3.9vw', md: '2xl' }}>Join our compassionate community dedicated to rescuing, adopting, and loving for animals in need. Together, we're shaping a brighter, kinder world for our furry friends.</Text>
        </Box>
      </Box>

      <Box p={4}>
        <Text fontSize={{ base: '4xl', md: '5xl' }} fontWeight="bold" textAlign="center" mb={6}>
          Featured Pets
        </Text>
        <SimpleGrid columns={{ base: 2, sm: 2, md: 3, lg: 4, xl: 5 }} spacing={8} padding={8}>
          {pets.map((pet) => (
            <Box
              key={pet.id}
              display="flex"
              flexDirection="column"
              alignItems="center"
              borderWidth="1px"
              cursor={'pointer'}
              onClick={()=>HandlePetClick(pet.UID)}
              borderRadius="20px"
              boxShadow="lg"
              _hover={{ boxShadow: '2xl' }}
              transition="box-shadow 0.3s"
              bg="white"
              p={4}
              textAlign="center"
            >
              <Image
                src={pet.image}
                alt={pet.name}
                borderRadius="15px"
                minH="38vh"
                maxH="38vh"
                objectFit="cover"
                width="100%"
              />
              <Text fontWeight="bold" fontSize="xl" mt={4}>
                {pet.name}
              </Text>
            </Box>
          ))}
        </SimpleGrid>
      </Box>

      <Box p={4}>
        <Text fontSize={{ base: '4xl', md: '5xl' }} fontWeight="bold" textAlign="center" mb={6}>
          Your Pet Adoption Journey with Pawsitive
        </Text>
        <Flex flexDirection={{ base: 'column', md: 'row' }} alignItems="center" justifyContent="center">
          <Image
            src={AdoptMe}
            alt="Adopt a pet"
            borderRadius="20px"
            maxH={'75vh'}
            maxW="50%"
            m={4}
          />
          <VStack align="flex-start" maxW="50%" p={4}>
            <Box mb={4}>
              <HStack align="center">
                <Icon as={FaSearch} w={8} h={8} color="blue.500" />
                <Text fontWeight="bold" fontSize="3xl">Search for Your Perfect Pet</Text>
              </HStack>
              <Text color="gray.500" mt={2}>
                Begin your journey by searching for a dog or cat that matches your preferences. Simply enter your city and explore the available pets looking for a loving home.
              </Text>
            </Box>
            <Box mb={4}>
              <HStack align="center">
                <Icon as={FaHandshake} w={8} h={8} color="blue.500" />
                <Text fontWeight="bold" fontSize="3xl">Make a Connection</Text>
              </HStack>
              <Text color="gray.500" mt={2}>
                When you find a pet that captures your heart, click "show number" to get in touch with their current caregiver or rescue organization. Reach out to learn more about meeting and adopting your potential new family member.
              </Text>
            </Box>
            <Box mb={4}>
              <HStack align="center">
                <Icon as={FaHeart} w={8} h={8} color="blue.500" />
                <Text fontWeight="bold" fontSize="3xl">Adopt with Love</Text>
              </HStack>
              <Text color="gray.500" mt={2}>
                Follow the guidance provided by the rescue or pet parents to complete the adoption process. Prepare your home to welcome your new furry friend and help them adjust to their new loving environment.
              </Text>
            </Box>
          </VStack>
        </Flex>
      </Box>

      <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <Box
          as={'section'}
          width={'85vw'}
          alignSelf={'center'}
          p={4}
          bg="gray.100"
          borderRadius="20px"
          boxShadow="lg"
          m={4}
          mb={20}
        >
          <Flex
            flexDirection={{ base: 'column', md: 'row' }}
            alignItems="center"
            justifyContent="center"
          >
            <Image
              src={DonateImg}
              alt="Donate for a cause"
              borderRadius="20px"
              minW={{ base: '80%', md: '40%' }}
              m={4}
              objectFit="cover"
              maxH="300px"
            />
            <VStack
              align={'center'}
              p={4}
              textAlign={'center'}
              spacing={4}
            >
              <Text fontSize={{ base: '2xl', md: '4xl' }} fontWeight="bold">
                Donate for a Cause
              </Text>
              <Text color="black">
                Your donations help us provide better care and find homes for more pets. Every contribution makes a significant impact.
              </Text>
              <Flex mt={4} w="100%" justifyContent={'space-evenly'}>
                <Input onChange={(e) => setDonation(e.target.value)} bg={'white'} border={'solid 1px black'} minW={'40%'} type='number' placeholder="₹₹" maxW="100px" mr={2} />
                <form><script src="https://checkout.razorpay.com/v1/payment-button.js" data-payment_button_id="pl_O7W9jWb8qDNznW" async> </script>
                  <Button rightIcon={<FaHeart />} textStyle={'bold'} color={'white'} colorScheme="yellow" onClick={() => checkoutHandler(donation)}>Donate</Button>
                </form>
              </Flex>
            </VStack>
          </Flex>
        </Box>
      </div>

      <Box as="footer" p="4" bg="gray.800" color="white" textAlign="center">
        <Text>&copy; 2024 Pawsitive. All rights reserved.</Text>
      </Box>
    </>
  );
};

export default Home;