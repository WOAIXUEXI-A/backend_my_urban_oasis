'use strict'
const DBUtils = require('../../utils/db-utils')
const db = DBUtils.getInstance({});

module.exports = async function (fastify, opts) {
  fastify.get('/all', async function (request, reply) {
    return db.query("select * from green_space_info");
  })

  fastify.get('/walking', async function (request, reply) {
    return db.query("select * from green_space_info where walking = 1");
  })

  fastify.get('/biking', async function (request, reply) {
    return db.query("select * from green_space_info where biking = 1");
  })

  fastify.get('/hiking', async function (request, reply) {
    return db.query("select * from green_space_info where hiking = 1");
  })

  fastify.get('/climbing', async function (request, reply) {
    return db.query("select * from green_space_info where climbing = 1");
  })

  fastify.get('/running', async function (request, reply) {
    return db.query("select * from green_space_info where running = 1");
  })

  fastify.get('/visit_greenspace', async function (request, reply) {
    const placeId = request.query.place_id;
    
    db.query("select * from place_visit_count where place_id =?", [placeId])
      .then(function (result) {
        if (result.length > 0) {
          db.query("update place_visit_count set visit_count = visit_count + 1 where place_id =?", [placeId]);
        } else {
          db.query("insert into place_visit_count (place_id, visit_count) values (?, 1)", [placeId]);
        }
      })
     .catch(function (error) {
        console.error(error);
      });
    return {code: 20000, message: "success"}; 
  })

  fastify.get('/visit_top_greenspace_detail', async function (request, reply) {
    const topk = Number(request.query.topk);
    db.query("select * from place_visit_count order by visit_count desc limit ?", [topk])
     .then(function (visitCounts) {
        const placeIds = visitCounts.map((item) => item.place_id);
        db.query("select * from green_space_info where place_id in (?)", [placeIds]).then(function (greenspaces) {
          if (greenspaces.length > 0) {
            // 合并访问计数到结果中
            const result = greenspaces.map(greenspace => {
              const visitInfo = visitCounts.find(v => v.place_id === greenspace.place_id);
              return {
                ...greenspace,
                visit_count: visitInfo ? visitInfo.visit_count : 0
              };
            });
            reply.send(result);
          } else {
            reply.send({code: 40000, message: "not found"});
          }
        })
      })
     .catch(function (error) {
        console.error(error);
      });
    
    return reply;
  })
  

  fastify.get('/info', async function (request, reply) {
    const placeId = request.query.placeId;
    return db.query("select * from green_space_info where place_id =?", [placeId]);
  })
 
}
