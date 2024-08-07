import { useContext, useState } from 'react';
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
import { auth } from '../firebase/firebase.js';
import {
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    signInWithPopup,
    GoogleAuthProvider,
    signInWithRedirect,
    onAuthStateChanged
} from "firebase/auth";
import GoogleButton from 'react-google-button';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';

const Login = () => {
    const [show, setShow] = useState(false);
    const handleClick = () => setShow(!show);
    const [userCredentials, setUserCredentials] = useState({});
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const {setCurrentUser,setSignin}=useContext(AuthContext)

    onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log(user)
            setCurrentUser(user)
            setSignin(true)
            localStorage.setItem('photoURL',user.photoURL)
            localStorage.setItem('signin',true)
            navigate("/");
        } else {
            console.log('err')
        }
    })

    function handleCredentials(e) {
        setUserCredentials({ ...userCredentials, [e.target.name]: e.target.value });
    }

    function handleLogin(e) {
        e.preventDefault();
        setError("");
        signInWithEmailAndPassword(auth, userCredentials.email, userCredentials.password)
            .then((userCredential) => {
                console.log(userCredential);
            })
            .catch((error) => {
                setError(error.message);
            });
    }

    const googleSignIn = () => {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
    };
    const handleGoogleSignIn = async () => {
        try {
            googleSignIn();
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
                            <Heading fontSize="2xl">Sign in</Heading>
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
                                    <Input onChange={(e) => { handleCredentials(e) }} rounded="md" type="email" name='email' inputMode='email'/>
                                </FormControl>
                                <FormControl id="password">
                                    <FormLabel>Password</FormLabel>
                                    <InputGroup size="md">
                                        <Input onChange={(e) => { handleCredentials(e) }} name='password' rounded="md" type={show ? 'text' : 'password'}/>
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
                            {error && <p style={{color:"red"}} >{error}</p>}
                            <VStack w="100%">
                                <Stack w="100%" mb={4}>
                                    <Text fontSize={'md'}>
                                        Dont have an account ??  
                                        <Link onClick={()=>navigate("/signup")} fontSize={'md'} color={'blue'}>  Signup</Link>
                                    </Text>
                                </Stack>
                                <Button
                                    onClick={(e) => { handleLogin(e) }}
                                    bg="green.300"
                                    color="white"
                                    _hover={{
                                        bg: 'green.500'
                                    }}
                                    rounded="md"
                                    w="100%"
                                >
                                    Sign in
                                </Button>

                                

                                <Text size={'2xl'} my={2}>----------------- OR -----------------</Text>
                                <GoogleButton onClick={handleGoogleSignIn} />

                            </VStack>
                        </VStack>
                    </Stack>
                </Center>
            </Container>
        </div >
    );
};

export default Login;