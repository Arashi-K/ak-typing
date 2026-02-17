<template>
  <div class="scene">
    <div class="window console">
      <div class="info_area">
        <div class="info_area_level">Level{{ currentPlayData.currentGameLevel.level }}</div>
        <div class="info_area_time">{{ (countDown.remainingTime.value / 1000).toFixed(1) }}</div>
        <div class="info_area_point">現在のポイント: {{ previousPoint.toLocaleString() }} + {{ additionalPoint.toLocaleString() }}</div>
      </div>
      <div class="main_area">
        <div
          v-for="(line, lineIndex) in target.lines"
          :key="lineIndex"
          class="line"
        >
          <div class="line_index">
            {{ lineIndex + 1 }}.
          </div>
          <div
            class="line_status"
            :class="{ collect: line.status == 'collect' }"
          >
            {{ spacePadding(line.status == 'collect' ? 'OK!' : lineIndex == currentLineIndex ? '->' : '', 3) }}
          </div>
          <div class="line_key_count">
            ( {{ spacePadding(lineCollectKeyCount(line), 2) }}/{{ spacePadding(lineKeyCount(line), 2) }} )
          </div>
          <div class="line_words">
            <div
              v-for="(word, wordIndex) in line.words"
              :key="wordIndex"
              class="line_words_word"
            >
              <span
                v-for="(key, keyIndex) in word.keys"
                :key="keyIndex"
                :class="{
                  current: lineIndex == currentLineIndex && wordIndex == currentWordIndex && keyIndex == currentKeyIndex,
                  [key.status]: true,
                }"
              >
                {{ key.key }}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="guide_area">
        <div class="guide">メニュー: Esc</div>
      </div>
    </div>
    <div
      v-if="isPaused"
      class="window pause"
    >
      <div class="main_area">
        <div
          v-for="(menu, menuIndex) in pauseMenuList"
          :key="menuIndex"
          class="pause_menu"
          :class="[menu.style, { current: menuIndex == currentPauseMenuIndex }]"
        >> {{ menu.text }}</div>
      </div>
      <div class="guide_area">
        <div class="guide">上に移動: k/↑</div>
        <div class="guide">下に移動: j/↓</div>
        <div class="guide">決定: Space/Enter</div>
      </div>
    </div>
    <div
      v-if="!isRunningGame"
      class="window result"
    >
      <div class="result_area">
        <div>結果</div>
        <div>現在のポイント: {{ previousPoint.toLocaleString() }} -> {{ currentPlayData.point.toLocaleString() }}</div>
        <template v-if="currentPlayData.unlockedWpm">
          <div>正タイプ: {{ collectTypeCount }}</div>
          <div>誤タイプ: {{ wrongTypeCount }}</div>
          <div>正タイプ率: {{ collectTypeCount + wrongTypeCount != 0 ? (collectTypeCount / (collectTypeCount + wrongTypeCount) * 100).toFixed(1) : '-' }}%</div>
          <div>WPM: {{ wpm.toFixed(1) }}</div>
        </template>
      </div>
      <div class="guide_area">
        <div class="guide">メニューに戻る: Space</div>
        <div v-if="currentPlayData.unlockedReplay" class="guide">再プレイ: r</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { KeyManager } from '@/lib/key_manager';
import { WordManager } from '@/lib/word_manager';
import { AudioManager, SoundEffects } from '@/lib/audio_manager';
import { TimeManager } from '@/lib/time_manager';
import { StyleManager, type StyleState } from '@/lib/style_manager';
import { currentPlayData } from '@/resources/play_data';

interface Props {
  toMenuScene: () => void;
  resetPlayScene: () => void;
};
const props = defineProps<Props>();

type Menu = {
  text: string;
  onSelect: () => void;
  style: StyleState;
};
const pauseMenuList: Menu[] = [
  {
    text: 'ゲームを再開',
    onSelect: () => {
      isPaused.value = false;
      currentPauseMenuIndex.value = 0;
      currentPauseMenu.value = pauseMenuList[0] as Menu;
      if (isRunningGame.value) {
        countDown.start();
      }
    },
    style: StyleManager.style(),
  },
  {
    text: 'ゲームをやり直す',
    onSelect: () => {
      props.resetPlayScene();
    },
    style: StyleManager.style(),
  },
  {
    text: 'ゲームを終了',
    onSelect: () => {
      props.toMenuScene();
    },
    style: StyleManager.style(),
  },
];
const isPaused = ref<boolean>(false);
const currentPauseMenuIndex = ref<number>(0);
const currentPauseMenu = ref<Menu>(pauseMenuList[0] as Menu);

const isRunningGame = ref<boolean>(true);
const previousPoint = currentPlayData.point;
const additionalPoint = ref<number>(0);
const collectTypeCount = ref<number>(0);
const wrongTypeCount = ref<number>(0);
const collectWordCount = ref<number>(0);
const collectLineCount = ref<number>(0);
const countDown = TimeManager.useCountdown(currentPlayData.gameTime, () => {
  target.value.status = 'wrong';
  isRunningGame.value = false;
  currentPlayData.point += additionalPoint.value;
  updateStatistics();
});
const playTime = computed(() => currentPlayData.gameTime - countDown.remainingTime.value);
const wpm = computed(() => (collectTypeCount.value + wrongTypeCount.value) / playTime.value * 60000);
countDown.start();

type Key = {
  key: string;
  status: 'collect' | 'wrong' | 'yet';
};
type Word = {
  keys: Key[];
  status: 'collect' | 'wrong' | 'yet';
};
type Line = {
  words: Word[];
  status: 'collect' | 'wrong' | 'yet';
};
type Target = {
  lines: Line[];
  status: 'collect' | 'wrong' | 'yet';
};

const spacePadding = (value: any, size: number): string => {
  return String(value).padStart(size, ' ');
};
const lineKeyCount = (line: Line): number => {
  return line.words.map(w => w.keys).flat().length;
};
const lineCollectKeyCount = (line: Line): number => {
  return line.words.map(w => w.keys.filter(k => k.status == 'collect')).flat().length;
};

const wordCount = 5;
const lineCount = currentPlayData.currentGameLevel.lineCount;

const target = ref<Target>({
  lines: [...Array(lineCount)].map(() => ({
    words: WordManager.sampleWords(wordCount).map(word => ({
      keys: word.split('').map(key => ({
        key,
        status: 'yet',
      })),
      status: 'yet',
    })),
    status: 'yet',
  })),
  status: 'yet',
});

const currentLineIndex = ref<number>(0);
const currentWordIndex = ref<number>(0);
const currentKeyIndex = ref<number>(0);

const updateStatistics = () => {
  const statistics = { ...currentPlayData.statistics };
  statistics.collectTypeCount += collectTypeCount.value;
  statistics.wrongTypeCount += wrongTypeCount.value;
  statistics.collectWordCount += collectWordCount.value;
  statistics.collectLineCount += collectLineCount.value;
  statistics.totalGameTime += playTime.value;
  statistics.maxWpm = Math.max(statistics.maxWpm ?? 0, wpm.value);
  statistics.totalPoint += additionalPoint.value;
  const levels = statistics.levels;
  const level = levels.find(level => level.level == currentPlayData.currentGameLevel.level);
  if (level != null) {
    if (target.value.status == 'collect') level.clearCount += 1;
    if (target.value.status == 'wrong') level.missCount += 1;
    level.totalGameTime += playTime.value;
    level.minGameTime = Math.min(level.minGameTime ?? playTime.value, playTime.value);
  }
  currentPlayData.statistics = statistics;
};

KeyManager.start((inputKey: string) => {
  if (!isRunningGame.value) {
    if (KeyManager.isSpace(inputKey)) {
      AudioManager.playSE(SoundEffects.select);
      KeyManager.deactivate();
      TimeManager.reserve({
        [800]: () => {
          KeyManager.activate();
          props.toMenuScene();
        },
      });
    } else if (currentPlayData.unlockedReplay && inputKey == 'r') {
      AudioManager.playSE(SoundEffects.select);
      KeyManager.deactivate();
      TimeManager.reserve({
        [800]: () => {
          KeyManager.activate();
          props.resetPlayScene();
        },
      });
    }
  } else if (isPaused.value) {
    if (KeyManager.isUp(inputKey)) {
      AudioManager.playSE(SoundEffects.move);
      currentPauseMenuIndex.value = (pauseMenuList.length + currentPauseMenuIndex.value - 1) % pauseMenuList.length;
      currentPauseMenu.value = pauseMenuList[currentPauseMenuIndex.value] as Menu;
    } else if (KeyManager.isDown(inputKey)) {
      AudioManager.playSE(SoundEffects.move);
      currentPauseMenuIndex.value = (pauseMenuList.length + currentPauseMenuIndex.value + 1) % pauseMenuList.length;
      currentPauseMenu.value = pauseMenuList[currentPauseMenuIndex.value] as Menu;
    } else if (KeyManager.isSelect(inputKey)) {
      AudioManager.playSE(SoundEffects.select);
      StyleManager.add(currentPauseMenu.value.style, 'blink');
      KeyManager.deactivate();
      TimeManager.reserve({
        [600]: () => {
          StyleManager.remove(currentPauseMenu.value.style, 'blink');
        },
        [800]: () => {
          KeyManager.activate();
          currentPauseMenu.value.onSelect();
        },
      });
    }
  } else if (KeyManager.isEscape(inputKey)) {
    AudioManager.playSE(SoundEffects.select);
    isPaused.value = true;
    countDown.stop();
  } else if (KeyManager.isAlphabet(inputKey)) {
    const currentLines = [...target.value.lines];
    const currentLine = currentLines[currentLineIndex.value] as Line;
    const currentWords = currentLine.words;
    const currentWord = currentWords[currentWordIndex.value] as Word;
    const currentKeys = currentWord.keys;
    const currentKey = currentKeys[currentKeyIndex.value] as Key;
    if (currentKey.key == inputKey) {
      AudioManager.playSE(SoundEffects.typing);
      additionalPoint.value += currentPlayData.keyCollectPoint;
      currentKey.status = 'collect';
      currentKeyIndex.value += 1;
      collectTypeCount.value += 1;
    } else {
      AudioManager.playSE(SoundEffects.miss);
      additionalPoint.value = Math.max(additionalPoint.value - currentPlayData.keyCollectPoint * currentPlayData.keyWrongPointRate, 0);
      currentKey.status = 'wrong';
      wrongTypeCount.value += 1;
    }
    if (currentKeyIndex.value == currentKeys.length) {
      additionalPoint.value += currentPlayData.wordCollectPoint;
      currentWord.status = 'collect';
      currentKeyIndex.value = 0
      currentWordIndex.value += 1;
      collectWordCount.value += 1;
    }
    if (currentWordIndex.value == currentWords.length) {
      additionalPoint.value += currentPlayData.lineCollectPoint;
      currentLine.status = 'collect';
      currentWordIndex.value = 0
      currentLineIndex.value += 1;
      collectLineCount.value += 1;
    }
    target.value = {
      lines: currentLines,
      status: currentLineIndex.value == currentLines.length ? 'collect' : 'yet',
    };
    if (target.value.status == 'collect') {
      countDown.stop();
      isRunningGame.value = false;
      currentPlayData.point += additionalPoint.value;
      updateStatistics();
    }
  }
});
</script>

<style scoped lang="scss">
.window.console {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.window.pause {
  width: 400px;
  height: 200px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  position: fixed;
  top: 50vh;
  left: 50vw;
  transform: translate(-50%, -50%);
}

.window.result {
  width: 400px;
  height: 200px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  position: fixed;
  top: 50vh;
  left: 50vw;
  transform: translate(-50%, -50%);
}
.result_menu {
  text-decoration: underline;
}

.info_area {
  display: flex;
  justify-content: space-between;
  padding-bottom: 12px;
  border-bottom: 1px solid $color_white;
}

.main_area {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.result_area {
  flex: 1;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.guide_area {
  width: 100%;
  display: flex;
  gap: 16px;
  padding-top: 12px;
  border-top: 1px solid $color_white;
  font-size: 14px;
}

.line {
  & {
    display: flex;
    gap: 8px;
  }
  &_index {
    width: 30px;
    text-align: right;
  }
  &_status {
    width: 30px;
    text-align: right;
    white-space: pre;
  }
  &_key_count {
    white-space: pre;
  }
  &_words {
    display: flex;
    gap: 8px;
  }
}

.current {
  text-decoration: underline;
}

.collect {
  color: $color_green;
}

.wrong {
  color: $color_red;
}

.yet {
  color: $color_white;
}
</style>
