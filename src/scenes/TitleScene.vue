<template>
  <div class="scene">
    <div class="window main">
      <div class="title">AK Typing</div>
      <div class="subtitle" :class="subtitleStyle">> Press Space To Start</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { KeyManager } from '@/lib/key_manager';
import { AudioManager, BackGroundMusics, SoundEffects } from '@/lib/audio_manager';
import { StyleManager } from '@/lib/style_manager';
import { TimeManager } from '@/lib/time_manager';

interface Props {
  toMenuScene: () => void;
};

const props = defineProps<Props>();
const subtitleStyle = StyleManager.style();

KeyManager.start((inputKey: string) => {
  if (KeyManager.isSpace(inputKey)) {
    AudioManager.playSE(SoundEffects.select);
    StyleManager.add(subtitleStyle, 'blink');
    KeyManager.deactivate();
    TimeManager.reserve({
      [600]: () => {
        StyleManager.remove(subtitleStyle, 'blink');
      },
      [800]: () => {
        KeyManager.activate();
        if (!AudioManager.isPlayingBGM()) {
          AudioManager.changeBGM(BackGroundMusics.scene1);
          AudioManager.startBGM();
        }
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
  align-items: center;
  justify-content: center;
  gap: 60px;
}

.title {
  font-size: 48px;
  font-weight: bold;
}

.subtitle {
  font-size: 18px;
  text-decoration: underline;
}
</style>
