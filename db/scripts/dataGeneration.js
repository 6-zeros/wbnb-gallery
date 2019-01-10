const fs = require('fs');
const faker = require('faker');
const path = require('path');

let currentId = 1;
let errors = 0;
const start = new Date().getTime();
console.log('Start: ', start);

const generateRandomNumber = (min, max) => {
  let randomNumber = Math.round(Math.random() * max);
  if (randomNumber < min) {
    randomNumber = Math.round(Math.random() * max);
  }
  return randomNumber;
};


const jsonGen = (id) => {
  const jsonObject = {
    roomId: id,
    roomname: `room${id}`,
    photo: [
      { url: `http://dx37dhl9dvhoj.cloudfront.net/img${generateRandomNumber(1, 981)}.jpg`, caption: faker.lorem.sentence() },
      { url: `http://dx37dhl9dvhoj.cloudfront.net/img${generateRandomNumber(1, 981)}.jpg`, caption: faker.lorem.sentence() },
      { url: `http://dx37dhl9dvhoj.cloudfront.net/img${generateRandomNumber(1, 981)}.jpg`, caption: faker.lorem.sentence() },
      { url: `http://dx37dhl9dvhoj.cloudfront.net/img${generateRandomNumber(1, 981)}.jpg`, caption: faker.lorem.sentence() },
      { url: `http://dx37dhl9dvhoj.cloudfront.net/img${generateRandomNumber(1, 981)}.jpg`, caption: faker.lorem.sentence() },
    ],
  };

  currentId += 1;
  return jsonObject;
};

const csvGen = (id) => {
  const csvRow = id === 1
    ? `roomid, roomname \n${id}, roomname${id} \n`
    : `${id}, roomname${id} \n`;

  currentId += 1;
  return csvRow;
};

const csvGen2 = (id) => {
  const outputRow = `${id}, roomname${id}, http://dx37dhl9dvhoj.cloudfront.net/img${generateRandomNumber(1, 981)}.jpg, ${faker.lorem.sentence()}\n${id}, roomname${id}, http://dx37dhl9dvhoj.cloudfront.net/img${generateRandomNumber(1, 981)}.jpg, ${faker.lorem.sentence()}\n${id}, roomname${id}, http://dx37dhl9dvhoj.cloudfront.net/img${generateRandomNumber(1, 981)}.jpg, ${faker.lorem.sentence()}\n${id}, roomname${id}, http://dx37dhl9dvhoj.cloudfront.net/img${generateRandomNumber(1, 981)}.jpg, ${faker.lorem.sentence()}\n${id}, roomname${id}, http://dx37dhl9dvhoj.cloudfront.net/img${generateRandomNumber(1, 981)}.jpg, ${faker.lorem.sentence()}\n`;

  const csvRow = id === 1
    ? `roomid, roomname, photoUrl, photoCaption\n${outputRow}`
    : `${outputRow}`;
  currentId += 1;
  return csvRow;
};

const writeDataToFile = (totalEntries) => {
  const fileWriteStream = fs.createWriteStream(path.join(__dirname, '/data/gallerydata.csv'));

  const writeChunksToFile = (timesRun) => {
    if (currentId >= totalEntries) {
      const end = new Date().getTime();
      console.log('Duration: ', (end - start) / 1000, ' seconds');
      return;
    }
    // const proceed = fileWriteStream.write(JSON.stringify(jsonGen(currentId)) + '\n');
    const proceed = fileWriteStream.write(csvGen2(currentId));
    if (proceed) {
      writeChunksToFile(timesRun + 1);
    } else {
      fileWriteStream.once('drain', () => {
        writeChunksToFile(timesRun + 1);
      });
    }
  };

  writeChunksToFile(0);
};

writeDataToFile(10000000);
