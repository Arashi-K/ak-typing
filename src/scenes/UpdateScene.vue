<template>
  <div class="scene">
    <div class="window main">
      <div class="info_area">
        <div>現在のポイント: {{ currentPlayData.point.toLocaleString() }}</div>
      </div>
      <div class="main_area">
        <div class="menu_area">
          <div
            v-for="(menu, menuIndex) in menuList"
            :key="menuIndex"
            class="menu"
            :class="[menu.style, { current: menuIndex == currentMenuIndex }]"
          >> {{ menu.text }}</div>
        </div>
        <div class="update_area">
          <template v-if="currentUpdateKey != null">
            <div class="description_area">
              <div>{{ currentUpdateCategory!.description }}</div>
            </div>
            <div class="grade_area">
              <template v-if="currentUpdateCategoryCompleted">
                <div>すべてのアップデートを完了しています</div>
              </template>
              <template v-else>
                <div>アップデート内容:</div>
                <div>{{ currentUpdateGrade!.text }}</div>
                <div />
                <div>必要ポイント: {{ currentUpdateGrade!.requirePoint.toLocaleString() }}</div>
              </template>
            </div>
          </template>
        </div>
      </div>
      <div class="guide_area">
        <div class="guide">上に移動: k/↑</div>
        <div class="guide">下に移動: j/↓</div>
        <div class="guide">決定: Space/Enter</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AudioManager, SoundEffects } from '@/lib/audio_manager';
import { KeyManager } from '@/lib/key_manager';
import { StyleManager, type StyleState } from '@/lib/style_manager';
import { TimeManager } from '@/lib/time_manager';
import { updateCategories, type UpdateKeys } from '@/resources/build_data/updates';
import { currentPlayData } from '@/resources/play_data';

interface Props {
  toMenuScene: () => void;
};
const props = defineProps<Props>();

type Menu = {
  text: string;
  onPoint?: () => void;
  onSelect: () => void;
  selectable: () => boolean;
  style: StyleState;
};
const menuList = computed<Menu[]>(() => [
  ...Object.entries(updateCategories).map(([key, category]) => ({
    text: `${category.title} (${currentPlayData.updateGrades[key as UpdateKeys]}/${category.updateGrades.length})`,
    onPoint: () => {
      currentUpdateKey.value = key as UpdateKeys;
    },
    onSelect: () => {
      if (currentUpdateCategoryCompleted.value) return;
      const requirePoint = currentUpdateGrade.value!.requirePoint;
      if (requirePoint <= currentPlayData.point ) {
        currentPlayData.point -= requirePoint;
        currentUpdateGrade.value!.process(currentPlayData);
        const updateGrades = currentPlayData.updateGrades;
        updateGrades[currentUpdateKey.value!] += 1;
        currentPlayData.updateGrades = updateGrades;
        const statistics = { ...currentPlayData.statistics };
        statistics.totalUsedPoint += requirePoint;
        currentPlayData.statistics = statistics;
      }
    },
    selectable: () => {
      if (currentUpdateCategoryCompleted.value) return false;
      const requirePoint = currentUpdateGrade.value!.requirePoint;
      return requirePoint <= currentPlayData.point;
    },
    style: StyleManager.style(),
  })),
  {
    text: 'メニューに戻る',
    onPoint: () => {
      currentUpdateKey.value = null;
    },
    onSelect: () => {
      props.toMenuScene();
    },
    selectable: () => true,
    style: StyleManager.style(),
  },
]);
const currentMenuIndex = ref<number>(0);
const currentMenu = ref<Menu>(menuList.value[0] as Menu);
const currentUpdateKey = ref<UpdateKeys | null>(null);
const currentUpdateCategory = computed(() =>
  currentUpdateKey.value != null
    ? updateCategories[currentUpdateKey.value]
    : null
);
const currentUpdateCategoryCompleted = computed(() =>
  currentUpdateKey.value != null && currentPlayData.updateGrades[currentUpdateKey.value!] >= currentUpdateCategory.value!.updateGrades.length
);
const currentUpdateGrade = computed(() =>
  currentUpdateKey.value != null && !currentUpdateCategoryCompleted.value
    ? currentUpdateCategory.value!.updateGrades[currentPlayData.updateGrades[currentUpdateKey.value]]
    : null
);

menuList.value[0]?.onPoint?.();

KeyManager.start((inputKey: string) => {
  if (KeyManager.isUp(inputKey)) {
    AudioManager.playSE(SoundEffects.move);
    currentMenuIndex.value = (menuList.value.length + currentMenuIndex.value - 1) % menuList.value.length;
    currentMenu.value = menuList.value[currentMenuIndex.value] as Menu;
    currentMenu.value.onPoint?.();
  } else if (KeyManager.isDown(inputKey)) {
    AudioManager.playSE(SoundEffects.move);
    currentMenuIndex.value = (menuList.value.length + currentMenuIndex.value + 1) % menuList.value.length;
    currentMenu.value = menuList.value[currentMenuIndex.value] as Menu;
    currentMenu.value.onPoint?.();
  } else if (KeyManager.isSelect(inputKey)) {
    if (currentMenu.value.selectable()) {
      AudioManager.playSE(SoundEffects.select);
      StyleManager.add(currentMenu.value.style, 'blink');
      KeyManager.deactivate();
      TimeManager.reserve({
        [600]: () => {
          StyleManager.remove(currentMenu.value.style, 'blink');
        },
        [800]: () => {
          KeyManager.activate();
          currentMenu.value.onSelect();
        },
      });
    } else {
      AudioManager.playSE(SoundEffects.miss);
    }
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
  justify-content: flex-end;
  padding-bottom: 12px;
  border-bottom: 1px solid $color_white;
}

.main_area {
  flex: 1;
  display: flex;
  gap: 12px;
}

.menu_area {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  border-right: 1px solid $color_white;
}

.update_area {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.description_area {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  font-size: 14px;
  border-bottom: 1px solid $color_white;
}

.grade_area {
  flex: 3;
  display: flex;
  flex-direction: column;
  gap: 12px;
  font-size: 14px;
}

.guide_area {
  display: flex;
  gap: 16px;
  padding-top: 12px;
  border-top: 1px solid $color_white;
  font-size: 14px;
}

.current {
  text-decoration: underline;
}
</style>
