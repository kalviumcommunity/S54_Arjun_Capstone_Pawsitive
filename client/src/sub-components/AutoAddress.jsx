import React, { useState } from 'react';
import axios from 'axios';

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
    setQuery('');
    setSuggestions([]);
    onSelect(selectedSuggestion);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter your address"
        value={query}
        onChange={handleInputChange}
      />
      <ul>
        {suggestions.map((suggestion) => (
          <li key={suggestion.id} onClick={() => handleSelectSuggestion(suggestion)}>
            {suggestion.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AddressAutocomplete;
