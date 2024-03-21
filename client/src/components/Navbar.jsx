import React, { useContext } from 'react';
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Flex,
    HStack,
    Button,
    Stack,
    Icon,
    Text,
    Link,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    useDisclosure,
    useColorModeValue,
    IconButton,
    Drawer,
    DrawerOverlay,
    DrawerContent,
    DrawerHeader,
    DrawerBody,
    DrawerCloseButton,
} from '@chakra-ui/react';
import { GiHamburgerMenu } from 'react-icons/gi';
import { AiOutlineClose } from 'react-icons/ai';
import { BiChevronDown } from 'react-icons/bi';
import logo from '../assets/logo.png';
import { AppContext } from '../context/ParentContext';
import { auth } from '../firebase/config';

const navLinks = [
    { name: 'Donate', path: '/Donate' },
    { name: 'Adopt', path: '/Adopt' },
    { name: 'Blog', path: '/Blog' },
];

export default function Navbar() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const Navigate = useNavigate();
    const { signin, setSignin } = useContext(AppContext);

    const handleSignOut = async () => {
        try {
            setSignin(false)
            await signOut(auth)
            console.log("logout successful")
            Navigate('/signup')
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Box p={4} bg={useColorModeValue('white', 'gray.800')} w={"100vw"}>
            <Flex h={16} alignItems="center" justifyContent="space-between" mx="auto" >
                <Link href={'/'} ml={"1vw"} textDecoration={"none"} _hover={"none"}>
                    <h1 className='paytone-one-regular'><span id='yellow'>PAW</span>SITIVE</h1>
                </Link>
                <HStack spacing={8} alignItems="center" mr={35} >
                    <HStack as="nav" spacing={6} display={{ base: 'none', md: 'flex' }} alignItems="center">
                        {navLinks.map((link, index) => (
                            <NavLink key={index} {...link} onClose={onClose} />
                        ))}


                        <Menu>
                            <MenuButton outline={'none'} >
                                <HStack><Text _hover={{ fontSize: "lg" }}>Community</Text><BiChevronDown /></HStack>
                            </MenuButton>
                            <MenuList>
                                <Link href='/community/explore'><MenuItem>Explore</MenuItem></Link>
                                <Link href='/community/message'><MenuItem>Message</MenuItem></Link>
                                <Link href='/community/create'><MenuItem>Create</MenuItem></Link>
                            </MenuList>
                        </Menu>
                    </HStack>
                </HStack>

                {signin ? <Button onClick={handleSignOut} bg={"#FBBC05"} size="lg" borderRadius={"30px"} display={{ base: 'none', md: 'block' }} _hover={"none"} mr={30} color={'white'} outline={'none'}>
                    Log out
                </Button> : <Button onClick={() => { Navigate('/signup') }} bg={"#FBBC05"} size="lg" borderRadius={"30px"} display={{ base: 'none', md: 'block' }} _hover={"none"} mr={30} color={'white'} outline={'none'}>
                    Sign up
                </Button>}
                <IconButton
                    size="md"
                    icon={<GiHamburgerMenu />}
                    aria-label="Open Menu"
                    display={{ base: 'inherit', md: 'none' }}
                    onClick={onOpen}
                />
            </Flex>

            {isOpen ? (
                <Drawer placement={'right'} onClose={onClose} isOpen={isOpen} size={'xs'} >
                    <DrawerOverlay />
                    <DrawerContent>
                        <DrawerCloseButton />
                        <DrawerBody textAlign='center' display={'flex'} flexDirection={'column'} alignItems={'center'} padding={'7vh 0 '}>
                            {navLinks.map((link, index) => (
                                <div>
                                    <NavLink key={index} {...link} onClose={onClose} border={'1px solid black'} />
                                    <br />
                                </div>
                            ))}
                            <Link to={'/Community'} textDecoration={'none'}>
                                <p>Community</p>
                            </Link>
                            {signin ? <Button onClick={handleSignOut} bg={"#FBBC05"} size="md" borderRadius={"20px"} display={{ base: 'block', md: 'none' }} _hover={"none"}    >
                                Log out
                            </Button> :
                                <Button onClick={() => { Navigate('/signup') }} bg={"#FBBC05"} size="md" borderRadius={"20px"} display={{ base: 'block', md: 'none' }} _hover={"none"}   color={'white'}>
                                    Sign up
                                </Button>}
                        </DrawerBody>
                    </DrawerContent>
                </Drawer>
            ) : null}
        </Box>
    );
}

// NavLink Component
const NavLink = ({ name, path, onClose }) => {
    return (
        <Link
            href={path}
            lineHeight="inherit"
            _hover={{
                textDecoration: 'none',
                color: "black",
                // color: useColorModeValue('blue.500', 'blue.200'),
                fontSize: 'lg'
            }}
            onClick={() => onClose()}
        >
            <Text size={'4xl'}>{name}</Text>
        </Link>
    );
};