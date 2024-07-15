const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const getNewsAPI = async (req, res) => {
    try {
        // Get the current date
        const currentDate = new Date();
        // Format the current date as ISO 8601
        const toDate = currentDate.toISOString().split('T')[0];

        // Get the date 7 days prior to the current date
        const priorDate = new Date(currentDate);
        priorDate.setDate(priorDate.getDate() - 7);
        // Format the prior date as ISO 8601
        const fromDate = priorDate.toISOString().split('T')[0];

        const response = await axios.get('https://newsapi.org/v2/everything', {
            params: {
                q: '"scam" AND (fraud OR victim OR arrested OR charged OR scheme OR investigation OR senior) NOT political',
                sortBy: 'publishedAt',
                apiKey: process.env.NEWS_APIKEY,
                language: 'en',
                from: fromDate,
                to: toDate,
                pageSize: 1
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error('Error fetching news:', error);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = { getNewsAPI };
