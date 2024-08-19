const apiBaseUrl = process.env.REACT_APP_SERVER_URL || 'http://localhost:5000';
const fetchMetadataPath = process.env.REACT_APP_FETCH_METADATA_PATH || '/fetch-metadata';
const csrfTokenPath = process.env.REACT_APP_CSRF_TOKEN_PATH || '/csrf-token';

// Concatenate base URL and paths
const buildUrl = (path) => `${apiBaseUrl}${path}`;

export default {
    apiBaseUrl,
    fetchMetadataPath,
    csrfTokenPath,
    buildUrl: (path) => buildUrl(path), // Re-use the buildUrl function
};
