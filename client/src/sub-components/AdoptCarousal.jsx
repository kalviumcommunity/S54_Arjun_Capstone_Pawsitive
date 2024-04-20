import React, { useState, useEffect } from 'react';
import {
    Box,
    Text,
    Image,
    Center,
} from '@chakra-ui/react';
import pic1 from '../assets/adoptPics/pic1.svg'
import pic2 from '../assets/adoptPics/pic2.svg'
import adoptimg from '../assets/adoptImg 1.svg'

const cards = [
    {
        text: "Find your new best friend",
        image: pic1,
    },
    {
        text: "Find your new best friend",
        image: pic2,
    },
    {
        text: "Find your new best friend",
        image: adoptimg,
    },
];

export default function AdoptCarousel() {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prevSlide) => (prevSlide + 1) % cards.length);
        }, 6000);

        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <Box position="relative" overflow="hidden" minH={{base:"25vh",md:"55vh"}} maxH={{base:"30vh",md:"55vh"}}>
                <Image src={cards[currentSlide].image} width="100%" height="100%" objectFit="contain" boxShadow="inset 0 0 0 2000px rgba(0,0,0,0.6)" />
                <Center position="absolute" top="75%" left="50%" transform="translate(-50%, -50%)" textAlign="center">
                    <Text fontSize={{ base: '3xl', lg: '6xl' }} color="white" textShadow="2px 2px 4px rgba(0, 0, 0, 0.6)">
                        {cards[currentSlide].text}
                    </Text>
                </Center>
            </Box>
        </>
    );
}
