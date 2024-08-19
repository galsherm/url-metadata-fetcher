import React, { useState } from 'react';

const URLInputForm = ({ onSubmit }) => {
    const MAX_URLS = 20;
    const MIN_VALID_URLS = 3;

    const [urls, setUrls] = useState(Array(MIN_VALID_URLS).fill("")); // Initialize with minimum valid URLs
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false); // Track submission state

    // Handle changes in individual input fields
    const handleChange = (index, value) => {
        const newUrls = [...urls];
        newUrls[index] = value;
        setUrls(newUrls);
    };

    // Add a new URL input field
    const addUrlField = () => {
        if (urls.length >= MAX_URLS) {
            alert(`You have reached the maximum limit of ${MAX_URLS} URLs.`);
            return;
        }
        setUrls([...urls, ""]);
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        const validUrls = urls.filter(url => isValidUrl(url));
        const allValid = urls.every(url => isValidUrl(url));

        if (validUrls.length < MIN_VALID_URLS) {
            alert(`Please enter at least ${MIN_VALID_URLS} valid URLs.`);
        } else if (!allValid) {
            alert("Please enter valid URLs.");
        } else {
            await submitUrls(validUrls);
        }
    };

    // Submit valid URLs to the server
    const submitUrls = async (validUrls) => {
        setIsSubmitting(true);
        setError(null); // Reset any previous errors

        try {
            await onSubmit(validUrls); // Assuming onSubmit returns a Promise
            alert('URLs submitted successfully!');
        } catch (err) {
            console.error('Submission error:', err);
            setError('An error occurred while submitting the URLs. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Validate URL format
    const isValidUrl = (url) => {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {urls.map((url, index) => (
                <div key={index}>
                    <input
                        type="text"
                        value={url}
                        onChange={(e) => handleChange(index, e.target.value)}
                        placeholder="Enter URL"
                    />
                </div>
            ))}
            <button type="button" onClick={addUrlField}>Add Another URL</button>
            <button type="submit" disabled={isSubmitting}>Submit</button>
            {error && <p className="error">{error}</p>} {/* Display error message if any */}
        </form>
    );
};

export default URLInputForm;
