import app from './app.js';

const port = 5000;

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

export default app; // Export app for testing
