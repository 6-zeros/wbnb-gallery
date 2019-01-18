const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const createTableString = 'CREATE TABLE gallery( roomid INT NOT NULL, roomname TEXT NOT NULL, photoid TEXT NOT NULL, photouRL TEXT NOT NULL, photocaption TEXT NOT NULL)';
const currDir = 'psqldata';
const currTable = 'gallery';
const columnToIndex = 'roomname';
const start = new Date().getTime();
let lengthOfDir = 0;


fs.readdir(`../data/${currDir}`, (err, files) => {
  if (err) {
    throw err;
  }
  lengthOfDir = files.length - 1;
  console.log(`There are ${lengthOfDir} files in the current directory`);
});

const client = new Client({
  host: '127.0.0.1',
  port: 5432,
  database: 'wbnb',
  user: 'postgres',
  password: 'jhst6356',
});

const populateDb = () => {
  return new Promise((resolve, reject) => {
    const populateNextTable = (number) => {
      if (number > lengthOfDir) {
        resolve();
      }
      const csvToLoad = `COPY ${currTable} FROM ../data/${currDir}/${currDir}${number}.csv DELIMITER ',' CSV HEADER`;

      client.query(csvToLoad)
        .then(() => {
          console.log(`\n${currDir}${number}.csv successfully loaded!`);
          console.log(`${(new Date().getTime() - start) / 1000} seconds have elapsed!\n`);
        })
        .then(() => populateNextTable(number + 1))
        .catch(err => reject(err));
    };
    populateNextTable(1);
  });
};


client.connect()
  .then(() => console.log('Connected to postgreSQL!'))
  .then(() => client.query(`DROP TABLE IF EXISTS ${currTable}`))
  .then(() => client.query(createTableString))
  .then(() => console.log('Table successfully created!'))
  .then(() => populateDb())
  .then(() => console.log(`Database successfully populated! Creating Index on "${columnToIndex}"...`))
  .then(() => client.query(`CREATE INDEX ${columnToIndex}_index ON ${currTable} (${columnToIndex})`))
  .then(() => {
    console.log(`\n\n\n\n————— Seeding completed in ${(new Date().getTime() - start) / 1000} seconds —————\n\n\n\nExiting Seeding Script. Goodbye!`);
    process.exit();
  })
  .catch(err => console.log('Uh oh. There was an error:\n\n', err));
