import express from 'express';
import fetch from 'node-fetch';
import { parse } from 'node-html-parser';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import xss from 'xss';
import csrf from 'csurf';
import cookieParser from 'cookie-parser';

const app = express();
const isTestEnv = process.env.NODE_ENV === 'test';

// Rate limiting configuration for /fetch-metadata route
const metadataLimiter = rateLimit({
    windowMs: 1000, // 1 second window
    max: 5, // Limit each IP to 5 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
});

// CSRF protection setup
const csrfProtection = csrf({ cookie: true });

// Middleware setup
app.use(cookieParser());
app.use(express.json());
const allowedOrigins = [
    'https://url-metadata-fetcher-3441.vercel.app',
    'http://localhost:3000' // Add other local origins if needed
];

app.use(cors({
    origin: function (origin, callback) {
        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));


// Apply CSRF protection conditionally
const applyCsrfProtection = isTestEnv ? (req, res, next) => next() : csrfProtection;

// Apply rate limiting and CSRF protection to only the /fetch-metadata route
app.post('/fetch-metadata', applyCsrfProtection, metadataLimiter, async (req, res) => {
    const { urls } = req.body;

    // Sanitize URLs
    const sanitizedUrls = urls.map(url => xss(url));

    if (!Array.isArray(sanitizedUrls) || sanitizedUrls.length === 0) {
        return res.status(400).json({ error: 'No URLs provided' });
    }

    const metadataPromises = sanitizedUrls.map(async (url) => {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Failed to fetch ${url} - Status: ${response.status}`);
            }
            const data = await response.text();
            const root = parse(data);

            return {
                url,
                title: root.querySelector('title')?.text || 'No title available',
                description: root.querySelector('meta[name="description"]')?.getAttribute('content') || 'No description available',
                image: root.querySelector('meta[property="og:image"]')?.getAttribute('content') || 'https://via.placeholder.com/150',
            };
        } catch (urlError) {
            console.error(`Error fetching data from ${url}:`, urlError.message);
            return {
                url,
                title: 'Error',
                description: 'Failed to fetch metadata',
                image: 'https://via.placeholder.com/150',
                error: urlError.message,
            };
        }
    });

    try {
        const metadata = await Promise.all(metadataPromises);
        res.json(metadata);
    } catch (error) {
        console.error('Error in /fetch-metadata route:', error.message);
        res.status(500).json({ error: 'Error fetching metadata' });
    }
});

// Route to get CSRF token
app.get('/csrf-token', csrfProtection, (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
});

export default app;
