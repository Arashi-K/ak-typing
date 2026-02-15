import { BuildData, type Level } from "../build_data";
import { updateCategories, type UpdateKeys } from "../build_data/updates";

const localStorageKey = 'playData';

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
  currentGameLevel: Level;
  updateGrades: { [K in UpdateKeys]: number };
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
    currentGameLevel: BuildData.levels[0] as Level,
    updateGrades: objectTransformValues(updateCategories, (_) => 0),
  };
};

const LocalCacheManager = {
  getCache(): PlayData {
    const currentCache = localStorage.getItem(localStorageKey);
    if (currentCache != null) {
      return JSON.parse(currentCache) as PlayData;
    } else {
      const currentData = initPlayDataCache();
      localStorage.setItem(localStorageKey, JSON.stringify(currentData));
      return currentData;
    }
  },
  setCache(playData: PlayData) {
    localStorage.setItem(localStorageKey, JSON.stringify(playData));
  },
};

export const currentPlayData: PlayData = reactive(LocalCacheManager.getCache());
watch(currentPlayData, newValue => {
  LocalCacheManager.setCache(newValue);
}, {
  deep: true,
});
