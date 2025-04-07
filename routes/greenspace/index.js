'use strict'
const DBUtils = require('../../utils/db-utils')
const db = DBUtils.getInstance({});

module.exports = async function (fastify, opts) {
  fastify.get('/all', async function (request, reply) {
    return db.query("select * from green_space_info");
  })

  fastify.get('/walking', async function (request, reply) {
    const id = request.params.id;
    return db.query("select * from green_space_info where walking = 1");
  })

  fastify.get('/biking', async function (request, reply) {
    const id = request.params.id;
    return db.query("select * from green_space_info where biking = 1");
  })

  fastify.get('/hiking', async function (request, reply) {
    const id = request.params.id;
    return db.query("select * from green_space_info where hiking = 1");
  })

  fastify.get('/climbing', async function (request, reply) {
    const id = request.params.id;
    return db.query("select * from green_space_info where climbing = 1");
  })

  fastify.get('/running', async function (request, reply) {
    const id = request.params.id;
    return db.query("select * from green_space_info where running = 1");
  })
}
