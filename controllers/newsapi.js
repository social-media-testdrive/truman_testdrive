const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const getNewsAPI = async (req, res) => {
    try {
        const currentDate = new Date();
        const toDate = currentDate.toISOString().split('T')[0];
        const priorDate = new Date(currentDate.setDate(currentDate.getDate() - 14));
        const fromDate = priorDate.toISOString().split('T')[0];

        let page = 1;
        let articles = [];
        let seenArticles = new Map();  // Use a Map to track titles and associated authors

        while (articles.length < 5) {
            const response = await axios.get('https://newsapi.org/v2/everything', {
                params: {
                    q: '(scam OR scammer OR scammed) AND (fake OR fraud OR pretending OR target OR conned OR swindle OR trick) AND (victim OR senior OR grandparent OR elderly OR adult) AND (experience OR story OR narrative OR interviewed OR told) NOT (political OR "foreign affairs" OR espionage OR treason OR election OR trump OR sex OR molestation OR porn OR "child abuse" OR cartel)',

                    // q: '(scam OR scammer) AND ($) AND (fake OR fraud OR pretending) AND (victim OR senior OR grandparent OR elderly OR "older adult") AND (experience OR story OR narrative) AND ("identity theft" OR Romance OR "tech support" OR investment OR medical OR phishing OR smishing OR email OR "phone call" OR crypto) NOT (political OR "foreign affairs" OR espionage OR treason OR election OR trump OR sex OR molestation OR porn OR "child abuse")',
                    // q: '(scam OR scammer) AND ($) AND (fake OR fraud OR pretending) AND (victim OR senior OR grandma OR grandparent OR grandpa OR grandmother OR grandfather OR elderly OR "older adult" OR "arrested for scam" OR "charged in scam" OR "ponzi scheme" OR "scam investigation" OR "senior scam") AND (experience OR story OR narrative) AND ("identity theft" OR Romance OR "tech support" OR investement OR medical OR phishing OR smishing OR email OR text OR "phone call" OR employment OR crypto OR cryptocurrency) NOT (political OR "foreign affairs" OR espionage OR treason OR election OR trump OR sex OR molestation OR porn OR "child abuse")',
                    sortBy: 'relevancy',
                    // sortBy: 'publishedAt',
                    apiKey: process.env.NEWS_APIKEY,
                    language: 'en',
                    from: fromDate,
                    to: toDate,
                    // pageSize: 20,
                    page,
                    // excludeDomains: 'foxnews.com'
                    // searchIn: 'title,content'
                    // country:'us'
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

            if (response.data.articles.length < 30) break;  // No more pages to fetch
            page++;
        }

        res.json(articles);
    } catch (error) {
        console.error('Error fetching news:', error);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = { getNewsAPI };
