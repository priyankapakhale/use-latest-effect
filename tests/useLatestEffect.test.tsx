import { act, cleanup, render } from "@testing-library/react";
import { TestComponent } from "./TestComponent";
import { useLatestEffect } from "../src";

describe("useLatestEffect", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    cleanup();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it("only the latest async invocation wins", async () => {
    const calls: number[] = [];

    const { rerender } = render(
      <TestComponent id={1} onComplete={(v) => calls.push(v)} />
    );

    rerender(<TestComponent id={2} onComplete={(v) => calls.push(v)} />);

    await act(async () => {
      jest.advanceTimersByTime(200);
      await Promise.resolve();
    });

    expect(calls).toEqual([2]);
  });

  it("runs cleanup callback on dependency change", () => {
    const cleanupSpy = jest.fn();
    const CleanupComponent: React.FC<{ value: number }> = ({ value }) => {
      useLatestEffect(() => {}, [value], { cleanup: cleanupSpy });
      return null;
    };

    const { rerender } = render(<CleanupComponent value={1} />);
    rerender(<CleanupComponent value={2} />);

    expect(cleanupSpy).toHaveBeenCalledTimes(1);
  });

  it("aborts in-flight effect on dependency change", () => {
    let abortedCount = 0;
    const AbortOnChange: React.FC<{ value: number }> = ({ value }) => {
      useLatestEffect(
        (_, signal) => {
          signal.addEventListener("abort", () => {
            abortedCount++;
          });
          return new Promise(() => {});
        },
        [value],
        { abortable: true }
      );
      return null;
    };

    const { rerender } = render(<AbortOnChange value={1} />);
    rerender(<AbortOnChange value={2} />);

    expect(abortedCount).toBe(1);
  });

  it("aborts in-flight effect on unmount", () => {
    let abortedCount = 0;
    const AbortOnUnmount: React.FC = () => {
      useLatestEffect(
        (_, signal) => {
          signal.addEventListener("abort", () => {
            abortedCount++;
          });
          return new Promise(() => {});
        },
        [],
        { abortable: true }
      );
      return null;
    };

    const { unmount } = render(<AbortOnUnmount />);
    unmount();

    expect(abortedCount).toBe(1);
  });

  it("does not abort when abortable is false", () => {
    let aborted = false;
    const NoAbort: React.FC = () => {
      useLatestEffect(
        (_, signal) => {
          signal.addEventListener("abort", () => {
            aborted = true;
          });
          return new Promise(() => {});
        },
        [],
        { abortable: false }
      );
      return null;
    };

    const { unmount } = render(<NoAbort />);
    unmount();

    expect(aborted).toBe(false);
  });

  it("only the last of multiple rapid runs wins", async () => {
    const calls: number[] = [];
    const { rerender } = render(
      <TestComponent id={1} onComplete={(v) => calls.push(v)} />
    );
    rerender(<TestComponent id={2} onComplete={(v) => calls.push(v)} />);
    rerender(<TestComponent id={3} onComplete={(v) => calls.push(v)} />);

    await act(async () => {
      jest.runAllTimers();
      await Promise.resolve();
    });
    expect(calls).toEqual([3]);
  });

  it("runs cleanup on unmount even when abortable is false", () => {
    const spy = jest.fn();

    const CleanupComponent: React.FC = () => {
      useLatestEffect(() => {}, [], { abortable: false, cleanup: spy });
      return null;
    };

    const { unmount } = render(<CleanupComponent />);
    unmount();

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("runs cleanup on dep change when abortable is false", () => {
    const spy = jest.fn();

    const CleanupComponent: React.FC<{ value: number }> = ({ value }) => {
      useLatestEffect(() => {}, [value], { abortable: false, cleanup: spy });
      return null;
    };

    const { rerender } = render(<CleanupComponent value={1} />);
    rerender(<CleanupComponent value={2} />);

    expect(spy).toHaveBeenCalledTimes(1);
  });
});
