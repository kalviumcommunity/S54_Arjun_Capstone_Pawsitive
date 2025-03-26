import React, { useContext, useEffect, useState } from 'react';
import { Button, Input, Select, Text, Textarea, VStack, Progress, Box, Image, CloseButton, FormLabel, Flex, StepSeparator, StepDescription, StepTitle, StepNumber, StepIcon, Step, Stepper, useSteps, StepIndicator, StepStatus } from '@chakra-ui/react';
import axios from 'axios';
import Navbar from '../Navbar';
import { useNavigate } from 'react-router-dom';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from '../../firebase/firebase';
import { AuthContext } from '../../context/AuthContext';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import AddressAutocomplete from '../../sub-components/AutoAddress';

const steps = [
  { title: 'First', description: 'Contact Info' },
  { title: 'Second', description: 'Date & Time' },
  { title: 'Third', description: 'Select Rooms' },
]

const PostPet = () => {
  const navigate = useNavigate();
  const totalSteps = 3;
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    species: '',
    breed: '',
    age: '',
    gender: '',
    contact:"",
    weight: '',
    location: '',
    adoptionFee: '',
    additionalInfo: '',
    photos: [],
    ageUnit: 'years',
    createdBy: ''
  });
  const [imagePreviews, setImagePreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const { currentUser } = useContext(AuthContext);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    setProgress((step) / totalSteps * 100);
  }, [step]);

  useEffect(() => {
    setFormData({ ...formData, createdBy: currentUser.uid });
  }, [currentUser]);

  const handleNext = () => {
    if (validateFormData()) {
      if (step < totalSteps) {
        setStep(step + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handleSelectAgeUnit = (e) => {
    const { value } = e.target;
    setFormData({ ...formData, ageUnit: value });
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      setUploading(true);
      const photoURLs = await Promise.all(formData.photos.map(uploadPhoto));
      const updatedFormData = { ...formData, photos: photoURLs };
      console.log("updatedFormData: ", updatedFormData);
      const res = await axios.post(`${import.meta.env.VITE_backendURL}/pet/`, updatedFormData);
      console.log("res: ", res);

      if (res.status === 201) {
        navigate('/adopt');
      } else {
        console.error('Error:', res);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const validateFormData = () => {
    switch (step) {
      case 1:
        return formData.name && formData.species && formData.breed;
      case 2:
        return formData.gender && formData.weight && formData.age && formData.contact.length==10;
      case 3:
        return formData.location && formData.adoptionFee && formData.additionalInfo;
      default:
        return false;
    }
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files)
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...previews]);
    setFormData({ ...formData, photos: [...formData.photos, ...files] });
  };

  const handlePhotoDelete = (index) => {
    const updatedPreviews = [...imagePreviews];
    updatedPreviews.splice(index, 1);
    setImagePreviews(updatedPreviews);

    const updatedPhotos = [...formData.photos];
    updatedPhotos.splice(index, 1);
    setFormData({ ...formData, photos: updatedPhotos });
  };

  const uploadPhoto = async (file) => {
    const storageRef = ref(storage, file.name);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        null,
        (error) => reject(error),
        () => {
          getDownloadURL(uploadTask.snapshot.ref)
            .then((downloadURL) => resolve(downloadURL))
            .catch((error) => reject(error));
        }
      );
    });
  };

  const { activeStep } = useSteps({
    index: 1,
    count: steps.length,
  })

  const isNextDisabled = !validateFormData() || uploading;



  return (
    <>
      <Navbar />
      <VStack spacing={{ base: 7, md: 9 }} width={{ base: "90vw", md: "30vw" }} position={"relative"} left={{ base: "5vw", md: "35vw" }} top={"3vw"} borderWidth="1px" borderRadius="30px" overflow="hidden" boxShadow="lg" bg="white" p={4}>
        <Text fontSize="2xl" fontWeight="bold">Post a Pet for Adoption - Step {step}</Text>
        <Progress value={progress} w="80%" />
        <form onSubmit={(e) => e.preventDefault()} style={{ width: '90%' }}>
          {step === 1 && (
            <div style={{ flexDirection: "column", gap: 8 }}>
              <FormLabel>Images of the Pet</FormLabel>
              <Input padding={"0.3vw 2vw"} name="photos" type="file" accept="image/*" multiple onChange={handlePhotoUpload} />
              <Box display="flex" flexWrap="wrap" mt={2}>
                {imagePreviews.map((preview, index) => (
                  <Box key={index} position="relative" mr={2} mb={2}>
                    <Image src={preview} alt={`Preview ${index}`} boxSize="60px" />
                    <CloseButton color={"white"} position="absolute" top={0} right={0} onClick={() => handlePhotoDelete(index)} />
                  </Box>
                ))}
              </Box>
              <FormLabel>Name</FormLabel>
              <Input name="name" value={formData.name} onChange={handleInputChange} placeholder="Enter pet's name" />
              <FormLabel>Species</FormLabel>
              <Input name="species" value={formData.species} onChange={handleInputChange} placeholder="Enter species (e.g., dog, cat)" />
              <FormLabel>Breed</FormLabel>
              <Input name="breed" value={formData.breed} onChange={handleInputChange} placeholder="Enter breed (if applicable)" />
            </div>
          )}
          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <FormLabel>Gender</FormLabel>
              <Select name="gender" value={formData.gender} onChange={handleInputChange} placeholder="Select Gender">
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </Select>
              <FormLabel>Weight (kg)</FormLabel>
              <Input name="weight" value={formData.weight} onChange={handleInputChange} placeholder="Enter weight" type="number" />
              <FormLabel>Age</FormLabel>
              <Flex alignItems="center">
                <Input name="age" value={formData.age} onChange={handleInputChange} placeholder="Enter age" type="number" mr={2} />
                <Select name="ageUnit" value={formData.ageUnit} onChange={handleSelectAgeUnit}>
                  <option value="years">Years</option>
                  <option value="months">Months</option>
                  <option value="weeks">Weeks</option>
                </Select>
              </Flex>
              <FormLabel>Contact number</FormLabel>
              <Input name="contact" value={formData.contact} onChange={handleInputChange} placeholder="Enter your phone number" type="number" />
            </div>
          )}
          {step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <FormLabel>Location</FormLabel>
              <AddressAutocomplete onSelect={(selectedAddress) => setFormData({ ...formData, location: selectedAddress.name })} />
              <FormLabel>Adoption Fee (₹)</FormLabel>
              <Input name="adoptionFee" value={formData.adoptionFee} onChange={handleInputChange} placeholder="Enter adoption fee" type="number" />
              <FormLabel>Additional Info</FormLabel>
              <Textarea name="additionalInfo" value={formData.additionalInfo} onChange={handleInputChange} placeholder="Enter additional info" />
              <Text fontSize="md" color="red.500" fontWeight={"600"} mt={2}>
                *Incorrect or Inappropriate content may result in account suspension*
              </Text>
            </div>
          )}
          {step !== 1 &&
            <Button leftIcon={<ChevronLeftIcon w={6} h={6} />} onClick={handleBack} colorScheme="blue" mt={4} variant={"outline"}>
              Back
            </Button>
          }
          <Button rightIcon={<ChevronRightIcon w={6} h={6} />} type="button" onClick={step==totalSteps? handleSubmit : handleNext} colorScheme="blue" mt={4} ml={2} disabled={isNextDisabled} variant={isNextDisabled ? "outline" : "solid"}>
            {uploading ? 'Uploading...' : (step === totalSteps ? 'Post Pet' : 'Next')} 
          </Button>
        </form>
      </VStack>
    </>
  );
};

export default PostPet;
