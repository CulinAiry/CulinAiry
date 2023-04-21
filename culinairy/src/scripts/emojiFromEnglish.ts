import { distance } from 'fastest-levenshtein';
import emojis from './emoji-Index';
import synonyms from 'synonyms';

function getSynonyms(keyword: string): string[] {
  return synonyms(keyword, 'n') || [];
}

export function getEmoji(keyword: string): string | undefined {
  keyword = keyword.toLocaleLowerCase();

  const exactMatch = emojis[keyword];
  if (exactMatch) {
    return exactMatch;
  }

  const baseKeywords = getSynonyms(keyword);
  const initialKeywords = baseKeywords.flatMap((baseKeyword) => [
    baseKeyword,
    `${baseKeyword}s`,
    `${baseKeyword}ing`,
  ]);
  const synonymKeywords = initialKeywords.flatMap((key) => getSynonyms(key));
  // console.log(synonymKeywords)



  const lightMatches = Object.keys(emojis).filter((key) => {
    const regex = new RegExp(`(${keyword}|${synonymKeywords.join('|')})`);
    return regex.test(key);
  });
  // console.log(lightMatches)
  // Now we have a list of emoji keys that slightly match

  // Find the key value that has the most key matches
const frequencies: {[key: string]: number} = {};
for (const emojiKeyword of lightMatches) {
  // console.log(emojiKeyword)
  // console.log(emojis[emojiKeyword || ''])
  if (frequencies[emojis[emojiKeyword || '']]) {
    frequencies[emojis[emojiKeyword || '']]++;
  } else {
    frequencies[emojis[emojiKeyword || '']] = 1;
  }
}

let mostFrequentKey: string | undefined;
let highestFrequency = 0;

for (const emojiKeyword of lightMatches) {
  const frequency = frequencies[emojis[emojiKeyword || '']];
  if (frequency > highestFrequency) {
    mostFrequentKey = emojiKeyword;
    highestFrequency = frequency;
  }
}

// console.log("mostFrequentKey", mostFrequentKey)
// console.log(emojis[mostFrequentKey || '']);
if (emojis[mostFrequentKey || ''] !== '🏳️‍🌈') return emojis[mostFrequentKey || ''];

  // console.log(synonymKeywords)
  let closestMatch: string | undefined;
  let closestDistance = Infinity;
  for (const emojiKeyword in emojis) {
    const currentDistance = distance(keyword, emojiKeyword);
    if (currentDistance < closestDistance) {
      closestMatch = emojis[emojiKeyword];
      closestDistance = currentDistance;
    }
  }

  // console.log(closestMatch)
  return closestMatch;
}
