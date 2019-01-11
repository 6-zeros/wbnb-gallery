const fs = require('fs');
const faker = require('faker');
const path = require('path');

let currentId = 1;
let currentFile = 1;
let firstRow = true;
const start = new Date().getTime();

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
    uniqId: `uniq${id}${faker.random.number()}`,
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

const csvGen2 = (id) => {
  let outputRow = '';

  for (let i = 1; i < 6; i += 1) {
    outputRow += `${id},`;
    outputRow += `roomname${id}${i},`;
    outputRow += `uniq${id}${faker.random.number()},`;
    outputRow += `http://dx37dhl9dvhoj.cloudfront.net/img${generateRandomNumber(1, 981)}.jpg,`;
    outputRow += `${faker.lorem.sentence()}\n`;
  }

  const csvRow = firstRow
    ? `roomid,roomname,uniqId,photoUrl,photoCaption\n${outputRow}`
    : `${outputRow}`;
  return csvRow;
};

const createFiles = (totalEntries, entriesPerFile) => {
  // JSON: `/data/alldata/alldata${currentFile}.txt`
  // Rooms CSV: `/data/roomsdata/roomsdata${currentFile}.csv`
  // Photos CSV: `/data/gallerydata/gallerydata${currentFile}.csv`
  let fileWriteStream = fs.createWriteStream(path.join(__dirname, `/data/gallerydata/gallerydata${currentFile}.csv`));

  const writeToFile = () => {
    if (((currentId - 1) % entriesPerFile === 0) && currentFile <= (totalEntries / entriesPerFile)) {
      console.log(`File ${currentFile} generating. Overall progress: ${Math.round((currentId / (totalEntries + 100)) * 100)}%`);

      fileWriteStream = fs.createWriteStream(path.join(__dirname, `/data/gallerydata/gallerydata${currentFile}.csv`));
      currentFile += 1;
      firstRow = true;
    }

    if (currentId > totalEntries) {
      console.log(`All files successfully created! Overall progress: 100%`);
      const end = new Date().getTime();
      console.log(`Time elapsed: ${(end - start) / 1000} seconds.`);
      return;
    }

    const proceed = fileWriteStream.write(csvGen2(currentId));
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
