import { useEffect, useRef, DependencyList } from "react";

export interface UseLatestEffectOptions {
  abortable?: boolean; // default: true
  cleanup?: () => void;
}

export function useLatestEffect(
  effect: (
    isLatest: () => boolean,
    signal: AbortSignal
  ) => Promise<void> | void,
  deps: DependencyList,
  options: UseLatestEffectOptions = {}
) {
  const { abortable = true, cleanup } = options;
  const latestRef = useRef(0);

  useEffect(() => {
    latestRef.current += 1;
    const callId = latestRef.current;
    let cancelled = false;

    const controller = new AbortController();
    const signal = controller.signal;

    const isLatest = () => !cancelled && callId === latestRef.current;

    (async () => {
      try {
        await effect(isLatest, signal);
      } catch (err) {
        if (!(err instanceof DOMException && err.name === "AbortError")) {
          throw err;
        }
      }
    })();

    return () => {
      cancelled = true;
      if (abortable) {
        controller.abort();
      }
      cleanup?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
