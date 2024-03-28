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
import { auth } from '../firebase/config.js';
import { GoogleButton } from 'react-google-button';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    onAuthStateChanged,
    signInWithPopup,
    signInWithRedirect,
    signOut,
    GoogleAuthProvider
} from "firebase/auth";
import { AppContext } from '../context/ParentContext.jsx';

const Signup = () => {
    const [show, setShow] = useState(false);
    const handleClick = () => setShow(!show);
    const navigate = useNavigate();
    const [userCredentials, setUserCredentials] = useState({});
    const [error, setError] = useState('');
    const { signin, setSignin, userData, setUserData } = useContext(AppContext);

    onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log(user)
            setUserData({ id: user.uid, email: user.email })
            setSignin(true)
            navigate("/");
        } else {
            console.log('err')
        }
    });

    function handleCredentials (e) {
        setUserCredentials ({ ...userCredentials, [e.target.name]: e.target.value });
    }

    function handleSignup(e) {
        e.preventDefault();
        setError("");
        createUserWithEmailAndPassword(auth, userCredentials.email, userCredentials.password)
            .then((userCredential) => {
                console.log(userCredential);
            })
            .catch((error) => {
                setError(error.message);
            });
    }
    const googleSignIn = () => {
        const provider = new GoogleAuthProvider();
        signInWithRedirect(auth, provider)
    };
    const handleGoogleSignIn = async () => {
        try {
            await googleSignIn();
        } catch (error) {
            console.log(error);
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
                                <FormControl id="email">
                                    <FormLabel>Email</FormLabel>
                                    <Input onChange={(e) => { handleCredentials(e) }} rounded="md" type="email" name='email' />
                                </FormControl>
                                <FormControl id="password">
                                    <FormLabel>Password</FormLabel>
                                    <InputGroup size="md">
                                        <Input onChange={(e) => { handleCredentials(e) }} name='password' rounded="md" type={show ? 'text' : 'password'} />
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
                                    <Checkbox colorScheme="green" size="md">
                                        I agree to T&C
                                    </Checkbox>
                                    <Link href='/login' textDecoration={'underline'}>Have an account??</Link>
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