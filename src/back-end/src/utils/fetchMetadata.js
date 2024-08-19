import axios from 'axios';
import cheerio from 'cheerio';

const fetchMetadata = async (url) => {
    try {
        const response = await axios.get(url);
        const html = response.data;
        const $ = cheerio.load(html);

        const title = $('head title').text();
        const description = $('meta[name="description"]').attr('content') || '';
        const image = $('meta[property="og:image"]').attr('content') || '';

        return { title, description, image };
    } catch (error) {
        throw new Error(`Failed to fetch metadata for ${url}: ${error.message}`);
    }
};

export default fetchMetadata;
