// add test case for askLLM
const { test } = require('node:test')
const assert = require('node:assert')
const { askLLM } = require('../../utils/llm-api');

test('askLLM returns a string', async () => {
  const prompt = '1+1=?';
  const response = await askLLM(prompt);
  console.log(response.choices[0].message.content)
})