import React from 'react'
import Navbar from './Navbar'
import { Box, Heading, Image, Text } from '@chakra-ui/react'
import DC from '../assets/DC.svg'

const Home = () => {
  return (
    <>
      <Navbar />
      <Box display='flex' flexDirection={{ base: 'column', md: 'row' }} p={{ base: '3vw', md: '2rem' }}>
        <Image src={DC} h={{ base: '35vh', md: '35vw' }} m={{ base: '1rem', md: '2rem' }} alignSelf="center" />
        <Box display='flex' flexDirection='column' alignItems="center" justifyContent="center" textAlign='center' p={{ base: '5vw', md: '3vw' }}>
          <Heading fontSize={{ base: '9vw', md: '6xl' }} fontWeight='bold' mb={{ base: '1rem', md: '2rem' }}>Welcome to Pawsitive where we spread <Heading size={{ base: '9vw', md: '3xl' }} className='paytone-one-regular' id='yellow'>Pawsitivity :)</Heading> </Heading>
          <Text fontSize={{ base: '3.9vw', md: '2xl' }}>Join our compassionate community dedicated to rescuing, adopting, and loving for animals in need. Together, we're shaping a brighter, kinder world for our furry friends.</Text>
        </Box>
      </Box>
    </>
  )
}

export default Home
