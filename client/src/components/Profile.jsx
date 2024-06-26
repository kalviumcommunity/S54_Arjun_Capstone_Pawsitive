import { doc, getDoc, setDoc } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { db } from '../firebase/firebase';
import { Avatar, Box, Button, ButtonGroup, HStack, Icon, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, SimpleGrid, Text, Toast, Tooltip, VStack, useDisclosure, useToast } from '@chakra-ui/react';
import Navbar from './Navbar';
import { AuthContext } from '../context/AuthContext';
import { FiMessageSquare } from "react-icons/fi";
import { FaEdit } from "react-icons/fa";
import axios from 'axios';
import AdoptCard from './Adopt/AdoptCard';
import BlogCard from './Blog/BlogCard';
import { ChatContext } from '../context/ChatContext';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { updateProfile } from 'firebase/auth';

const Profile = () => {
  const { uid } = useParams();
  const [loading, setLoading] = useState(false);
  const { currentUser, setMob } = useContext(AuthContext);
  const [user, setUser] = useState({});
  const toast = useToast()
  const [own, setOwn] = useState(false);
  const [selectedSection, setSelectedSection] = useState('savedBlogs');
  const [savedBlogs, setSavedBlogs] = useState([]);
  const [favoritePets, setFavoritePets] = useState([]);
  const { dispatch } = useContext(ChatContext)
  const navigate = useNavigate()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const [newPhotoURL, setNewPhotoURL] = useState(null);
  const [newBio, setNewBio] = useState(user.bio || '');
  const [uploading, setUploading] = useState(false);

  const getUser = async () => {
    try {
      setLoading(true);
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const userData = docSnap.data();
        setUser(userData);
        setNewBio(userData.bio || '');
        setOwn(currentUser.uid === userData.uid);
        fetchSavedBlogs(userData.savedBlogs);
        fetchFavoritePets(userData.favPets);
      } else {
        console.log("No such document!");
        toast({
          title: 'Error',
          description: "Profile not found",
          status: 'error',
          position: 'top-right',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (err) {
      console.error("Error fetching user:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedBlogs = async (blogIds) => {
    try {
      if (blogIds && blogIds.length > 0) {
        const response = await axios.get('https://pawsitive-backend-seven.vercel.app/blog/blogs/saved', {
          params: { blogIds: blogIds.filter(id => id).join(',') }
        });
        setSavedBlogs(response.data);
      }
    } catch (error) {
      console.error('Error fetching saved blogs:', error);
    }
  };

  const fetchFavoritePets = async (petIds) => {
    try {
      if (petIds && petIds.length > 0) {
        const validPetIds = petIds.filter(id => id);
        if (validPetIds.length > 0) {
          const response = await axios.get('https://pawsitive-backend-seven.vercel.app/pet/pets/favorite', {
            params: { petIds: validPetIds.join(',') }
          });
          setFavoritePets(response.data);
        }
      }
    } catch (error) {
      console.error('Error fetching favorite pets:', error);
    }
  };

  useEffect(() => {
    getUser();
  }, [uid, currentUser]);

  const ContactPerson = async () => {
    const combinedId =
      currentUser.uid > user.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid;
    try {
      setLoading(true)
      // Check if the chat already exists
      const chatSnapshot = await getDoc(doc(db, "chats", combinedId));

      if (chatSnapshot.exists()) {
        // If the chat exists, dispatch its info to the chat context
        const chatInfo = {
          uid: user.uid,
          displayName: user.displayName,
          photoURL: user.photoURL,
        };
        dispatch({ type: "CHANGE_USER", payload: chatInfo });
        setMob(true)

      } else {
        // If the chat doesn't exist, create it and then dispatch its info
        await Promise.all([
          // Create the chat document
          setDoc(doc(db, "chats", combinedId), { messages: [] }),
          // Update userChats for current user
          updateDoc(doc(db, "userChats", currentUser.uid), {
            [combinedId]: {
              userInfo: {
                uid: user.uid,
                displayName: user.displayName,
                photoURL: user.photoURL,
              },
              date: serverTimestamp(),
            },
          }),
          // Update userChats for owner
          updateDoc(doc(db, "userChats", user.uid), {
            [combinedId]: {
              userInfo: {
                uid: currentUser.uid,
                displayName: currentUser.displayName,
                photoURL: currentUser.photoURL,
              },
              date: serverTimestamp(),
            },
          }),
        ]);

        // Dispatch the chat info
        const chatInfo = {
          uid: user.uid,
          displayName: user.displayName,
          photoURL: user.photoURL,
        };
        dispatch({ type: "CHANGE_USER", payload: chatInfo });
        setMob(true)
      }
      setLoading(false)
      navigate("/community");
    } catch (err) {
      console.log("Error contacting owner:", err);
      toast({
        title: 'Error',
        description: "There was an error in contacting this user. Please try again later.",
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
      setLoading(false)
    }
  };
  const handleFileUpload = async (file) => {
    const storage = getStorage();
    const storageRef = ref(storage, `profile_photos/${currentUser.uid}`);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      let updatedPhotoURL = user.photoURL;
      if (newPhotoURL) {
        updatedPhotoURL = await handleFileUpload(newPhotoURL);
      }

      const userRef = doc(db, "users", currentUser.uid);
      await setDoc(userRef, { photoURL: updatedPhotoURL, bio: newBio }, { merge: true });

      // Update Firebase Authentication profile
      await updateProfile(currentUser, { photoURL: updatedPhotoURL });

      setUser({ ...user, photoURL: updatedPhotoURL, bio: newBio });
      toast({
        title: 'Profile updated',
        description: "Your profile has been updated successfully.",
        status: 'success',
        duration: 4000,
        isClosable: true,
      });

      onClose();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: 'Error',
        description: "There was an error updating your profile. Please try again.",
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setUploading(false);
    }
  };


  return (
    <>
      <Navbar />
      {
        loading ? (
          <img id='loader-img' src='https://dogfood2mydoor.com/static/media/dog_load.3a3190f9.gif' alt="Loading" />
        ) : (
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
            <VStack width={'100%'}>
              {/* <Image src={user.photoURL} borderRadius={'50px'} alt="" w={{ base: '35vw', md: '12vw' }} /> */}
              <Avatar src={user.photoURL} size={'2xl'}></Avatar>
              <HStack ml={'1vw'}>
                <Text fontWeight={'600'} fontSize={'3xl'}>{user.displayName}</Text>
                {
                  own ? (
                    <Tooltip hasArrow placement='top' label='Edit profile' fontSize='md'>
                      <span>
                        <Icon as={FaEdit} mt={2} w={8} h={8} onClick={own && onOpen} cursor={'pointer'} />
                      </span>
                    </Tooltip>
                  ) : (
                    <Tooltip hasArrow placement='top' label='Contact user' fontSize='md'>
                      <span>
                        <Icon as={FiMessageSquare} w={8} h={8} onClick={!own && ContactPerson} cursor={'pointer'} />
                      </span>
                    </Tooltip>
                  )
                }
              </HStack>
              {user?.bio && (
                <Text>{user.bio}</Text>
              )}
              {/* {own && (
                <> */}
              <ButtonGroup variant="ghost" spacing="6" mt="4">
                <Button
                  borderRadius={selectedSection === 'savedBlogs' ? '10px 10px 0 0' : '10px'}
                  borderBottom={selectedSection === 'savedBlogs' ? 'solid 3px black' : 'none'}
                  fontSize={18}
                  onClick={() => setSelectedSection('savedBlogs')}
                >
                  Saved Blogs
                </Button>
                <Button
                  borderRadius={selectedSection === 'favoritePets' ? '10px 10px 0 0' : '10px'}
                  borderBottom={selectedSection === 'favoritePets' ? 'solid 3px black' : 'none'}
                  fontSize={18}
                  onClick={() => setSelectedSection('favoritePets')}
                >
                  Favorite Pets
                </Button>
              </ButtonGroup>
              <Box mt="8" w="full">
                {selectedSection === 'savedBlogs' && (
                  savedBlogs.length === 0 ? (
                    <Text textAlign={'center'}>No saved blogs available.</Text>
                  ) : (
                    <SimpleGrid columns={{ base: 1, sm: 2, md: 2, lg: 3 }} spacing="2vw" p={{ base: "4vw", md: "3vw 9vw" }}>
                      {savedBlogs.map((blog) => (
                        <BlogCard key={blog._id} blog={blog} />
                      ))}
                    </SimpleGrid>
                  )
                )}
                {selectedSection === 'favoritePets' && (
                  favoritePets.length === 0 ? (
                    <Text textAlign={'center'}>No favorite pets available.</Text>
                  ) : (
                    <SimpleGrid
                      columns={{ base: 1, sm: 2, md: 4 }}
                      spacing={{ base: 2, md: 4 }}
                      padding="1vw"
                      mt={4}
                      mx="auto"
                      maxW={{ base: '100%', md: '90%' }}
                      pl={{ base: 0, md: 8 }}
                    >
                      {favoritePets.map((pet) => (
                        <AdoptCard key={pet._id} pet={pet} />
                      ))}
                    </SimpleGrid>
                  )
                )}
              </Box>
              {/* </>
              )} */}
            </VStack>
            <Modal isOpen={isOpen} onClose={onClose} isCentered>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Edit Profile</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <form onSubmit={handleSubmit}>
                    <VStack spacing={6} align="stretch">
                      <Box>
                        <Text mb={2} fontSize="sm" fontWeight="medium">Profile Photo</Text>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => setNewPhotoURL(e.target.files[0])}
                          style={{ display: 'block', marginTop: '8px' }}
                        />
                      </Box>
                      <Box>
                        <Text mb={2} fontSize="sm" fontWeight="medium">Bio</Text>
                        <textarea
                          placeholder="Enter new bio"
                          value={newBio}
                          onChange={(e) => setNewBio(e.target.value)}
                          rows={3}
                          style={{
                            width: '100%',
                            padding: '8px',
                            borderRadius: '4px',
                            borderColor: '#E2E8F0',
                            borderWidth: '1px',
                            resize: 'none'
                          }}
                        />
                        {newBio.length > 200 && (
                          <Text color="red.500" fontSize="sm">Bio must be 200 characters or less.</Text>
                        )}
                      </Box>
                      <Button
                        type="submit"
                        colorScheme="blue"
                        isLoading={uploading}
                        width="100%"
                        mt={4}
                        isDisabled={newBio.length > 200}
                      >
                        Save Changes
                      </Button>
                    </VStack>
                  </form>
                </ModalBody>
              </ModalContent>
            </Modal>
          </div>
        )
      }
    </>
  );
};

export default Profile;
