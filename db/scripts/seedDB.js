const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const createTableString = 'CREATE TABLE gallery( roomid INT NOT NULL, roomname TEXT NOT NULL, uniqId TEXT NOT NULL, photoURL TEXT NOT NULL, photoCaption TEXT NOT NULL)';
const currDir = 'gallerydata';
const filePath = path.join(__dirname, '/data/gallerydata');
const start = new Date().getTime();
let lengthOfDir = 0;


fs.readdir(`./data/${currDir}`, (err, files) => {
  if (err) {
    throw err;
  }
  lengthOfDir = files.length - 1;
  console.log(`There are ${lengthOfDir} files in the current directory`);
});

const client = new Client({
  host: 'localhost',
  database: 'wbnb',
});

const populateDb = () => {
  return new Promise((resolve, reject) => {
    const populateNextTable = (number) => {
      if (number > lengthOfDir) {
        resolve();
      }
      const csvToLoad = `COPY gallery FROM '${path.join(__dirname, `/data/gallerydata/gallerydata${number}.csv`)}' DELIMITER ',' CSV HEADER`;

      client.query(csvToLoad)
        .then(() => {
          console.log(`${number}.csv successfully loaded!`);
          console.log(`${(new Date().getTime() - start) / 1000} seconds have elapsed!\n\n`);
        })
        .then(() => populateNextTable(number + 1))
        .catch(err => reject(err));
    };
    populateNextTable(1);
  });
};


client.connect()
  .then(() => console.log('Connected to postgreSQL!'))
  .then(() => client.query('DROP TABLE IF EXISTS gallery'))
  .then(() => client.query(createTableString))
  .then(result => console.log('Table successfully created!', result))
  .then(() => populateDb())
  .then(() => console.log('Database successfully populated! Creating Index on "roomid"...'))
  .then(() => client.query('CREATE INDEX roomid_index ON gallery (roomid)'))
  .then(() => {
    console.log(`\n\n\n\n————— Seeding completed in ${(new Date().getTime() - start) / 1000} seconds —————\n\n\n\n`);
    process.exit();
  })
  .catch(err => console.log('There was an unknown error.', err));
