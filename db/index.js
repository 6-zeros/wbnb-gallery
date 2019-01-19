const { Client } = require('pg');

const client = new Client({
  host: '127.0.0.1',
  port: 5432,
  database: 'wbnb',
  user: 'postgres',
  password: 'jhst6356',
});

client.connect()
  .then(() => console.log('Successfully connected to PostgreSQL!'))
  .catch((err) => { throw err; });

const getPhotosByRoomId = (roomId) => {
  return new Promise((resolve, reject) => {
    client.query(`SELECT photourl, photocaption FROM gallery WHERE roomname = 'roomname${roomId}'`)
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

const deletePhotoByPhotoId = (photoId) => {
  client.query(`DELETE FROM gallery WHERE photoid = '${photoId}'`)
    .then(res => res)
    .catch((err) => { throw err; });
};

const updateCaptionById = (photoId, newCaption) => {
  client.query(`UPDATE gallery SET photocaption = ${newCaption} WHERE photoid = '${photoId}'`)
    .then(res => res)
    .catch((err) => { throw err; });
};

module.exports = { getPhotosByRoomId, deletePhotoByPhotoId, updateCaptionById };
