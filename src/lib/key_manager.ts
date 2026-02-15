export type Alphabet
  = 'a'
  | 'b'
  | 'c'
  | 'd'
  | 'e'
  | 'f'
  | 'g'
  | 'h'
  | 'i'
  | 'j'
  | 'k'
  | 'l'
  | 'm'
  | 'n'
  | 'o'
  | 'p'
  | 'q'
  | 'r'
  | 's'
  | 't'
  | 'u'
  | 'v'
  | 'w'
  | 'x'
  | 'y'
  | 'z'
export const Alphabets: Alphabet[] = [
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
  'm',
  'n',
  'o',
  'p',
  'q',
  'r',
  's',
  't',
  'u',
  'v',
  'w',
  'x',
  'y',
  'z',
];

let isActiveKeyInput = true;
export const KeyManager = {
  start(callback: (inputKey: string) => void) {
    const listener = (e: KeyboardEvent) => {
      if (isActiveKeyInput) {
        callback(e.key);
      }
    };
    onMounted(() => {
      window.addEventListener('keydown', listener);
    });
    onUnmounted(() => {
      window.removeEventListener('keydown', listener);
    })
  },
  activate() {
    isActiveKeyInput = true;
  },
  deactivate() {
    isActiveKeyInput = false;
  },
  isAlphabet(key: string) {
    return (Alphabets as string[]).includes(key);
  },
  isBackspace(key: string) {
    return key == 'Backspace';
  },
  isEscape(key: string) {
    return key == 'Escape';
  },
  isEnter(key: string) {
    return key == 'Enter';
  },
  isSpace(key: string) {
    return key == ' ';
  },
  isUp(key: string) {
    return key == 'k' || key == 'ArrowUp';
  },
  isDown(key: string) {
    return key == 'j' || key == 'ArrowDown';
  },
  isLeft(key: string) {
    return key == 'h' || key == 'ArrowLeft';
  },
  isRight(key: string) {
    return key == 'l' || key == 'ArrowRight';
  },
  isSelect(key: string) {
    return this.isEnter(key) || this.isSpace(key);
  },
};
