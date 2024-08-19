import React, { useState, useEffect } from 'react';
import URLInputForm from './components/URLInputForm';
import MetadataDisplay from './components/MetadataDisplay';
import config from './config';
import './styles/App.css';

const App = () => {
  const [metadata, setMetadata] = useState([]); // State to store fetched metadata
  const [error, setError] = useState(null);
  const [csrfToken, setCsrfToken] = useState(''); // State to store CSRF token

  // Fetch CSRF token when the component mounts
  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await fetch(config.buildUrl(config.csrfTokenPath), {
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch CSRF token');
        }

        const data = await response.json();
        setCsrfToken(data.csrfToken); // Set CSRF token in state
      } catch (err) {
        console.error('Failed to fetch CSRF token:', err.message);
      }
    };

    fetchCsrfToken();
  }, []);

  // Handle form submission, fetch metadata for provided URLs
  const handleFormSubmit = async (urls) => {
    try {
      const response = await fetch(config.buildUrl(config.fetchMetadataPath), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken, // Include CSRF token in the request headers
        },
        body: JSON.stringify({ urls }), // Send URLs in the request body
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      handleMetadataFetch(data); // Update metadata state with fetched data
    } catch (err) {
      handleMetadataFetch([], err.message);
    }
  };

  // Update metadata and error states based on fetch results
  const handleMetadataFetch = (fetchedMetadata, error = null) => {
    if (error) {
      setError(error);
      setMetadata([]); // Clear metadata if an error occurred
    } else {
      setMetadata(fetchedMetadata); // Set fetched metadata
      setError(null); // Clear any existing error
    }
  };

  return (
    <div className="App">
      <h1>URL Metadata Fetcher</h1>
      <URLInputForm onSubmit={handleFormSubmit} /> {/* Form to submit URLs */}
      {error ? <p>Error: {error}</p> : <MetadataDisplay metadata={metadata} />} {/* Display metadata or error */}
    </div>
  );
};

export default App;  
