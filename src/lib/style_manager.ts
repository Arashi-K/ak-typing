export type StyleState = { [K in CommonStyle]: boolean };

export type CommonStyle = 'blink';

export const StyleManager = {
  style(): StyleState {
    return reactive({
      'blink': false,
    });
  },
  add(style: StyleState, commonStyle: CommonStyle) {
    style[commonStyle] = true;
  },
  remove(style: StyleState, commonStyle: CommonStyle) {
    style[commonStyle] = false;
  },
  toggle(style: StyleState, commonStyle: CommonStyle, duration?: number) {
    style[commonStyle] = true;

    if (duration) {
      setTimeout(() => {
        style[commonStyle] = false;
      }, duration);
    }
  },
};
