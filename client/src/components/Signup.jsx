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
    Text
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
import { doc, setDoc } from 'firebase/firestore';

const Signup = () => {
    const [show, setShow] = useState(false);
    const handleClick = () => setShow(!show);
    const navigate = useNavigate();
    const [userCredentials, setUserCredentials] = useState({});
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signin, setSignin, setCurrentUser } = useContext(AuthContext);

    onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log(user)
            setCurrentUser(user)
            setSignin(true)
            navigate("/");
        } else {
            console.log('err')
        }
    })

    function handleCredentials(e) {
        setUserCredentials({ ...userCredentials, [e.target.name]: e.target.value });
    }
    const handleSignup = async (e) => {
        setLoading(true);
        e.preventDefault();
        setError("");
        const email=userCredentials.email;
        const password=userCredentials.password
        const displayName = userCredentials.name;
        const defaultProfile='https://firebasestorage.googleapis.com/v0/b/pawsitive-64728.appspot.com/o/Group%2035913.png?alt=media&token=857c7bc3-4f1f-47d6-ba8b-355944132384'
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
            });
            await setDoc(doc(db, "userChats", res.user.uid), {});
            navigate("/");
        } catch (err) {
            console.log("err: ", err);
            setError(err.message);
            setLoading(false);
        }
    };
    const googleSignIn = () => {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
    };
    const handleGoogleSignIn = async () => {
        try {
            googleSignIn();
        } catch (error) {
            console.log(error);
            setError(err.message);
        }
    };
    return (
        <div style={{ width: '100vw', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Container maxW="7xl" p={{ base: 5, md: 10 }}>
                <Center>
                    <Stack spacing={4}>
                        <Stack align="center">
                            <Heading fontSize="2xl">Create your account</Heading>
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
                                    <Input onChange={(e) => { handleCredentials(e) }} rounded="md" type="email" name='email' required />
                                </FormControl>
                                <FormControl id="password">
                                    <FormLabel>Password</FormLabel>
                                    <InputGroup size="md">
                                        <Input onChange={(e) => { handleCredentials(e) }} name='password' rounded="md" type={show ? 'text' : 'password'} required />
                                        <InputRightElement width="4.5rem">
                                            <Button
                                                h="1.75rem"
                                                size="sm"
                                                rounded="md"
                                                bg={useColorModeValue('gray.300', 'gray.700')}
                                                _hover={{
                                                    bg: useColorModeValue('gray.400', 'gray.800')
                                                }}
                                                onClick={handleClick}
                                            >
                                                {show ? 'Hide' : 'Show'}
                                            </Button>
                                        </InputRightElement>
                                    </InputGroup>
                                </FormControl>
                            </VStack>
                            <VStack w="100%">
                                <Stack direction="row" justifyContent="space-between" w="100%">
                                    <Link textDecoration={'underline'}>Forgot password</Link>
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
                                {loading && <p>Creating your account, please wait...</p>}
                                {error && <p>{error}</p>}

                                <Text size={'2xl'}>----------------- OR -----------------</Text>
                                <GoogleButton type='dark' label='Sign up with Google' onClick={handleGoogleSignIn} />

                            </VStack>
                        </VStack>
                    </Stack>
                </Center>
            </Container>
        </div >
    );
};

export default Signup;