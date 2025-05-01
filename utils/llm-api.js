require('dotenv').config();

function askLLM(prompt) {
  const apiKey = process.env.LLM_API_KEY || 'your_api_key_here';

  body = {
    "model": "Qwen/QwQ-32B",
    "messages": [
      {
        "role": "user",
        "content": prompt
      }
    ],
    "stream": false,
    "max_tokens": 512,
    "stop": null,
    "temperature": 0.7,
    "top_p": 0.7,
    "top_k": 50,
    "frequency_penalty": 0.5,
    "n": 1,
    "response_format": {
      "type": "text"
    },
    "tools": [
      {
        "type": "function",
        "function": {
          "description": "<string>",
          "name": "<string>",
          "parameters": {},
          "strict": false
        }
      }
    ]
  }
  
  const options = {
    method: 'POST',
    headers: {Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json'},
    body: JSON.stringify(body)
  };
  
  return fetch('https://api.siliconflow.cn/v1/chat/completions', options)
    .then(response => response.json())
    .catch(err => {
      console.error(err);
      throw err;
    });
}

module.exports = { askLLM };