require('newrelic');
const express = require('express');
const redis = require('redis');
const bodyParser = require('body-parser');
const path = require('path');

const client = redis.createClient({
  password: 'X3hgGnPMP*$GFkpS5!Sd',
  host: '34.209.48.207',
  port: 6379,
});
const app = express();
const PORT = 3000;
const psql = require('../db/index.js');

app.use('/rooms/:id', express.static('./client/dist'));
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

client.on('ready', () => {
  console.log('Connected to Redis cache!');
});

client.on('error', (err) => { throw err; });

app.get('/rooms/:id/photos', (req, res) => {
  const { id } = req.params;
  console.log(`Server pinged @ ${new Date().toLocaleTimeString()} with request for room ${id}.`);

  return client.get(`roomid${id}`, (err, result) => {
    if (result) {
      const resultJSON = JSON.parse(result);
      return res.status(200).json(resultJSON);
    }

    return psql.getPhotosByRoomId(id)
      .then((photos) => {
        const responseJSON = photos.rows;
        client.setex(`roomid${id}`, 3600, JSON.stringify(responseJSON));
        res.status(200).json(responseJSON);
      })
      .catch(error => res.send(error));
  });
});

// loader.io stress testing key
app.get('/loaderio-c71b09134700d98c0fbfb7984edbe137.txt', (req, res) => {
  res.sendFile(path.join(__dirname, 'loaderio-c71b09134700d98c0fbfb7984edbe137.txt'), (err) => {
    if (err) { throw err; }
  });
});

app.delete('/rooms/:id/photos', (req, res) => {
  const { photoId } = req.params;
  psql.deletePhotoByPhotoId(photoId)
    .then(photos => res.send(photos))
    .catch((err) => { throw err; });
});

app.listen(PORT, () => {
  console.log(`server listening on port, ${PORT}`);
});
