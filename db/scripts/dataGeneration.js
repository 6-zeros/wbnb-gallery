/* eslint-disable no-nested-ternary */
const fs = require('fs');
const faker = require('faker');
const path = require('path');

let currentId = 1;
let currentFile = 1;
const currDir = 'psqldata';
const currExt = 'csv';
let firstRow = true;
const start = new Date().getTime();

const generateRandomNumber = (min, max) => {
  const randomNumber = Math.round(Math.random() * max);
  if (randomNumber >= min) {
    return randomNumber;
  }
  return generateRandomNumber(min, max);
};

const jsonGen = (id) => {
  const jsonObject = {
    roomId: id,
    roomname: `roomname${id}`,
    photoid: `uniq${id}${faker.random.number()}`,
    photo: [
      { url: `http://dx37dhl9dvhoj.cloudfront.net/img${generateRandomNumber(1, 981)}.jpg`, caption: faker.lorem.sentence() },
      { url: `http://dx37dhl9dvhoj.cloudfront.net/img${generateRandomNumber(1, 981)}.jpg`, caption: faker.lorem.sentence() },
      { url: `http://dx37dhl9dvhoj.cloudfront.net/img${generateRandomNumber(1, 981)}.jpg`, caption: faker.lorem.sentence() },
      { url: `http://dx37dhl9dvhoj.cloudfront.net/img${generateRandomNumber(1, 981)}.jpg`, caption: faker.lorem.sentence() },
      { url: `http://dx37dhl9dvhoj.cloudfront.net/img${generateRandomNumber(1, 981)}.jpg`, caption: faker.lorem.sentence() },
    ],
  };
  return jsonObject;
};

const csvGen = (id) => {
  const csvRow = id === 1
    ? `roomid,roomname\n${id},roomname${id},uniq${id}${faker.random.number()}\n`
    : `${id},roomname${id},uniqId\n`;
  return csvRow;
};

const csvGenCassandra = (id) => {
  let outputRow = '';
  const numberOfPhotos = generateRandomNumber(6, 11);
  outputRow += `${id}|`;
  outputRow += `roomname${id}|`;


  for (let i = 1; i < numberOfPhotos; i += 1) {
    if (i === 1) {
      outputRow += `[["http://dx37dhl9dvhoj.cloudfront.net/img${generateRandomNumber(1, 981)}.jpg", ${faker.lorem.sentence()}],`;
    } else if (i === numberOfPhotos - 1) {
      outputRow += `["http://dx37dhl9dvhoj.cloudfront.net/img${generateRandomNumber(1, 981)}.jpg", ${faker.lorem.sentence()}]]\n`;
    } else {
      outputRow += `["http://dx37dhl9dvhoj.cloudfront.net/img${generateRandomNumber(1, 981)}.jpg", ${faker.lorem.sentence()}],`;
    }
  }

  const csvRow = firstRow
    ? `roomid,roomname,photos\n${outputRow}`
    : `${outputRow}`;
  return csvRow;
};

const csvGenPSQL = (id) => {
  let outputRow = '';
  const numberOfPhotos = generateRandomNumber(6, 11);

  for (let i = 1; i < numberOfPhotos; i += 1) {
    outputRow += `${id},`;
    outputRow += `roomname${id},`;
    outputRow += `photo${id}${generateRandomNumber(111, 999)},`;
    outputRow += `http://dx37dhl9dvhoj.cloudfront.net/img${generateRandomNumber(111, 999)}.jpg,`;
    outputRow += `${faker.lorem.sentence()}\n`;
  }

  const csvRow = firstRow
    ? `roomid,roomname,photoid,photourl,photocaption\n${outputRow}`
    : `${outputRow}`;
  return csvRow;
};

const createFiles = (totalEntries, entriesPerFile) => {
  // JSON: `/data/alldata/alldata${currentFile}.txt`
  // Rooms CSV: `/data/roomsdata/roomsdata${currentFile}.csv`
  // Photos CSV: `/data/gallerydata/gallerydata${currentFile}.csv`
  let fileWriteStream = fs.createWriteStream(`./data/${currDir}/${currDir}${currentFile}.${currExt}`);

  const writeToFile = () => {
    if (((currentId - 1) % entriesPerFile === 0) && currentFile <= (totalEntries / entriesPerFile)) {
      console.log(`File ${currentFile} generating. Overall progress: ${Math.round((currentId / (totalEntries + 100)) * 100)}%`);

      fileWriteStream = fs.createWriteStream(`./data/${currDir}/${currDir}${currentFile}.${currExt}`);
      currentFile += 1;
      firstRow = true;
    }

    if (currentId > totalEntries) {
      console.log(`All files successfully created! Overall progress: 100%`);
      const end = new Date().getTime();
      console.log(`Time elapsed: ${(end - start) / 1000} seconds.`);
      return;
    }

    const proceed = fileWriteStream.write(csvGenPSQL(currentId));
    firstRow = false;
    if (proceed) {
      currentId += 1;
      writeToFile();
    } else {
      fileWriteStream.once('drain', () => {
        currentId += 1;
        writeToFile();
      });
    }
  };

  writeToFile();
};

createFiles(10000000, 200000);
