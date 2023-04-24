import { distance } from 'fastest-levenshtein';
import emojis from './emoji-Index';
import defaultEmojiMap from './defaultEmojiMap';
import synonyms from 'synonyms';

function getSynonyms(keyword: string): string[] {
  return synonyms(keyword, 'n') || [];
}

export function getEmoji(keyword: string): string | undefined {
  keyword = keyword.toLocaleLowerCase();

  const defaultMatch = defaultEmojiMap[keyword];
  if (defaultMatch) {
    return defaultMatch;
  }

  const exactMatch = emojis[keyword];
  if (exactMatch) {
    return exactMatch;
  }

  const baseKeywords = getSynonyms(keyword);
  const initialKeywords = baseKeywords.flatMap((baseKeyword) => [
    baseKeyword,
    `${baseKeyword.slice(-1)}`,
    `${baseKeyword}s`,
    `${baseKeyword}ing`,
  ]);
  const synonymKeywords = initialKeywords.flatMap((key) => getSynonyms(key));
  // console.log(synonymKeywords)

  const likelyMatches = Object.keys(defaultEmojiMap).filter((key) => {
    const regex = new RegExp(`(${keyword}|${synonymKeywords.join('|')})`);
    return regex.test(key);
  });

  // console.log(lightMatches)
  // Now we have a list of emoji keys that slightly match

  // Find the key value that has the most key matches
  const frequencies: { [key: string]: number } = {};
  for (const emojiKeyword of likelyMatches) {
    // console.log(emojiKeyword)
    // console.log(emojis[emojiKeyword || ''])
    if (frequencies[defaultEmojiMap[emojiKeyword || '']]) {
      frequencies[defaultEmojiMap[emojiKeyword || '']]++;
    } else {
      frequencies[defaultEmojiMap[emojiKeyword || '']] = 1;
    }
  }

  let mostFrequentKey: string | undefined;
  let highestFrequency = 0;

  for (const emojiKeyword of likelyMatches) {
    const frequency = frequencies[defaultEmojiMap[emojiKeyword || '']];
    if (frequency > highestFrequency) {
      mostFrequentKey = emojiKeyword;
      highestFrequency = frequency;
    }
  }

  // console.log("mostFrequentKey", mostFrequentKey)
  // console.log(emojis[mostFrequentKey || '']);
  if (defaultEmojiMap[mostFrequentKey || ''] !== '🏳️‍🌈') return defaultEmojiMap[mostFrequentKey || ''];

  // console.log(synonymKeywords)
  let closestMatch: string | undefined;
  let closestDistance = Infinity;
  for (const emojiKeyword in defaultEmojiMap) {
    const currentDistance = distance(keyword, emojiKeyword);
    if (currentDistance < closestDistance) {
      closestMatch = defaultEmojiMap[emojiKeyword];
      closestDistance = currentDistance;
    }
  }

  if (closestMatch) return closestMatch;

  const lightMatches = Object.keys(emojis).filter((key) => {
    const regex = new RegExp(`(${keyword}|${synonymKeywords.join('|')})`);
    return regex.test(key);
  });
  // console.log(lightMatches)
  // Now we have a list of emoji keys that slightly match

  // Find the key value that has the most key matches
  for (const emojiKeyword of lightMatches) {
    // console.log(emojiKeyword)
    // console.log(emojis[emojiKeyword || ''])
    if (frequencies[emojis[emojiKeyword || '']]) {
      frequencies[emojis[emojiKeyword || '']]++;
    } else {
      frequencies[emojis[emojiKeyword || '']] = 1;
    }
  }

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
