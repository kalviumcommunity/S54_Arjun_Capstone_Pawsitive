import React from 'react';
import {
    Box,
    Flex,
    HStack,
    Button,
    Text,
    Link,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Stack,
    Icon,
    IconButton,
    useDisclosure,
    useColorModeValue,
    Image
} from '@chakra-ui/react';
import { GiHamburgerMenu } from 'react-icons/gi';
import { AiOutlineClose } from 'react-icons/ai';
import { BiChevronDown } from 'react-icons/bi';
import { RiFlashlightFill } from 'react-icons/ri';
import logo from '../assets/logo.png'
const navLinks = [
    { name: 'Donate', path: '/Donate' },
    { name: 'Adopt', path: '/Adopt' },
    { name: 'Blog', path: '/Blog' },
];

const dropdownLinks = [
    { name: 'Explore', path: '/Community' },
    { name: 'Message', path: '/Community/Message' },
    { name: 'Create', path: '/Community/Create' }
];

export default function Navbar() {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <Box p={4} bg={useColorModeValue('white', 'gray.800')} w={"100vw"}>
            <Flex h={16} alignItems="center" justifyContent="space-between" mx="auto" >
                <Link to={'/'} ml={"1vw"} textDecoration={"none"} _hover={"none"}>
                    {/* <Image src={logo} h={20} w={220} /> */}
                    <h1 className='paytone-one-regular'><span id='yellow'>PAW</span>SITIVE</h1>
                </Link>
                <HStack spacing={8} alignItems="center" mr={35} >
                    <HStack as="nav" spacing={6} display={{ base: 'none', md: 'flex' }} alignItems="center">
                        {navLinks.map((link, index) => (
                            <NavLink key={index} {...link} onClose={onClose} />
                        ))}

                        {/* Dropdown Menu */}
                        <Menu autoSelect={false} isLazy>
                            {({ isOpen, onClose }) => (
                                <>
                                    <MenuButton _hover={{ color: 'black',fontSize:"lg" }}>
                                        <Flex alignItems="center">
                                            <Text>Community</Text>
                                            <Icon
                                                as={BiChevronDown}
                                                h={5}
                                                w={5}
                                                ml={1}
                                                transition="all .25s ease-in-out"
                                                transform={isOpen ? 'rotate(180deg)' : ''}
                                            />
                                        </Flex>
                                    </MenuButton>
                                    <MenuList
                                        zIndex={5}
                                        bg={useColorModeValue('rgb(255, 255, 255)', 'rgb(26, 32, 44)')}
                                        border="none"
                                        boxShadow={useColorModeValue(
                                            '2px 4px 6px 2px rgba(160, 174, 192, 0.6)',
                                            '2px 4px 6px 2px rgba(9, 17, 28, 0.6)'
                                        )}
                                    >
                                        {dropdownLinks.map((link, index) => (
                                            <MenuLink key={index} name={link.name} path={link.path} onClose={onClose} />
                                        ))}
                                    </MenuList>
                                </>
                            )}
                        </Menu>
                    </HStack>
                </HStack>

                <Button bg={"#FBBC05"} size="md" borderRadius={"20px"} display={{ base: 'none', md: 'block' }} _hover={"none"} mr={30}>
                    Sign in
                </Button>
                <IconButton
                    size="md"
                    icon={isOpen ? <AiOutlineClose /> : <GiHamburgerMenu />}
                    aria-label="Open Menu"
                    display={{ base: 'inherit', md: 'none' }}
                    onClick={isOpen ? onClose : onOpen}
                />
            </Flex>

            {/* Mobile Screen Links */}
            {isOpen ? (
                <Box pb={4} display={{ base: 'inherit', md: 'none' }} textAlign={"center"} px={9}>
                    <Stack as="nav" spacing={2}>
                        {navLinks.map((link, index) => (
                            <NavLink key={index} {...link} onClose={onClose} border={'1px solid black'} />
                        ))}
                        <Link to={'/Community'} textDecora>
                            <p>Community</p>
                        </Link>
                        {/* <Stack pl={2} spacing={1} mt={'0 !important'}>
                            {dropdownLinks.map((link, index) => (
                                <NavLink key={index} {...link} onClose={onClose} />
                            ))}
                        </Stack> */}
                    </Stack>
                </Box>
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
                color:"black",
                // color: useColorModeValue('blue.500', 'blue.200')
                fontSize:'lg'
            }}
            onClick={() => onClose()}
        >
            {name}
        </Link>
    );
};

// Dropdown MenuLink Component
const MenuLink = ({ name, path, onClose }) => {
    return (
        <Link href={path} onClick={() => onClose()}>
            <MenuItem _hover={{ textDecoration:"none",color:"black" }}>
                <Text>{name}</Text>
            </MenuItem>
        </Link>
    );
};
