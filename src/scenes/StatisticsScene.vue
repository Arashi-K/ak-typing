<template>
  <div class="scene">
    <div class="window main">
      <div class="info_area">
        <div>統計</div>
        <div>現在のポイント: {{ currentPlayData.point.toLocaleString() }}</div>
      </div>
      <div class="statistics_area">
        <div class="base_area">
          <div class="play_area">
            <div class="statistics">
              <div class="statistics_label">タイプ:</div>
              <div class="statistics_value">{{ toIntStr(statistics.collectTypeCount + statistics.wrongTypeCount) }}回</div>
            </div>
            <div class="statistics">
              <div class="statistics_label">正タイプ:</div>
              <div class="statistics_value">{{ toIntStr(statistics.collectTypeCount) }}回</div>
            </div>
            <div class="statistics">
              <div class="statistics_label">誤タイプ:</div>
              <div class="statistics_value">{{ toIntStr(statistics.wrongTypeCount) }}回</div>
            </div>
            <div class="statistics">
              <div class="statistics_label">正タイプ率:</div>
              <div class="statistics_value">{{ statistics.collectTypeCount + statistics.wrongTypeCount != 0 ? toFloatStr(statistics.collectTypeCount / (statistics.collectTypeCount + statistics.wrongTypeCount) * 100) : '-' }}%</div>
            </div>
            <div class="statistics">
              <div class="statistics_label">ワード完成:</div>
              <div class="statistics_value">{{ toIntStr(statistics.collectWordCount) }}回</div>
            </div>
            <div class="statistics">
              <div class="statistics_label">ライン完成:</div>
              <div class="statistics_value">{{ toIntStr(statistics.collectLineCount) }}回</div>
            </div>
            <div class="statistics">
              <div class="statistics_label">合計プレイ時間:</div>
              <div class="statistics_value">{{ toFloatStr(statistics.totalGameTime / 1000) }}秒</div>
            </div>
          </div>
          <div class="point_area">
            <div class="statistics">
              <div class="statistics_label">平均WPM:</div>
              <div class="statistics_value">{{ statistics.totalGameTime != 0 ? toFloatStr((statistics.collectTypeCount + statistics.wrongTypeCount) / statistics.totalGameTime * 60000) : '-' }}</div>
            </div>
            <div class="statistics">
              <div class="statistics_label">最高WPM:</div>
              <div class="statistics_value">{{ statistics.maxWpm != null ? toFloatStr(statistics.maxWpm) : '-' }}</div>
            </div>
            <div class="statistics">
              <div class="statistics_label">合計獲得ポイント:</div>
              <div class="statistics_value">{{ toIntStr(statistics.totalPoint) }}ポイント</div>
            </div>
            <div class="statistics">
              <div class="statistics_label">合計消費ポイント:</div>
              <div class="statistics_value">{{ toIntStr(statistics.totalUsedPoint) }}ポイント</div>
            </div>
          </div>
        </div>
        <div
          v-for="(levels, levelsIndex) in [statistics.levels.slice(0, 3), statistics.levels.slice(3, 5)]"
          :key="levelsIndex"
          class="levels_area"
        >
          <div
            v-for="(level, levelIndex) in levels"
            :key="levelIndex"
            class="level_area"
          >
            <div class="statistics_group">レベル{{ level.level }}{{ level.level > currentPlayData.maxGameLevel ? ' (未解放)' : '' }}</div>
            <div class="statistics">
              <div class="statistics_label">プレイ回数:</div>
              <div class="statistics_value">{{ toIntStr(level.clearCount + level.missCount) }}回</div>
            </div>
            <div class="statistics">
              <div class="statistics_label">クリア回数:</div>
              <div class="statistics_value">{{ toIntStr(level.clearCount) }}回</div>
            </div>
            <div class="statistics">
              <div class="statistics_label">失敗回数:</div>
              <div class="statistics_value">{{ toIntStr(level.missCount) }}回</div>
            </div>
            <div class="statistics">
              <div class="statistics_label">合計プレイ時間:</div>
              <div class="statistics_value">{{ toFloatStr(level.totalGameTime / 1000) }}秒</div>
            </div>
            <div class="statistics">
              <div class="statistics_label">最速クリアタイム:</div>
              <div class="statistics_value">{{ level.minGameTime != null ? toFloatStr(level.minGameTime / 1000) : '-' }}秒</div>
            </div>
          </div>
        </div>
      </div>
      <div class="guide_area">
        <div class="guide">メニューに戻る: Space</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { KeyManager } from '@/lib/key_manager';
import { AudioManager, SoundEffects } from '@/lib/audio_manager';
import { TimeManager } from '@/lib/time_manager';
import { currentPlayData } from '@/resources/play_data';

interface Props {
  toMenuScene: () => void;
};

const props = defineProps<Props>();

const statistics = computed(() => currentPlayData.statistics);

const toIntStr = (num: number) => num.toLocaleString();
const toFloatStr = (num: number) => Number(num.toFixed(1)).toLocaleString();

KeyManager.start((inputKey: string) => {
  if (KeyManager.isSpace(inputKey)) {
    AudioManager.playSE(SoundEffects.select);
    KeyManager.deactivate();
    TimeManager.reserve({
      [800]: () => {
        KeyManager.activate();
        props.toMenuScene();
      },
    });
  }
});
</script>

<style scoped lang="scss">
.window.main {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info_area {
  display: flex;
  justify-content: space-between;
  padding-bottom: 12px;
  border-bottom: 1px solid $color_white;
}

.statistics_area {
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 12px;
  font-size: 12px;
}

.base_area {
  flex: 2;
  display: flex;
  gap: 12px;
}

.play_area {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-right: 12px;
  border-right: 1px solid $color_white;
}

.point_area {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.levels_area {
  flex: 1;
  display: flex;
  gap: 12px;
  padding-top: 12px;
  border-top: 1px solid $color_white;
}

.level_area {
  min-width: 200px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-right: 12px;
  border-right: 1px solid $color_white;
}

.statistics {
  & {
    display: flex;
    justify-content: space-between;
    gap: 24px;
  }
}

.guide_area {
  display: flex;
  gap: 16px;
  padding-top: 12px;
  border-top: 1px solid $color_white;
  font-size: 14px;
}
</style>
