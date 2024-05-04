import React, { useState } from 'react';
import axios from 'axios';
import { Input, Stack, Box, Text, Icon } from '@chakra-ui/react';
import { FaMapMarkerAlt } from 'react-icons/fa';

const AddressAutocomplete = ({ onSelect }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const handleInputChange = async (e) => {
    const inputValue = e.target.value;
    setQuery(inputValue);

    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?q=${inputValue}&format=json`
      );

      const extractedSuggestions = response.data.map((result) => ({
        id: result.place_id,
        name: result.display_name,
      }));

      setSuggestions(extractedSuggestions); 
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  const handleSelectSuggestion = (selectedSuggestion) => {
    setQuery(selectedSuggestion.name);
    setSuggestions([]);
    onSelect(selectedSuggestion);
  };

  return (
    <Stack spacing={4}>
      <Box position="relative">
        <Input
          type="text"
          placeholder="Enter your address"
          value={query}
          onChange={handleInputChange}
        />
        {suggestions.length > 0 && (
          <Box
            position="absolute"
            width="100%"
            zIndex="1"
            top="calc(100% + 4px)"
            left="0"
            bg="white"
            border="1px solid #E2E8F0"
            borderRadius="md"
            boxShadow="md"
            maxHeight="190px"
            overflowY="auto" 
          >
            <Box>
              {suggestions.map((suggestion) => (
                <Box
                  key={suggestion.id}
                  p={2}
                  borderBottom="1px solid #E2E8F0"
                  _last={{ borderBottom: 'none' }}
                  _hover={{ bg: 'gray.100', cursor: 'pointer' }}
                  onClick={() => handleSelectSuggestion(suggestion)}
                  display="flex"
                  alignItems="center"
                >
                  <Icon as={FaMapMarkerAlt} color="gray.500" mr={2} />
                  <Text>{suggestion.name}</Text>
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </Box>
    </Stack>
  );
};

export default AddressAutocomplete;
