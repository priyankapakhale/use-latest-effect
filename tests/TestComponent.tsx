import React from "react";
import { useLatestEffect } from "../src/useLatestEffect";

export interface TestComponentProps {
  id: number;
  onComplete: (wonId: number) => void;
}

/**
 * A tiny component that drives the hook under test.
 * It never renders anything visible.
 */
export const TestComponent: React.FC<TestComponentProps> = ({
  id,
  onComplete,
}) => {
  useLatestEffect(
    async (isLatest, signal) => {
      // simulate a 100ms delay
      await new Promise((res) => setTimeout(res, 100));
      if (isLatest()) {
        onComplete(id);
      }
    },
    [id],
    { abortable: true }
  );

  return null;
};
