'use strict';

const axios = require('axios');

module.exports = async function createPhotoEmbedding(photoDescription) {
  const response = await axios.post(
    'https://api-atlas.nomic.ai/v1/embedding/text',
    {
      model: 'nomic-embed-text-v1',
      texts: [photoDescription],
      task_type: 'search_document',
      dimensionality: 768
    },
    {
      headers: {
        'Authorization': `Bearer ${process.env.NOMIC_API_KEY}`
      }
    }
  );
  return response.data.embeddings[0];
};
