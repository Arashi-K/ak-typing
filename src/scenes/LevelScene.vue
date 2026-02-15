<template>
  <div class="scene">
    <div class="window main">
      <div class="info_area">
        <div>現在のポイント: {{ currentPlayData.point.toLocaleString() }}</div>
      </div>
      <div class="main_area">
        <div
          v-for="(menu, menuIndex) in menuList"
          :key="menuIndex"
          class="menu"
          :class="[menu.style, { current: menuIndex == currentMenuIndex }]"
        >> {{ menu.text }}</div>
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
import { BuildData } from '@/resources/build_data';
import { currentPlayData } from '@/resources/play_data';

interface Props {
  toPlayScene: () => void;
  toMenuScene: () => void;
};
const props = defineProps<Props>();

type Menu = {
  text: string;
  onSelect: () => void;
  style: StyleState;
};
const menuList: Menu[] = [
  ...BuildData.levels.filter(level => level.level <= currentPlayData.maxGameLevel).reverse().map(level => ({
    text: `レベル${level.level}`,
    onSelect: () => {
      currentPlayData.currentGameLevel = level;
      props.toPlayScene();
    },
    style: StyleManager.style(),
  })),
  {
    text: 'メニューに戻る',
    onSelect: () => {
      props.toMenuScene();
    },
    style: StyleManager.style(),
  },
];
const currentMenuIndex = ref<number>(0);
const currentMenu = ref<Menu>(menuList[0] as Menu);

KeyManager.start((inputKey: string) => {
  if (KeyManager.isUp(inputKey)) {
    AudioManager.playSE(SoundEffects.move);
    currentMenuIndex.value = (menuList.length + currentMenuIndex.value - 1) % menuList.length;
    currentMenu.value = menuList[currentMenuIndex.value] as Menu;
  } else if (KeyManager.isDown(inputKey)) {
    AudioManager.playSE(SoundEffects.move);
    currentMenuIndex.value = (menuList.length + currentMenuIndex.value + 1) % menuList.length;
    currentMenu.value = menuList[currentMenuIndex.value] as Menu;
  } else if (KeyManager.isSelect(inputKey)) {
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
  flex-direction: column;
  gap: 12px;
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
