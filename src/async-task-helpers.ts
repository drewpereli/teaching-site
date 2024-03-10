export function setIntervalPausable(fn: () => unknown, interval: number) {
  const createGenerator = function* () {
    while (true) {
      yield new Promise<void>((res) => {
        setTimeout(() => {
          res();
        }, interval);
      });

      fn();
    }
  };

  const generator = createGenerator();

  let isPaused = false;

  const run = async () => {
    while (!isPaused) {
      await generator.next().value;
    }
  };

  const pause = () => {
    isPaused = true;
  };

  const resume = () => {
    if (!isPaused) return;
    isPaused = false;
    run();
  };

  run();

  return { pause, resume };
}

export function debounced(fn: () => void, ms: number) {
  let timeoutId: number | undefined;

  return () => {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(fn, ms);
  };
}
