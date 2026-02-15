import type { PlayData } from "../play_data";

export type UpdateGrade = {
  text: string;
  requirePoint: number;
  process: (playData: PlayData) => void;
};

export type UpdateCategory = {
  title: string;
  description: string;
  condition: (playData: PlayData) => boolean;
  updateGrades: UpdateGrade[];
};

export type UpdateKeys
  = 'incrementGameTime'
  | 'incrementKeyCollectPoint'
  | 'incrementWordCollectPoint'
  | 'incrementLineCollectPoint'
  | 'incrementKeyWrongPointRate'
  | 'incrementMaxGameLevel'
  | 'unlockWpm'

export const updateCategories: { [K in UpdateKeys]: UpdateCategory } = {
  incrementGameTime: {
    title: 'ゲーム時間',
    description: '1ゲームの制限時間を伸ばします',
    condition: (_: PlayData) => true,
    updateGrades: [
      {
        text: 'ゲーム時間 5秒 -> 6秒',
        requirePoint: 80,
        process: (playData: PlayData) => playData.gameTime = 6000,
      },
      {
        text: 'ゲーム時間 6秒 -> 7秒',
        requirePoint: 150,
        process: (playData: PlayData) => playData.gameTime = 7000,
      },
      {
        text: 'ゲーム時間 7秒 -> 8秒',
        requirePoint: 300,
        process: (playData: PlayData) => playData.gameTime = 8000,
      },
      {
        text: 'ゲーム時間 8秒 -> 9秒',
        requirePoint: 500,
        process: (playData: PlayData) => playData.gameTime = 9000,
      },
      {
        text: 'ゲーム時間 9秒 -> 10秒',
        requirePoint: 1000,
        process: (playData: PlayData) => playData.gameTime = 10000,
      },
      {
        text: 'ゲーム時間 10秒 -> 11秒',
        requirePoint: 2000,
        process: (playData: PlayData) => playData.gameTime = 11000,
      },
      {
        text: 'ゲーム時間 11秒 -> 12秒',
        requirePoint: 5000,
        process: (playData: PlayData) => playData.gameTime = 12000,
      },
      {
        text: 'ゲーム時間 12秒 -> 13秒',
        requirePoint: 10000,
        process: (playData: PlayData) => playData.gameTime = 13000,
      },
      {
        text: 'ゲーム時間 13秒 -> 14秒',
        requirePoint: 20000,
        process: (playData: PlayData) => playData.gameTime = 14000,
      },
      {
        text: 'ゲーム時間 14秒 -> 15秒',
        requirePoint: 50000,
        process: (playData: PlayData) => playData.gameTime = 15000,
      },
      {
        text: 'ゲーム時間 15秒 -> 16秒',
        requirePoint: 100000,
        process: (playData: PlayData) => playData.gameTime = 16000,
      },
      {
        text: 'ゲーム時間 16秒 -> 17秒',
        requirePoint: 200000,
        process: (playData: PlayData) => playData.gameTime = 17000,
      },
      {
        text: 'ゲーム時間 17秒 -> 18秒',
        requirePoint: 500000,
        process: (playData: PlayData) => playData.gameTime = 18000,
      },
      {
        text: 'ゲーム時間 18秒 -> 19秒',
        requirePoint: 1000000,
        process: (playData: PlayData) => playData.gameTime = 19000,
      },
      {
        text: 'ゲーム時間 19秒 -> 20秒',
        requirePoint: 2000000,
        process: (playData: PlayData) => playData.gameTime = 20000,
      },
      {
        text: 'ゲーム時間 20秒 -> 21秒',
        requirePoint: 5000000,
        process: (playData: PlayData) => playData.gameTime = 21000,
      },
      {
        text: 'ゲーム時間 21秒 -> 22秒',
        requirePoint: 10000000,
        process: (playData: PlayData) => playData.gameTime = 22000,
      },
      {
        text: 'ゲーム時間 22秒 -> 23秒',
        requirePoint: 3000000,
        process: (playData: PlayData) => playData.gameTime = 23000,
      },
      {
        text: 'ゲーム時間 23秒 -> 24秒',
        requirePoint: 10000000,
        process: (playData: PlayData) => playData.gameTime = 24000,
      },
      {
        text: 'ゲーム時間 24秒 -> 25秒',
        requirePoint: 100000000,
        process: (playData: PlayData) => playData.gameTime = 25000,
      },
      {
        text: 'ゲーム時間 25秒 -> 26秒',
        requirePoint: 10000000,
        process: (playData: PlayData) => playData.gameTime = 26000,
      },
      {
        text: 'ゲーム時間 26秒 -> 27秒',
        requirePoint: 10000000,
        process: (playData: PlayData) => playData.gameTime = 27000,
      },
      {
        text: 'ゲーム時間 27秒 -> 28秒',
        requirePoint: 10000000,
        process: (playData: PlayData) => playData.gameTime = 28000,
      },
      {
        text: 'ゲーム時間 28秒 -> 29秒',
        requirePoint: 10000000,
        process: (playData: PlayData) => playData.gameTime = 29000,
      },
      {
        text: 'ゲーム時間 29秒 -> 30秒',
        requirePoint: 10000000,
        process: (playData: PlayData) => playData.gameTime = 30000,
      },
    ],
  },
  incrementKeyCollectPoint: {
    title: '正タイプポイント',
    description: '正しいタイプをすると加算されるポイントを上げます',
    condition: (_: PlayData) => true,
    updateGrades: [
      {
        text: '正タイプポイント 1 -> 2',
        requirePoint: 30,
        process: (playData: PlayData) => playData.keyCollectPoint = 2,
      },
      {
        text: '正タイプポイント 2 -> 4',
        requirePoint: 120,
        process: (playData: PlayData) => playData.keyCollectPoint = 4,
      },
      {
        text: '正タイプポイント 4 -> 8',
        requirePoint: 500,
        process: (playData: PlayData) => playData.keyCollectPoint = 8,
      },
      {
        text: '正タイプポイント 8 -> 16',
        requirePoint: 2000,
        process: (playData: PlayData) => playData.keyCollectPoint = 16,
      },
      {
        text: '正タイプポイント 16 -> 32',
        requirePoint: 6000,
        process: (playData: PlayData) => playData.keyCollectPoint = 32,
      },
      {
        text: '正タイプポイント 32 -> 64',
        requirePoint: 25000,
        process: (playData: PlayData) => playData.keyCollectPoint = 64,
      },
      {
        text: '正タイプポイント 64 -> 128',
        requirePoint: 100000,
        process: (playData: PlayData) => playData.keyCollectPoint = 128,
      },
      {
        text: '正タイプポイント 128 -> 256',
        requirePoint: 300000,
        process: (playData: PlayData) => playData.keyCollectPoint = 256,
      },
      {
        text: '正タイプポイント 256 -> 512',
        requirePoint: 1000000,
        process: (playData: PlayData) => playData.keyCollectPoint = 512,
      },
      {
        text: '正タイプポイント 512 -> 1024',
        requirePoint: 10000000,
        process: (playData: PlayData) => playData.keyCollectPoint = 1024,
      },
    ],
  },
  incrementWordCollectPoint: {
    title: 'ワード完成ポイント',
    description: '1ワードを完成すると加算されるポイントを上げます',
    condition: (playData: PlayData) => playData.updateGrades.incrementKeyCollectPoint >= 2,
    updateGrades: [
      {
        text: 'ワード完成ポイント 0 -> 20',
        requirePoint: 300,
        process: (playData: PlayData) => playData.wordCollectPoint = 20,
      },
      {
        text: 'ワード完成ポイント 20 -> 40',
        requirePoint: 1200,
        process: (playData: PlayData) => playData.wordCollectPoint = 40,
      },
      {
        text: 'ワード完成ポイント 40 -> 80',
        requirePoint: 5000,
        process: (playData: PlayData) => playData.wordCollectPoint = 80,
      },
      {
        text: 'ワード完成ポイント 80 -> 160',
        requirePoint: 20000,
        process: (playData: PlayData) => playData.wordCollectPoint = 160,
      },
      {
        text: 'ワード完成ポイント 160 -> 320',
        requirePoint: 60000,
        process: (playData: PlayData) => playData.wordCollectPoint = 320,
      },
      {
        text: 'ワード完成ポイント 320 -> 640',
        requirePoint: 250000,
        process: (playData: PlayData) => playData.wordCollectPoint = 640,
      },
      {
        text: 'ワード完成ポイント 640 -> 1280',
        requirePoint: 1000000,
        process: (playData: PlayData) => playData.wordCollectPoint = 1280,
      },
      {
        text: 'ワード完成ポイント 1280 -> 2560',
        requirePoint: 3000000,
        process: (playData: PlayData) => playData.wordCollectPoint = 2560,
      },
      {
        text: 'ワード完成ポイント 2560 -> 5120',
        requirePoint: 10000000,
        process: (playData: PlayData) => playData.wordCollectPoint = 5120,
      },
      {
        text: 'ワード完成ポイント 5120 -> 10240',
        requirePoint: 100000000,
        process: (playData: PlayData) => playData.wordCollectPoint = 10240,
      },
    ],
  },
  incrementLineCollectPoint: {
    title: 'ライン完成ポイント',
    description: '1ラインを完成すると加算されるポイントを上げます',
    condition: (playData: PlayData) => playData.updateGrades.incrementWordCollectPoint >= 2,
    updateGrades: [
      {
        text: 'ライン完成ポイント 0 -> 200',
        requirePoint: 300,
        process: (playData: PlayData) => playData.lineCollectPoint = 200,
      },
      {
        text: 'ライン完成ポイント 200 -> 400',
        requirePoint: 1200,
        process: (playData: PlayData) => playData.lineCollectPoint = 400,
      },
      {
        text: 'ライン完成ポイント 400 -> 800',
        requirePoint: 5000,
        process: (playData: PlayData) => playData.lineCollectPoint = 800,
      },
      {
        text: 'ライン完成ポイント 800 -> 1600',
        requirePoint: 20000,
        process: (playData: PlayData) => playData.lineCollectPoint = 1600,
      },
      {
        text: 'ライン完成ポイント 1600 -> 3200',
        requirePoint: 60000,
        process: (playData: PlayData) => playData.lineCollectPoint = 3200,
      },
      {
        text: 'ライン完成ポイント 3200 -> 6400',
        requirePoint: 250000,
        process: (playData: PlayData) => playData.lineCollectPoint = 6400,
      },
      {
        text: 'ライン完成ポイント 6400 -> 12800',
        requirePoint: 1000000,
        process: (playData: PlayData) => playData.lineCollectPoint = 12800,
      },
      {
        text: 'ライン完成ポイント 12800 -> 25600',
        requirePoint: 3000000,
        process: (playData: PlayData) => playData.lineCollectPoint = 25600,
      },
      {
        text: 'ライン完成ポイント 25600 -> 51200',
        requirePoint: 10000000,
        process: (playData: PlayData) => playData.lineCollectPoint = 51200,
      },
      {
        text: 'ライン完成ポイント 51200 -> 102400',
        requirePoint: 100000000,
        process: (playData: PlayData) => playData.lineCollectPoint = 102400,
      },
    ],
  },
  incrementKeyWrongPointRate: {
    title: '誤タイプペナルティ',
    description: '間違ったタイプをすると与えられるポイントペナルティを減らします',
    condition: (_: PlayData) => true,
    updateGrades: [
      {
        text: '誤タイプペナルティ 10 -> 9',
        requirePoint: 30,
        process: (playData: PlayData) => playData.keyWrongPointRate = 9,
      },
      {
        text: '誤タイプペナルティ 9 -> 8',
        requirePoint: 120,
        process: (playData: PlayData) => playData.keyWrongPointRate = 8,
      },
      {
        text: '誤タイプペナルティ 8 -> 7',
        requirePoint: 500,
        process: (playData: PlayData) => playData.keyWrongPointRate = 7,
      },
      {
        text: '誤タイプペナルティ 7 -> 6',
        requirePoint: 2000,
        process: (playData: PlayData) => playData.keyWrongPointRate = 6,
      },
      {
        text: '誤タイプペナルティ 6 -> 5',
        requirePoint: 6000,
        process: (playData: PlayData) => playData.keyWrongPointRate = 5,
      },
      {
        text: '誤タイプペナルティ 5 -> 4',
        requirePoint: 25000,
        process: (playData: PlayData) => playData.keyWrongPointRate = 4,
      },
      {
        text: '誤タイプペナルティ 4 -> 3',
        requirePoint: 100000,
        process: (playData: PlayData) => playData.keyWrongPointRate = 3,
      },
      {
        text: '誤タイプペナルティ 3 -> 2',
        requirePoint: 100000,
        process: (playData: PlayData) => playData.keyWrongPointRate = 2,
      },
      {
        text: '誤タイプペナルティ 2 -> 1',
        requirePoint: 100000,
        process: (playData: PlayData) => playData.keyWrongPointRate = 1,
      },
      {
        text: '誤タイプペナルティ 1 -> 0',
        requirePoint: 100000,
        process: (playData: PlayData) => playData.keyWrongPointRate = 0,
      },
    ],
  },
  incrementMaxGameLevel: {
    title: 'ゲームレベル',
    description: 'プレイできるゲームレベルを上げます',
    condition: (_: PlayData) => true,
    updateGrades: [
      {
        text: 'レベル2を解放',
        requirePoint: 1000,
        process: (playData: PlayData) => playData.maxGameLevel = 2,
      },
      {
        text: 'レベル3を解放',
        requirePoint: 10000,
        process: (playData: PlayData) => playData.maxGameLevel = 3,
      },
      {
        text: 'レベル4を解放',
        requirePoint: 100000,
        process: (playData: PlayData) => playData.maxGameLevel = 4,
      },
      {
        text: 'レベル5を解放',
        requirePoint: 10000000,
        process: (playData: PlayData) => playData.maxGameLevel = 5,
      },
    ],
  },
  unlockWpm: {
    title: 'WPM計測を解放',
    description: 'ゲーム結果でWPMを表示します',
    condition: (_: PlayData) => true,
    updateGrades: [
      {
        text: 'ゲーム結果でWPMを表示',
        requirePoint: 100000,
        process: (playData: PlayData) => playData.unlockedWpm = true,
      },
    ],
  },
};
