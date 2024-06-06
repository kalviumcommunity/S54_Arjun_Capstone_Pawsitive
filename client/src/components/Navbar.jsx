import { useContext, useEffect, useState } from 'react';
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Flex,
    HStack,
    Button,
    Icon,
    Text,
    Link,
    useDisclosure,
    useColorModeValue,
    Drawer,
    DrawerOverlay,
    DrawerContent,
    DrawerBody,
    DrawerCloseButton,
    Image,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    Popover,
    PopoverTrigger,
    Portal,
    PopoverContent,
    PopoverArrow,
    PopoverCloseButton,
    PopoverBody,
    VStack,
    Avatar,
    Spinner,
    List,
    ListItem,
} from '@chakra-ui/react';
import { collection, doc, onSnapshot } from 'firebase/firestore';
import logo from "../assets/Group 4.svg";
import { AuthContext } from '../context/AuthContext';
import { auth, db } from '../firebase/firebase';
import { HamburgerIcon } from '@chakra-ui/icons';
import PropTypes from 'prop-types';

const navLinks = [
    { name: 'Adopt', path: '/Adopt' },
    { name: 'Blog', path: '/Blog' },
    { name: 'Message', path: '/community' },
    // { name: 'Donate', path: '/Donate' }
];

export default function Navbar() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: isModalOpen, onOpen: onModalOpen, onClose: onModalClose } = useDisclosure();
    const { isOpen: isPopoverOpen, onOpen: onPopoverOpen, onClose: onPopoverClose } = useDisclosure();
    const navigate = useNavigate();
    const { signin, setSignin, currentUser } = useContext(AuthContext);
    const localPhoto = localStorage.getItem('photoURL');
    const localSignin = localStorage.getItem('signin');

    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isModalOpen && currentUser) {
            setLoading(true);
            const unsubscribe = onSnapshot(doc(db, "Inbox", currentUser.uid), (doc) => {
                setNotifications(doc.data()?.notifications || []);
                setLoading(false);
            });

            return () => unsubscribe();
        }
    }, [isModalOpen, currentUser]);

    const handleSignOut = async () => {
        try {
            setSignin(false);
            await signOut(auth);
            localStorage.clear();
            console.log("logout successful");
            navigate('/login');
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Box p={4} bg={useColorModeValue('white', 'gray.800')} w={"100vw"}>
            <Flex h={16} alignItems="center" justifyContent="space-between" mx="auto">
                <HStack alignItems={"center"} onClick={() => navigate("/")} cursor={"pointer"} ml={{ base: "1vw", md: "2vw" }}>
                    <Image src={logo} w={{ base: "9vw", md: "2.5vw" }} />
                    <Text fontSize={{ base: "40px", md: "5xl" }} className='paytone-one-regular'><span id='yellow'>PAW</span>SITIVE</Text>
                </HStack>
                <HStack spacing={8} alignItems="center" mr={35}>
                    <HStack as="nav" spacing={6} display={{ base: 'none', md: 'flex' }} alignItems="center" mr={"2vw"}>
                        {navLinks.map((link, index) => (
                            <NavLink key={index} {...link} onClose={onClose} />
                        ))}
                    </HStack>
                </HStack>

                {localSignin || signin ?
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
                        <Avatar
                            bg={"white"}
                            color={"black"}
                            mr={5}
                            cursor={"pointer"}
                            w={10}
                            h={10}
                            src='https://firebasestorage.googleapis.com/v0/b/pawsitive-64728.appspot.com/o/Screenshot%202024-05-22%20114636.png?alt=media&token=ab89da81-f5b1-4c72-8268-321237165b37'
                            display={{ base: 'none', md: 'inherit' }}
                            onClick={onModalOpen}
                        />
                        <button onClick={() => navigate(`/Profile/${currentUser.uid}`)} id='profile-pic' style={{ borderRadius: '50%', marginRight: "1vw" }} display={{ base: 'inherit', md: 'none', xl: 'none', sm: 'none' }}>
                            <img style={{ borderRadius: '50%' }} width={'45vw'} src={currentUser?.photoURL} alt="" />
                        </button>
                        <Popover isOpen={isPopoverOpen} onOpen={onPopoverOpen} onClose={onPopoverClose}>
                            <PopoverTrigger>
                                <Button bg={"#FBBC05"} size="lg" borderRadius={"30px"} display={{ base: 'none', md: 'block' }} _hover={"none"} mr={2} color={'white'} outline={"none"} _active={{ bg: "#FBBC05" }}>
                                    Log out
                                </Button>
                            </PopoverTrigger>
                            <Portal>
                                <PopoverContent>
                                    <PopoverArrow />
                                    <PopoverCloseButton />
                                    <PopoverBody>
                                        <VStack spacing={4}>
                                            <Text fontSize={"2xl"}>Are you sure??</Text>
                                            <HStack spacing={8}>
                                                <Button size={"sm"} colorScheme='blue' onClick={handleSignOut}>Yes</Button>
                                                <Button size={"sm"} colorScheme='red' onClick={onPopoverClose}>No</Button>
                                            </HStack>
                                        </VStack>
                                    </PopoverBody>
                                </PopoverContent>
                            </Portal>
                        </Popover>
                    </div>
                    : <Button onClick={() => { navigate('/signup') }} bg={"#FBBC05"} size="lg" borderRadius={"30px"} display={{ base: 'none', md: 'block' }} _hover={"none"} mr={30} color={'white'} outline={'none'}>
                        Sign up
                    </Button>}
                <Icon
                    boxSize={7}
                    as={HamburgerIcon}
                    display={{ base: 'inherit', md: 'none' }}
                    onClick={onOpen}
                />
            </Flex>
            <Modal isOpen={isModalOpen} onClose={onModalClose} isCentered size={"xl"}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>My Inbox</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {loading ? (
                            <img style={{ width: "20vw",alignSelf:'center' }} src='https://dogfood2mydoor.com/static/media/dog_load.3a3190f9.gif' />
                        ) : (
                            (notifications.length > 0 ?
                                (<List spacing={3} mb={'20px'}>
                                    {notifications.map((notification, index) => (
                                    <ListItem key={index}>
                                        <Flex alignItems="center">
                                            <Avatar src={logo} size="sm" mr={3} />
                                            <Text>{notification.text}</Text>
                                            <Text fontSize="sm" color="gray.500" ml="auto">
                                                {new Date(notification.timestamp).toLocaleDateString()}
                                            </Text>
                                        </Flex>
                                    </ListItem>
                                    ))}
                                </List>)
                                :
                                <Text textAlign={"center"}>No notifications</Text>
                            )

                        )}
                    </ModalBody>
                </ModalContent>
            </Modal>
            {isOpen && (
                <Drawer placement={'right'} onClose={onClose} isOpen={isOpen} size={'xs'}>
                    <DrawerOverlay />
                    <DrawerContent>
                        <DrawerCloseButton />
                        <DrawerBody textAlign='center' display={'flex'} flexDirection={'column'} alignItems={'center'} padding={'7vh 0 '}>
                            {signin &&
                                <button style={{ borderRadius: '50%', marginBottom: '3vw' }} onClick={() => navigate(`/Profile/${currentUser.uid}`)}>
                                    <img style={{ borderRadius: '50%' }} width={'60vw'} src={currentUser.photoURL} alt="" />
                                </button>
                            }
                            {navLinks.map((link, index) => (
                                <div key={index}>
                                    <NavLink name={link.name} path={link.path} onClose={onClose} />
                                    <br />
                                </div>
                            ))}
                            {signin ? <Button onClick={handleSignOut} color={"white"} bg={"#FBBC05"} size="md" borderRadius={"20px"} display={{ base: 'block', md: 'none' }} _hover={"none"}>
                                Log out
                            </Button> :
                                <Button onClick={() => { navigate('/signup') }} bg={"#FBBC05"} size="md" borderRadius={"20px"} display={{ base: 'block', md: 'none' }} _hover={"none"} color={'white'}>
                                    Sign up
                                </Button>}
                        </DrawerBody>
                    </DrawerContent>
                </Drawer>
            )}
        </Box>
    );
}

const NavLink = ({ name, path, onClose }) => {
    return (
        <Link
            href={path}
            lineHeight="inherit"
            _hover={{
                textDecoration: 'none',
                color: "black",
                transform: "translateY(-3px)",
                transition: "transform 0.3s ease"
            }}
            onClick={onClose}
        >
            <Text fontSize={"lg"}>{name}</Text>
        </Link>
    );
};

NavLink.propTypes = {
    name: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
};
