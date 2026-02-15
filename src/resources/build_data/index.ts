import levels from './levels.json';
import words from './words.json';

export type Level = {
  level: number;
  lineCount: number;
};

export const BuildData = {
  levels: levels as Level[],
  words: words as string[],
};
