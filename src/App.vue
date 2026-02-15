<template>
  <div class="root">
    <div class="header">
      <div class="volumes">
        <div class="volume" @click="handleClickSEVolume">
          <div>SE:</div>
          <img v-if="currentPlayData.seVolume" class="icon" src="/src/assets/images/volume_on.svg">
          <img v-else class="icon" src="/src/assets/images/volume_off.svg">
        </div>
        <div class="volume" @click="handleClickBGMVolume">
          <div>BGM:</div>
          <img v-if="currentPlayData.bgmVolume" class="icon" src="/src/assets/images/volume_on.svg">
          <img v-else class="icon" src="/src/assets/images/volume_off.svg">
        </div>
      </div>
    </div>
    <TitleScene
      v-if="currentScene == 'TitleScene'"
      :toMenuScene="toScene('MenuScene')"
    />
    <MenuScene
      v-if="currentScene == 'MenuScene'"
      :toTitleScene="toScene('TitleScene')"
      :toUpdateScene="toScene('UpdateScene')"
      :toLevelScene="toScene('LevelScene')"
    />
    <UpdateScene
      v-if="currentScene == 'UpdateScene'"
      :toMenuScene="toScene('MenuScene')"
    />
    <LevelScene
      v-if="currentScene == 'LevelScene'"
      :toMenuScene="toScene('MenuScene')"
      :toPlayScene="toScene('PlayScene')"
    />
    <PlayScene
      v-if="currentScene == 'PlayScene'"
      :key="playSceneKey"
      :toMenuScene="toScene('MenuScene')"
      :resetPlayScene="resetPlayScene"
    />
  </div>
</template>

<script setup lang="ts">
import { AudioManager } from './lib/audio_manager';
import { currentPlayData } from './resources/play_data';
import LevelScene from './scenes/LevelScene.vue';
import MenuScene from './scenes/MenuScene.vue';
import PlayScene from './scenes/PlayScene.vue';
import TitleScene from './scenes/TitleScene.vue';
import UpdateScene from './scenes/UpdateScene.vue';

type Scenes = 'TitleScene' | 'MenuScene' | 'UpdateScene' | 'LevelScene' | 'PlayScene'

const currentScene = ref<Scenes>('TitleScene');
const toScene = (scene: Scenes) => () => currentScene.value = scene;

const handleClickSEVolume = () => {
  currentPlayData.seVolume = !currentPlayData.seVolume;
};
const handleClickBGMVolume = () => {
  if (currentPlayData.bgmVolume) {
    currentPlayData.bgmVolume = false;
    AudioManager.stopBGM();
  } else {
    currentPlayData.bgmVolume = true;
    AudioManager.startBGM();
  }
};

const playSceneKey = ref<string>(crypto.randomUUID());
const resetPlayScene = () => {
  playSceneKey.value = crypto.randomUUID();
};
</script>

<style scoped lang="scss">
.root {
  width: 100vw;
  height: 100vh;
  background-color: $color_black;
  padding: 120px calc(50vw - 400px);
  box-sizing: border-box;
}

.header {
  width: 100vw;
  height: 64px;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 24px 24px 0;
  box-sizing: border-box;
}

.volumes {
  display: flex;
  gap: 24px;
}

.volume {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.icon {
  width: 30px;
  height: 30px;
}
</style>
