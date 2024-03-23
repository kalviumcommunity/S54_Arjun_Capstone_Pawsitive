import React, { useState, useEffect } from 'react';
import {
    Box,
    Stack,
    Heading,
    Text,
    VStack,
    Container,
    useBreakpointValue,
} from '@chakra-ui/react';
import rect from '../assets/rect.png'
import { Image } from '@chakra-ui/react'
import pic1 from '../assets/adoptPics/pic1.svg'
import pic2 from '../assets/adoptPics/pic2.svg'
import pic3 from '../assets/adoptPics/pic3.svg'



const cards = [
    {
        text: "Did you know? Millions of animals wait for loving homes in shelters every year.",
        image: `${pic1}`,
    },
    {
        text: "Adopting saves lives. Gain a loyal companion and change a pet's life.",
        image: `${pic2}`,
    },
    {
        text: "Help pets find forever homes. List them on our platform and connect with eager adopters",
        image: `${pic3}`,
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
            <Box position={'relative'} height={{ base: '18vh', md: '60vh' }} width={'100vw'} overflow={'hidden'}>
                <Image src={cards[currentSlide].image} />
            </Box>
            <Box
                height={{ base: '10vh', md: '20vh' }}
                position="relative"
                width={'100vw'}
                backgroundPosition="center"
                backgroundRepeat="no-repeat"
                backgroundSize="cover"
                objectFit={'contain'}
                backgroundImage={`url(${rect})`}>
                <Container size="container.lg" height="20vh" position="relative">
                    <VStack
                        // spacing={6}
                        w={'full'}
                        p={{ base: 'none', md: 'none' }}
                        maxW={'lg'}
                        position="absolute">
                        <Text fontSize={{ base: 'md', lg: '3xl' }} color="white" textAlign={'center'}>
                            {cards[currentSlide].text}
                        </Text>
                    </VStack>
                </Container>
            </Box>
        </>
    );
}
