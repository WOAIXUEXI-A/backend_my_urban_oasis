'use strict'
const DBUtils = require('../../utils/db-utils')
const db = DBUtils.getInstance({});
const axios = require('axios');


function getPhotoRef(place_id) {
    return new Promise((resolve, reject) => {
      const options = {
        method: 'GET',
        url: `https://maps.googleapis.com/maps/api/place/details/json?placeid=${place_id}&key=${process.env.PHOTO_API_KEY}`,
      };
  
      axios.request(options)
        .then(function (response) {
          const photos = response.data.result.photos;
          const photo_refs = photos.map(photo => photo.photo_reference);
          resolve(photo_refs);
        })
        .catch(function (error) {
          console.error(error);
          reject(error);
        });
    });
}

function getPhotos(photo_refs) {
    return new Promise((resolve, reject) => {
      const options = {
        method: 'GET',
        url: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=150&photoreference=${photo_refs}&key=${process.env.PHOTO_API_KEY}`,
        responseType: 'arraybuffer'
      };
  
      axios.request(options)
        .then(function (response) {
          const base64Image = Buffer.from(response.data, 'binary').toString('base64');
          const imageUrl = `data:${response.headers['content-type']};base64,${base64Image}`;
          resolve(imageUrl);
        })
        .catch(function (error) {
          console.error(error);
          reject(error);
        });
    });
}


module.exports = async function (fastify, opts) {
  fastify.get('/photo/:place_id', async function (request, reply) {


    const place_id = request.params.place_id;

    // 触发访问接口
    /*
    fastify.inject({
      method: 'GET',
      url: '/greenspace/visit_greenspace',
      query: {
        'placeId': place_id
      }
    });
    */

    // check cache
    const result = await db.query("select * from place_photo where place_id = ?", [place_id]);

    if (result.length > 0) {
      return result[0].photo;
    }

    let photo_refs = await getPhotoRef(place_id);
    photo_refs = photo_refs.slice(0, 3);
    const photos = await Promise.all(photo_refs.map(ref => getPhotos(ref)));

    if (photos.length === 0) {
      return [];
    }
    
    db.execute("insert into place_photo (place_id, photo) values (?, ?)", [place_id, JSON.stringify(photos)]);
    return photos;
  })
}
