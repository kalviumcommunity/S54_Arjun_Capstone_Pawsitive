import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import {
    Container,
    FormControl,
    FormLabel,
    Input,
    Stack,
    Button,
    Heading,
    useColorModeValue,
    VStack,
    Center,
    InputGroup,
    InputRightElement,
    Checkbox,
    Link,
    Text,
    position,
    useToast,
    Spinner,
    Box,
    HStack
} from '@chakra-ui/react';
import { auth, db } from '../firebase/firebase.js';
import { GoogleButton } from 'react-google-button';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    onAuthStateChanged,
    signInWithPopup,
    signInWithRedirect,
    signOut,
    GoogleAuthProvider,
    updateProfile
} from "firebase/auth";
import { AuthContext } from '../context/AuthContext.jsx';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';

const Signup = () => {
    const toast = useToast()
    const [show, setShow] = useState(false);
    const [agreeTAndC, setAgreeTAndC] = useState(false);
    const handleClick = () => setShow(!show);
    const navigate = useNavigate();
    const [userCredentials, setUserCredentials] = useState({});
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { setSignin, setCurrentUser } = useContext(AuthContext);
    const accountcreated = () => {
        toast({
            title: 'Thank you, your account has been created',
            position: 'bottom',
            description: "We've created your account for you.",
            status: 'success',
            duration: 3000,
            isClosable: true,
        })
    }

    function handleCredentials(e) {
        setUserCredentials({ ...userCredentials, [e.target.name]: e.target.value });
    }
    const handleSignup = async (e) => {
        e.preventDefault();
        if (!agreeTAndC) {
            setError("Please agree to the terms and conditions.");
            return;
        }
        setLoading(true);
        setError("");
        const email = userCredentials.email;
        const password = userCredentials.password
        const displayName = userCredentials.name;
        const defaultProfile = 'https://firebasestorage.googleapis.com/v0/b/pawsitive-64728.appspot.com/o/Group%2035913.png?alt=media&token=857c7bc3-4f1f-47d6-ba8b-355944132384'
        try {
            const res = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(auth.currentUser, {
                displayName,
                photoURL: defaultProfile,
            });
            await setDoc(doc(db, "users", res.user.uid), {
                uid: res.user.uid,
                displayName,
                email,
                photoURL: defaultProfile,
                favPets: []
            });
            await setDoc(doc(db, "userChats", res.user.uid), {});
            localStorage.setItem('photoURL', defaultProfile)
            localStorage.setItem('signin', true)
            accountcreated()
            navigate("/");
        } catch (err) {
            console.log("err: ", err);
            setError(err.message);
            setLoading(false);
        }
    };
    const handleGoogleSignIn = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            // Check if the user already exists in Firestore
            const userRef = doc(db, "users", user.uid);
            const userSnapshot = await getDoc(userRef);

            // If the user does not exist, create a new user document
            if (!userSnapshot.exists()) {
                const defaultProfile = 'https://firebasestorage.googleapis.com/v0/b/pawsitive-64728.appspot.com/o/Group%2035913.png?alt=media&token=857c7bc3-4f1f-47d6-ba8b-355944132384';
                await setDoc(userRef, {
                    uid: user.uid,
                    displayName: user.displayName,
                    email: user.email,
                    photoURL: user.photoURL || defaultProfile,
                    favPets: []
                });
                await setDoc(doc(db, "userChats", user.uid), {});
            }

            // Set current user and navigate
            setCurrentUser(user);
            setSignin(true);
            localStorage.setItem('photoURL', user.photoURL)
            localStorage.setItem('signin', true)
            navigate("/");
        } catch (error) {
            console.error("Error signing in with Google:", error);
            setError(error.message);
        }
    };

    const handleCheckboxChange = (e) => {
        setAgreeTAndC(e.target.checked);
    };

    return (
        <div style={{ width: '100vw', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Container maxW="7xl" p={{ base: 5, md: 10 }}>
                <Center>
                    <VStack spacing={4}>
                        <Stack align="center">
                            <Heading fontSize="3xl">Create Your Account</Heading>
                        </Stack>
                        <VStack
                            as="form"
                            boxSize={{ base: 'xs', sm: 'sm', md: 'md' }}
                            h="max-content !important"
                            bg={useColorModeValue('white', 'gray.700')}
                            rounded="lg"
                            boxShadow="lg"
                            p={{ base: 5, sm: 10 }}
                            spacing={8}
                        >
                            <VStack spacing={4} w="100%">
                                <FormControl id="name">
                                    <FormLabel>Name</FormLabel>
                                    <Input onChange={(e) => { handleCredentials(e) }} rounded="md" type="text" name='name' required />
                                </FormControl>
                                <FormControl id="email">
                                    <FormLabel>Email</FormLabel>
                                    <Input onChange={(e) => { handleCredentials(e) }} rounded="md" type="email" name='email' required inputMode='email' />
                                </FormControl>
                                <FormControl id="password">
                                    <FormLabel>Password</FormLabel>
                                    <InputGroup size="md">
                                        <Input onChange={(e) => { handleCredentials(e) }} name='password' rounded="md" type={show ? 'text' : 'password'} required inputMode='password' />
                                        <InputRightElement width="4.5rem">
                                            <Button
                                                h="1.75rem"
                                                size="sm"
                                                rounded="md"
                                                onClick={handleClick}
                                            >
                                                {show ? <ViewOffIcon /> : <ViewIcon />}
                                            </Button>
                                        </InputRightElement>
                                    </InputGroup>
                                </FormControl>
                            </VStack>
                            <VStack w="100%">
                                <Stack direction="row" justifyContent="space-between" w="100%">
                                    <Checkbox value={agreeTAndC} colorScheme="green" size="md" onChange={handleCheckboxChange}>
                                        I agree to T&C
                                    </Checkbox>
                                    <Link href='/login' textDecoration={'underline'}>Login??</Link>
                                </Stack>
                                <Button
                                    onClick={(e) => { handleSignup(e) }}
                                    bg="green.500"
                                    color="white"
                                    _hover={{
                                        bg: 'green.400'
                                    }}
                                    rounded="md"
                                    w="100%"
                                >
                                    Sign up
                                </Button>
                                {loading && (
                                    <Box width={'100%'} display={'flex'} justifyContent={'center'} mt={7}>
                                        <Spinner
                                            thickness='4px'
                                            speed='0.65s'
                                            emptyColor='gray.200'
                                            color='blue.500'
                                            size='xl' />
                                    </Box>
                                )}
                                {error && <p style={{color:'red'}}>{error}</p>}

                                <Text size={'2xl'} my={2}>----------------- OR -----------------</Text>
                                <GoogleButton type='dark' label='Sign up with Google' onClick={handleGoogleSignIn} />

                            </VStack>
                        </VStack>
                    </VStack>
                </Center>
            </Container>
        </div >
    );
};

export default Signup;