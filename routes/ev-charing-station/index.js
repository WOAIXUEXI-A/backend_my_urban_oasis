'use strict'

const DBUtils = require('../../utils/db-utils')
const db = DBUtils.getInstance({});



module.exports = async function (fastify, opts) {
  fastify.get('/all', async function (request, reply) {
      return db.query("select * from ev_charging_station_info")
  })
}
