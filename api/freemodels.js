// File: api/freemodels.js

import axios from 'axios';

export default async function handler(req, res) {
  const GROQ_API_KEY = "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";

  try {
    const response = await axios.get('https://api.groq.com/openai/v1/models', {
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
    });

    const freeModelKeywords = [
      'llama-3',
      'gemma',
      'mixtral',
      'llava',
      'distil-whisper',
      'qwen-qwq'
    ];

    const freeModels = response.data.data.filter(model =>
      freeModelKeywords.some(keyword => model.id.toLowerCase().includes(keyword))
    );

    res.status(200).json({
      status: 'success',
      models: freeModels.map(model => model.id),
    });
  } catch (error) {
    console.error('Error fetching models:', error.response?.data || error.message);
    res.status(500).json({ status: 'error', message: 'Failed to fetch models' });
  }
}
