const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const getNewsAPI = async (req, res) => {
    try {
        const currentDate = new Date();
        const toDate = currentDate.toISOString().split('T')[0];
        const priorDate = new Date(currentDate.setDate(currentDate.getDate() - 7));
        const fromDate = priorDate.toISOString().split('T')[0];

        let page = 1;
        let articles = [];
        let seenArticles = new Map();  // Use a Map to track titles and associated authors

        while (articles.length < 5) {
            const response = await axios.get('https://newsapi.org/v2/everything', {
                params: {
                    q: '"scam" AND (fraud OR victim OR arrested OR charged OR scheme OR investigation OR senior) AND (experience OR story OR narrative) NOT political',
                    sortBy: 'publishedAt',
                    apiKey: process.env.NEWS_APIKEY,
                    language: 'en',
                    from: fromDate,
                    to: toDate,
                    pageSize: 100,
                    page
                }
            });

            for (const article of response.data.articles) {
                if (!article.title || article.title.includes("[Removed]") || !article.author) {
                    continue;
                }

                if (seenArticles.has(article.title)) {
                    let authorsList = seenArticles.get(article.title);
                    let isDuplicate = authorsList.some(existingAuthor => 
                        article.author.includes(existingAuthor) || existingAuthor.includes(article.author)
                    );

                    if (isDuplicate) {
                        continue;
                    }

                    authorsList.push(article.author);  // Add new author to the list for this title
                } else {
                    seenArticles.set(article.title, [article.author]);
                    articles.push(article);  // Only push if it's a new title
                }

                if (articles.length === 5) break;
            }

            if (response.data.articles.length < 100) break;  // No more pages to fetch
            page++;
        }

        res.json(articles);
    } catch (error) {
        console.error('Error fetching news:', error);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = { getNewsAPI };
