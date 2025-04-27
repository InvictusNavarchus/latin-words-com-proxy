const axios = require('axios');

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', 'https://verbum-sapientia-lexicon.lovable.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Verify request method
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed. Only GET requests are supported.' });
  }

  // Verify request origin
  const origin = req.headers.origin;
  if (origin !== 'https://verbum-sapientia-lexicon.lovable.app') {
    return res.status(403).json({ error: 'Access Denied. Requests are only allowed from verbum-sapientia-lexicon.lovable.app' });
  }

  try {
    // Extract the query parameter
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }

    // Construct the URL for the Latin Words API
    const latinWordsUrl = `https://latin-words.com/cgi-bin/translate.cgi?query=${encodeURIComponent(query)}`;

    // Make request to the Latin Words API
    const response = await axios.get(latinWordsUrl);
    
    // Return the response from the Latin Words API
    return res.status(200).send(response.data);
  } catch (error) {
    console.error('Error proxying request:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch data from Latin Words API',
      message: error.message
    });
  }
};