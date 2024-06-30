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
    AvatarBadge,
    useToast,
} from '@chakra-ui/react';
import { arrayRemove, arrayUnion, collection, doc, onSnapshot, runTransaction, setDoc, updateDoc } from 'firebase/firestore';
import logo from "../assets/Group 4.svg";
import { AuthContext } from '../context/AuthContext';
import { auth, db } from '../firebase/firebase';
import { HamburgerIcon } from '@chakra-ui/icons';
import PropTypes from 'prop-types';
import { ChatContext } from '../context/ChatContext';
import axios from 'axios';

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
    const toast = useToast()

    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const { dispatch } = useContext(ChatContext);
    const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
    // const [acceptPetDetails,setAcceptPetDetails]=useState()
    useEffect(() => {
        if (currentUser && currentUser.uid) {
            setLoading(true);
            const inboxRef = doc(db, "Inbox", currentUser.uid);

            const unsubscribe = onSnapshot(inboxRef, (doc) => {
                const notificationsData = doc.data()?.notifications || [];
                setNotifications(notificationsData);

                // Check for unread notifications
                const hasUnreadNotifications = notificationsData.some(notification => !notification.read);
                setHasUnreadNotifications(hasUnreadNotifications);

                setLoading(false);
            });

            return () => unsubscribe();
        }
    }, [currentUser]);

    useEffect(() => {
        if (isModalOpen && currentUser) {
            setLoading(true);
            const inboxRef = doc(db, "Inbox", currentUser.uid);

            const unsubscribe = onSnapshot(inboxRef, (doc) => {
                const notificationsData = doc.data()?.notifications || [];
                setNotifications(notificationsData);

                // Mark notifications as read
                const unreadNotifications = notificationsData.filter(notification => !notification.read);
                if (unreadNotifications.length > 0) {
                    const updatedNotifications = notificationsData.map(notification => ({
                        ...notification,
                        read: true,
                    }));

                    updateDoc(inboxRef, { notifications: updatedNotifications })
                        .catch((error) => console.error("Error updating notifications:", error));
                }

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

    const getPet = async (petId) => {
        try {
            const res = await axios.get(`https://pawsitive-backend-seven.vercel.app/pet/${petId}`);
            return res.data;
        } catch (err) {
            console.error('Error getting Pet:', err);
            throw err;
        }
    };

    const sendMail = async (mailOptions) => {
        try {
            const response = await axios.post('https://pawsitive-backend-seven.vercel.app/sendMail', mailOptions);
            console.log('Email response:', response.data);
            if (response.data === 'Email sent successfully.') {
                toast({
                    title: 'Adopter Informed',
                    position: 'top-right',
                    description: "An email has been successfully sent to the adopter with your contact information.",
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
            } else {
                toast({
                    title: 'Email Not Sent',
                    position: 'top-right',
                    description: "The email was not sent to the adopter. Please verify the email address and try again.",
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            }
        } catch (error) {
            console.error('Error sending email:', error);
            toast({
                title: 'Error',
                description: "There was an error sending the email. Please contact the adopter directly.",
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };
    

    const emailSend = async (petId, email) => {
        try {
            const petDetails = await getPet(petId);

            const mailOptions = {
                from: 'jahnavreddy12@gmail.com',
                to: email,
                subject: `Adoption Request Approved for ${petDetails.name}`,
                html: `
                    <h1>Adoption Request Approved</h1>
                    <p>Dear Adopter,</p>
                    <p>We are pleased to inform you that your adoption request for the following pet has been approved:</p>
                    <h2>Pet Details:</h2>
                    <ul>
                        <li><strong>Name:</strong> ${petDetails.name}</li>
                        <li><strong>Species:</strong> ${petDetails.species}</li>
                        <li><strong>Breed:</strong> ${petDetails.breed}</li>
                        <li><strong>Age:</strong> ${petDetails.age} years</li>
                        <li><strong>Gender:</strong> ${petDetails.gender}</li>
                        <li><strong>Color:</strong> ${petDetails.color}</li>
                        <li><strong>Weight:</strong> ${petDetails.weight} kg</li>
                        <li><strong>Location:</strong> ${petDetails.location}</li>
                        <li><strong>Adoption Fee:</strong> ${petDetails.adoptionFee} Rs</li>
                    </ul>
                    <h2>Owner's Contact Information</h2>
                    <ul>
                        <li><strong>Mobile Number:</strong> ${petDetails.contact}</li>
                        <li><strong>Email:</strong> ${email}</li>
                    </ul>
                    <p><strong>Please Note:</strong> The owner's contact information is provided solely for arranging the adoption of ${petDetails.name}. Please use this information responsibly and refrain from misuse or unauthorized contact.</p>
                    <h2>Photos:</h2>
                    ${petDetails.photos.map(photo => `<img src="${photo}" alt="${petDetails.name}" style="max-width: 25%; height: auto; margin-left: 5%;" />`).join('')}
                    <p>Additional Information: ${petDetails.additionalInfo}</p>
                    <p>We hope you are excited to welcome ${petDetails.name} into your home. Please contact the owner for further arrangements.</p>
                    <p>Sincerely,<br/>The Adoption Team</p>
                `
            };

            await sendMail(mailOptions);

        } catch (err) {
            console.log("emailSend error: ", err);
        }
    };

    const handleAcceptRequest = async (notification) => {
        try {
            const inboxRef = doc(db, "Inbox", currentUser.uid);
            const adopterInboxRef = doc(db, "Inbox", notification.sender);

            await runTransaction(db, async (transaction) => {
                const adopterDoc = await transaction.get(adopterInboxRef);
                const adopterNotifications = adopterDoc.data()?.notifications || [];

                // Filter out the notification with the matching id
                const filteredAdopterNotifications = adopterNotifications.filter(
                    (noti) => noti.id !== notification.id
                );

                const adopterNotification = {
                    ...notification,
                    requestStatus: 'Accepted',
                    read: false,
                    message: "Your adoption request has been accepted. Contact info of the owner has been emailed to you, you can message owner for further queries.",
                };

                transaction.update(adopterInboxRef, {
                    notifications: [...filteredAdopterNotifications, adopterNotification],
                });

                transaction.update(inboxRef, {
                    notifications: arrayRemove(notification),
                });

                const updatedNotification = {
                    ...notification,
                    requestStatus: 'Accepted',
                    read: false,
                    message: 'Thank you for accepting the adoption request.',
                };
                transaction.update(inboxRef, {
                    notifications: arrayUnion(updatedNotification),
                });
            });
            await emailSend(notification.petId, notification.senderEmail)

        } catch (err) {
            console.error("Error accepting request:", err);
            toast({
                title: 'Error',
                description: "There was an error accepting the adoption request. Please try again later.",
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };

    const handleRejectRequest = async (notification) => {
        try {
            const inboxRef = doc(db, "Inbox", currentUser.uid);
            const adopterInboxRef = doc(db, "Inbox", notification.sender);

            await runTransaction(db, async (transaction) => {
                const adopterDoc = await transaction.get(adopterInboxRef);
                const adopterNotifications = adopterDoc.data()?.notifications || [];

                const filteredAdopterNotifications = adopterNotifications.filter(
                    (noti) => noti.id !== notification.id
                );

                const adopterNotification = {
                    ...notification,
                    requestStatus: 'Rejected',
                    read: false,
                    message: "The owner has rejected your adoption request.",
                };

                transaction.update(adopterInboxRef, {
                    notifications: [...filteredAdopterNotifications, adopterNotification],
                });

                transaction.update(inboxRef, {
                    notifications: arrayRemove(notification),
                });
            });
        } catch (err) {
            console.error("Error rejecting request:", err);
            toast({
                title: 'Error',
                description: "There was an error rejecting the adoption request. Please try again later.",
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };
    const ContactPerson = (uid) => {
        navigate(`/Profile/${uid}`);
    }
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
                        >
                            {hasUnreadNotifications && <AvatarBadge bg='red' boxSize='1em' />}
                        </Avatar>
                        <Avatar src={currentUser?.photoURL} size={'md'} onClick={() => navigate(`/Profile/${currentUser.uid}`)} mr={4} cursor={'pointer'} display={{ base: 'none', lg: 'inherit' }} />
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
                    <ModalHeader fontSize={25}>My Inbox</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {loading ? (
                            <Box width={'100%'} display={'flex'} justifyContent={'center'}>
                                <Spinner thickness='4px'
                                    speed='0.65s'
                                    emptyColor='gray.200'
                                    color='blue.500'
                                    size='xl' />
                            </Box>
                        ) : (
                            (notifications.length > 0 ?
                                (<List spacing={3} mb={'20px'}>
                                    {notifications.reverse().map((notification, index) => (
                                        <ListItem
                                            key={index}
                                            p={3}
                                            borderRadius="md"
                                            bg={"white"}
                                            boxShadow="md"
                                            _hover={{ boxShadow: 'xl', bg: 'gray.50' }}>
                                            <Flex alignItems="center">
                                                <Avatar src={logo} size="sm" mr={3} />
                                                <Text>{notification.message}</Text>
                                                <Text fontSize="sm" color="gray.500" ml="auto">
                                                    {new Date(notification.timestamp).toLocaleDateString()}
                                                </Text>
                                            </Flex>
                                            <Flex justifyContent={'center'} gap={10} mt={2}>
                                                {currentUser.uid === notification.sender ? (
                                                    // Adopter's buttons
                                                    <Button size="sm" colorScheme="blue" onClick={() => ContactPerson(notification.reader)}>
                                                        View owner's profile
                                                    </Button>
                                                ) : (
                                                    // Owner's buttons
                                                    <>
                                                        {notification.requestStatus == 'Pending' && (
                                                            <>
                                                                <Button size="sm" colorScheme="green" onClick={() => handleAcceptRequest(notification)}>
                                                                    Accept
                                                                </Button>
                                                                <Button size="sm" colorScheme="red" onClick={() => handleRejectRequest(notification)}>
                                                                    Reject
                                                                </Button>
                                                            </>
                                                        )}
                                                        <Button size="sm" colorScheme="blue" onClick={() => ContactPerson(notification.sender)}>
                                                            View profile
                                                        </Button>
                                                    </>
                                                )}
                                            </Flex>
                                        </ListItem>
                                    ))}
                                </List>)
                                :
                                <Box width={'100%'} display={'flex'} justifyContent={'center'}>
                                    <img src="https://media.licdn.com/dms/image/C5112AQF93ceYWRJUiQ/article-cover_image-shrink_600_2000/0/1534414530337?e=2147483647&v=beta&t=xAsP5WDskRQxiVdIIzMxKs4tOKyBiUGN4g428BV3kLY" alt="empty notification img" />
                                </Box>
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
                            {signin && (
                                <Text onClick={onModalOpen} fontSize={"lg"} my={6}>Inbox</Text>
                            )}
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