// File: api/freemodels.js

import axios from 'axios';

export default async function handler(req, res) {
  const GROQ_API_KEY = "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";

  const prompt = req.query.prompt || "Hello, what's the latest free model?";
  const max_tokens = parseInt(req.query.max_tokens || "256");

  try {
    const modelListResponse = await axios.get('https://api.groq.com/openai/v1/models', {
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

    const freeModels = modelListResponse.data.data.filter(model =>
      freeModelKeywords.some(keyword => model.id.toLowerCase().includes(keyword))
    );

    if (freeModels.length === 0) {
      return res.status(404).json({ status: 'error', message: 'No free models available' });
    }

    const modelToUse = freeModels[0].id; // use the first matching free model

    const chatResponse = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
      model: modelToUse,
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: max_tokens
    }, {
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    res.status(200).json({
      status: 'success',
      model: modelToUse,
      prompt: prompt,
      response: chatResponse.data.choices[0].message.content
    });
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    res.status(500).json({ status: 'error', message: 'Failed to process request' });
  }
}
