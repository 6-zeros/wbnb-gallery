# CRUD API

> Implementation and functionality will be finalized after final database is chosen
  
## CREATE
- Route: app.post('/api/rooms/:roomid/gallery')
- Image data will come through the body of the request
- Room id will be contained in the url
- Calls the addPhotos function which will handle database insertion

## READ
- Route: app.get('/api/rooms/:roomid/gallery')
- Room id will be contained in the url
- Calls the fetchGallery function which will query the database on roomId

## UPDATE
- Route: app.put('/api/rooms/:roomid/gallery')
- New reservation info will come through the body of the request
- Room id will be contained in the url
- Calls the updateGallery function which will query the database for the roomId and update it

## DELETE
- Route: app.delete('/api/rooms/:roomid/gallery/:photoid')
- Photo(s) info will come through the body of the request
- Room id will be contained in the url
- Calls the deletePhotos function which will query the database on roomId and delete the necessary record(s)