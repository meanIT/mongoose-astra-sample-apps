'use strict';

const axios = require('axios');
const fs = require('fs');

module.exports = async function getPhotoEmbedding(fileName) {
  const filePath = './public/uploads/' + fileName;

  const response = await axios.post(
    'https://api-atlas.nomic.ai/v1/embedding/image',
    {
      model: 'nomic-embed-vision-v1.5',
      images: fs.createReadStream(filePath)
    },
    {
    headers: {
      'Authorization': `Bearer ${process.env.NOMIC_API_KEY}`,
      'Content-Type': 'multipart/form-data'
    }
  });

  return response.data.embeddings[0];
};
