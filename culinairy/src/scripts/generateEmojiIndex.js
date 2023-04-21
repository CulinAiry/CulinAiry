const emojiData = require('emojilib');
const fs = require ('fs');

function createIndexedMap (map) {
  const indexedMap= {};
  for (const key in map) {
    for (const value of map[key]) {
      indexedMap[value] = key;
    }
  }
  return indexedMap;
}

const indexedMap = createIndexedMap(emojiData);

fs.writeFile('output.json', JSON.stringify(indexedMap), (err) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log('Output file written successfully!');
});
