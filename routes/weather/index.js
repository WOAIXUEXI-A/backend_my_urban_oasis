'use strict'
const DBUtils = require('../../utils/db-utils');
const {getDateString} = require('../../utils/date-utils');
const db = DBUtils.getInstance({});
const axios = require('axios');

function getWeather() {
  return new Promise((resolve, reject) => {
    const options = {
      method: 'GET',
      url: `https://weather.googleapis.com/v1/currentConditions:lookup?key=${process.env.WEATHER_API_KEY}&location.latitude=${process.env.WEATHER_LOCATION_LATITUDE}&location.longitude=${process.env.WEATHER_LOCATION_LONGITUDE}&unitsSystem=IMPERIAL`,
    };

    axios.request(options)
      .then(function (response) {
        resolve(response.data);
      })
      .catch(function (error) {
        console.error(error);
        reject(error);
      });
  });
}

module.exports = async function (fastify, opts) {
  fastify.get('/', async function (request, reply) {
    // get date string
    const dateString = getDateString();
    // check cache
    let weather;
    const result = await db.query("select * from weather_info where date = ?", [dateString]);

    if (result.length > 0) {
      weather = result[0];
    } else {
      // if not, query from google weather api
      weather = await getWeather(dateString);
      // insert into database
      await db.execute("insert into weather_info (date, weather_info) values (?, ?)", [dateString, weather]);
    }
    return weather
  })
}
