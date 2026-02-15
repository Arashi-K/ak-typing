export const TimeManager = {
  reserve(timeouts: Record<number, () => void>) {
    Object.entries(timeouts).forEach(([duration, callback]) => {
      setTimeout(callback, Number(duration));
    });
  },
  useCountdown(time: number, onFinished: () => void) {
    const isRunning = ref<boolean>(false);
    const remainingTime = ref<number>(time);
    const endTime = ref(Date.now() + time);
    let animationFrameId: number | null = null;

    const update = () => {
      if (!isRunning.value) {
        return;
      }

      remainingTime.value = Math.max(endTime.value - Date.now(), 0)
      if (remainingTime.value <= 0) {
        stop();
        onFinished();
      }

      animationFrameId = requestAnimationFrame(update)
    };

    const incrementTime = (time: number) => {
      if (isRunning.value) {
        endTime.value += time;
      } else {
        remainingTime.value += time;
      }
    };

    const start = () => {
      if (isRunning.value) {
        return;
      }

      endTime.value = Date.now() + remainingTime.value
      isRunning.value = true
      update()
    };

    const stop = () => {
      if (!isRunning.value) {
        return;
      }

      isRunning.value = false
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };

    const reset = () => {
      stop();
      remainingTime.value = time;
    };

    onMounted(() => {
      update()
    });

    onUnmounted(() => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    });

    return {
      remainingTime,
      start,
      stop,
      reset,
      incrementTime,
    };
  },
};
