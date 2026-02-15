import typingSE from '@/assets/sounds/effects/typing.mp3';
import selectSE from '@/assets/sounds/effects/select.mp3';
import missSE from '@/assets/sounds/effects/miss.mp3';
import moveSE from '@/assets/sounds/effects/move.mp3';
import scene1BGM from '@/assets/sounds/backgrounds/scene1.mp3';
import { currentPlayData } from '@/resources/play_data';

export const SoundEffects = {
  typing: typingSE,
  select: selectSE,
  miss: missSE,
  move: moveSE,
};
export const BackGroundMusics = {
  scene1: scene1BGM,
};
type SoundEffect = typeof SoundEffects[keyof typeof SoundEffects];
type BackGroundMusic = typeof SoundEffects[keyof typeof SoundEffects];
type Sound = SoundEffect | BackGroundMusic;

const audioContext = new AudioContext();
let currentBGM: BackGroundMusic | null = null;
let currentBGMSource: AudioBufferSourceNode | null = null;

const loadBuffer = async (sound: Sound): Promise<AudioBuffer> => {
  const res = await fetch(sound);
  const arrayBuffer = await res.arrayBuffer();
  return await audioContext.decodeAudioData(arrayBuffer);
};

const soundEffectBuffers: { [K in SoundEffect]: AudioBuffer } = {
  [SoundEffects.typing]: await loadBuffer(SoundEffects.typing),
  [SoundEffects.select]: await loadBuffer(SoundEffects.select),
  [SoundEffects.miss]: await loadBuffer(SoundEffects.miss),
  [SoundEffects.move]: await loadBuffer(SoundEffects.move),
};

const backGroundMusicBuffers: { [K in BackGroundMusic]: AudioBuffer } = {
  [BackGroundMusics.scene1]: await loadBuffer(BackGroundMusics.scene1),
};

export const AudioManager = {
  playSE(soundEffect: SoundEffect) {
    if (!currentPlayData.seVolume) {
      return;
    }
    const buffer = soundEffectBuffers[soundEffect] as AudioBuffer;
    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContext.destination);
    source.start();
  },
  isPlayingBGM() {
    return !!currentBGMSource;
  },
  changeBGM(backGroundMusic: BackGroundMusic) {
    currentBGM = backGroundMusic;
    if (currentBGMSource) {
      this.stopBGM();
    }
    this.startBGM();
  },
  startBGM() {
    if (!currentBGM) {
      return;
    }
    if (currentBGMSource != null) {
      return;
    }
    if (!currentPlayData.bgmVolume) {
      return;
    }
    const buffer = backGroundMusicBuffers[currentBGM] as AudioBuffer;
    currentBGMSource = audioContext.createBufferSource();
    currentBGMSource.buffer = buffer;
    currentBGMSource.loop = true;
    currentBGMSource.connect(audioContext.destination);
    currentBGMSource.start();
  },
  stopBGM() {
    if (currentBGMSource) {
      currentBGMSource.stop();
      currentBGMSource.disconnect();
      currentBGMSource = null;
    }
  },
};
