'use strict'

const DBUtils = require('../utils/db-utils')
const db = DBUtils.getInstance({});

module.exports = async function (fastify, opts) {
  fastify.get('/', async function (request, reply) {
    return db.execute("select 1");
  })
}
