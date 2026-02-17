import { BuildData, type Level } from "../build_data";
import { updateCategories, type UpdateKeys } from "../build_data/updates";

const secret = 'iauhrpijspofiwpjbrepiwnapfiojpoiajroijajwp';
const xorCipher = (str: string, key: string): string => {
  let result = '';
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i) ^ key.charCodeAt(i % key.length);
    result += String.fromCharCode(code);
  }
  return result;
};
const encrypt = (str: string): string => {
  return btoa(xorCipher(str, secret));
};
const decrypt = (str: string): string => {
  return xorCipher(atob(str), secret);
};

const localStorageKey = 'playData';

export type Statistics = {
  collectTypeCount: number;
  wrongTypeCount: number;
  collectWordCount: number;
  collectLineCount: number;
  totalGameTime: number;
  maxWpm: number | null;
  totalPoint: number;
  totalUsedPoint: number;
  levels: {
    level: number;
    clearCount: number;
    missCount: number;
    totalGameTime: number;
    minGameTime: number | null;
  }[];
};

export type PlayData = {
  seVolume: boolean;
  bgmVolume: boolean;
  point: number;
  maxGameLevel: number;
  gameTime: number;
  keyCollectPoint: number;
  wordCollectPoint: number;
  lineCollectPoint: number;
  keyWrongPointRate: number;
  unlockedWpm: boolean,
  unlockedReplay: boolean,
  unlockedStatistics: boolean,
  currentGameLevel: Level;
  updateGrades: { [K in UpdateKeys]: number };
  statistics: Statistics;
};

const initPlayDataCache = (): PlayData => {
  return {
    seVolume: true,
    bgmVolume: true,
    point: 0,
    maxGameLevel: 1,
    gameTime: 5000,
    keyCollectPoint: 1,
    wordCollectPoint: 0,
    lineCollectPoint: 0,
    keyWrongPointRate: 10,
    unlockedWpm: false,
    unlockedReplay: false,
    unlockedStatistics: false,
    currentGameLevel: BuildData.levels[0] as Level,
    updateGrades: objectTransformValues(updateCategories, (_) => 0),
    statistics: {
      collectTypeCount: 0,
      wrongTypeCount: 0,
      collectWordCount: 0,
      collectLineCount: 0,
      totalGameTime: 0,
      maxWpm: null,
      totalPoint: 0,
      totalUsedPoint: 0,
      levels: BuildData.levels.map(level => ({
        level: level.level,
        clearCount: 0,
        missCount: 0,
        totalGameTime: 0,
        minGameTime: null,
      })),
    },
  };
};

const LocalCacheManager = {
  getCache(): PlayData {
    const currentCache = localStorage.getItem(localStorageKey);
    const currentData = objectDeepMerge(
      initPlayDataCache(),
      currentCache != null ? JSON.parse(decrypt(currentCache)) : {},
    );
    localStorage.setItem(localStorageKey, encrypt(JSON.stringify(currentData)));
    return currentData
  },
  setCache(playData: PlayData) {
    localStorage.setItem(localStorageKey, encrypt(JSON.stringify(playData)));
  },
};

export const currentPlayData: PlayData = reactive(LocalCacheManager.getCache());
watch(currentPlayData, newValue => {
  LocalCacheManager.setCache(newValue);
}, {
  deep: true,
});
