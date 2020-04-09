import React from "react";
import { Counter } from "./Counter";

export function CounterStory({ value = 1, setValue }: { value: number; setValue: any }) {
  return <Counter value={Number(value)} onClick={setValue} />;
}
