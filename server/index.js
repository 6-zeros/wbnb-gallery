const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 1337;
const psql = require('../db/index.js');

app.use('/rooms/:id', express.static('./client/dist'));
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

app.get('/rooms/:id/photos', (req, res) => {
  const { id } = req.params;
  psql.getPhotosByRoomId(id)
    .then(photos => res.send(photos.rows))
    .catch((err) => { throw err; });
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
 