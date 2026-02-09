const axios = require('axios');
const News = require('../models/News');

// News API configuration - using free APIs
const NEWS_APIS = {
  newsapi: {
    baseUrl: 'https://newsapi.org/v2',
    endpoints: {
      business: '/everything?q=finance+stocks+market&language=en&sortBy=publishedAt&pageSize=20',
      crypto: '/everything?q=cryptocurrency+bitcoin&language=en&sortBy=publishedAt&pageSize=10'
    }
  },
  // Alternative: Finnhub (financial data)
  finnhub: {
    baseUrl: 'https://finnhub.io/api/v1',
    endpoints: {
      news: '/news?category=general&minID=0'
    }
  }
};

/**
 * Fetch news from external API and store in database
 * Uses NewsAPI.org as primary source (requires free API key)
 */
async function fetchExternalNews() {
  try {
    const apiKey = process.env.NEWS_API_KEY;
    
    if (!apiKey) {
      console.warn('NEWS_API_KEY not set. Skipping external news fetch. Get free key from https://newsapi.org');
      return [];
    }

    const newsArticles = [];
    
    // Fetch business/finance news
    try {
      const businessUrl = `${NEWS_APIS.newsapi.baseUrl}${NEWS_APIS.newsapi.endpoints.business}&apiKey=${apiKey}`;
      const response = await axios.get(businessUrl, { timeout: 10000 });
      
      if (response.data.articles) {
        response.data.articles.forEach(article => {
          newsArticles.push({
            title: article.title,
            description: article.description || article.content || 'No description available',
            content: article.content,
            source: article.source.name,
            category: 'market',
            imageUrl: article.urlToImage,
            articleUrl: article.url,
            publishedAt: new Date(article.publishedAt)
          });
        });
      }
    } catch (err) {
      console.error('Error fetching business news:', err.message);
    }

    // Fetch crypto news
    try {
      const cryptoUrl = `${NEWS_APIS.newsapi.baseUrl}${NEWS_APIS.newsapi.endpoints.crypto}&apiKey=${apiKey}`;
      const response = await axios.get(cryptoUrl, { timeout: 10000 });
      
      if (response.data.articles) {
        response.data.articles.forEach(article => {
          newsArticles.push({
            title: article.title,
            description: article.description || article.content || 'No description available',
            content: article.content,
            source: article.source.name,
            category: 'crypto',
            imageUrl: article.urlToImage,
            articleUrl: article.url,
            publishedAt: new Date(article.publishedAt)
          });
        });
      }
    } catch (err) {
      console.error('Error fetching crypto news:', err.message);
    }

    // Store unique news in database
    if (newsArticles.length > 0) {
      for (const article of newsArticles) {
        try {
          // Check if news already exists
          const exists = await News.findOne({ articleUrl: article.articleUrl });
          if (!exists) {
            await News.create(article);
          }
        } catch (err) {
          console.error('Error storing news article:', err.message);
        }
      }
      console.log(`Successfully fetched and stored ${newsArticles.length} news articles`);
    }

    return newsArticles;
  } catch (error) {
    console.error('Error in fetchExternalNews:', error.message);
    return [];
  }
}

/**
 * Add mock/sample news for development
 */
async function addSampleNews() {
  try {
    const sampleNews = [
      {
        title: 'Stock Market Reaches New Highs',
        description: 'Global stock markets continue upward trend with strong earnings reports',
        source: 'Financial Times',
        category: 'market',
        articleUrl: 'https://example.com/news/1',
        publishedAt: new Date()
      },
      {
        title: 'Bitcoin Surges Amid Institutional Adoption',
        description: 'Major institutions increase cryptocurrency holdings',
        source: 'CoinDesk',
        category: 'crypto',
        articleUrl: 'https://example.com/news/2',
        publishedAt: new Date()
      },
      {
        title: 'Interest Rates May Rise Further',
        description: 'Fed signals potential rate increases to combat inflation',
        source: 'Reuters',
        category: 'economy',
        articleUrl: 'https://example.com/news/3',
        publishedAt: new Date()
      }
    ];

    for (const news of sampleNews) {
      const exists = await News.findOne({ articleUrl: news.articleUrl });
      if (!exists) {
        await News.create(news);
      }
    }

    console.log('Sample news added successfully');
  } catch (error) {
    console.error('Error adding sample news:', error.message);
  }
}

/**
 * Set up automatic news updates at regular intervals
 */
function setupAutomaticNewsUpdates(intervalMinutes = 60) {
  // Fetch news on startup
  fetchExternalNews();

  // Set up recurring updates
  const intervalMs = intervalMinutes * 60 * 1000;
  setInterval(async () => {
    console.log(`[${new Date().toISOString()}] Running automatic news update...`);
    await fetchExternalNews();
  }, intervalMs);

  console.log(`Automatic news updates configured to run every ${intervalMinutes} minutes`);
}

module.exports = {
  fetchExternalNews,
  addSampleNews,
  setupAutomaticNewsUpdates
};
