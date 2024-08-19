import fetchMetadata from '../utils/fetchMetadata.js'; // Import fetchMetadata
import xss from 'xss'; // Import xss for sanitization

const getMetadata = async (req, res) => {
    let { urls } = req.body;

    // Sanitize URLs
    urls = urls.map(url => xss(url));

    if (!Array.isArray(urls) || urls.length === 0) {
        return res.status(400).json({ error: 'Invalid request. URLs should be an array of strings.' });
    }

    const metadataPromises = urls.map(async (url) => {
        try {
            return await fetchMetadata(url);
        } catch (error) {
            return { url, error: error.message };
        }
    });

    try {
        const metadata = await Promise.all(metadataPromises);
        res.json(metadata);
    } catch (error) {
        console.error('Error in getMetadata function:', error.message);
        res.status(500).json({ error: 'Failed to fetch metadata.' });
    }
};

export { getMetadata };
