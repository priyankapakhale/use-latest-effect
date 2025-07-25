import { act, cleanup, render } from "@testing-library/react";
import { TestComponent } from "./TestComponent";

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
});
