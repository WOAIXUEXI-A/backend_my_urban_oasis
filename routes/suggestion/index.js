'use strict'

const DBUtils = require('../../utils/db-utils')
const {getDateString} = require('../../utils/date-utils');
const {askLLM} = require('../../utils/llm-api');
const db = DBUtils.getInstance({});

const BEFOREPROMPT = `
Please recommend the most suitable location among all the following based on today's weather information
`

const FORMATPROMPT = `
Return in the following JSON format:

{
  "place_id": "<place_id>",
  "title": "Visit KLCC Park for morning yoga or Lake Gardens for evening walks!",
  "reason": "<reason>",
  "what-to-do": ['Morning Yoga', 'Evening Walks'],
  "what-to-bring": ['Sunblock', 'Water Bottle', 'Sandals'],
}
Only return JSON formatted data, do not return any other content
`

module.exports = async function (fastify, opts) {
  fastify.get('/today', async function (request, reply) {
    const dateString = getDateString();

    // check cache
    const result = await db.query("select * from llm_suggestion where date =?", [dateString]);
    if (result.length > 0) {
      return result[0];
    }

    // if not found in cache
    // get weather info
    const weather_info = await fastify.inject({
      method: 'GET',
      url: '/weather/',
    });
    // get all green places
    const green_places = await fastify.inject({
      method: 'GET',
      url: '/greenspace/all',
    });

    // extract green (name, place_id)
    const green_place_list = JSON.parse(green_places.body).map(place => {
      return {
        name: place.name,
        place_id: place.place_id,
      }
    })

    // green_place_list to string
    const green_place_list_string = green_place_list.map(place => {
      return `${place.name}(${place.place_id})`
    }).join(', ')
    // weather_info to string
    const weather_info_string = weather_info.body;
    const prompt = BEFOREPROMPT + weather_info_string + '\n' + green_place_list_string + '\n' + FORMATPROMPT;

    // ask llm and parse response
    let try_count = 0;
    const MAX_TRY_COUNT = 2;
    let llm_gen = '';
    while (try_count < MAX_TRY_COUNT) {
      console.log(`try ${try_count}`);
      const llm_resp = await askLLM(prompt);
      llm_gen = llm_resp.choices[0].message.content;
      console.log(llm_gen)
      try {
        JSON.parse(llm_gen);
        break;
      } catch (e) {
        try_count++;
        console.error(e);
      }
    }

    // insert into db
    await db.query("insert into llm_suggestion (date, llm_suggestion) values (?, ?)", [dateString, llm_gen]);
    return llm_gen;
  })
}
