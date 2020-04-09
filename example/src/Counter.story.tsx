import React from "react";
import { Counter } from "./Counter";

export default {
  // export your component docs
  component: Counter,
  // add link to your design spec for component
  figma:
    "https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2FzcnOkkdAZioZuzahrXbaKi%2FUntitled%3Fnode-id%3D1%253A11"
};
// props ui is automatically generated based on your function signature
export function CounterStory({
  value = 1,
  setValue,
  color,
  setColor
}: {
  value: number;
  // set + property name is automatically generated setter for value
  setValue: any;
  setColor: any;
  color: string;
}) {
  return (
    <div>
      <button
        onClick={() => {
          setColor("red");
          setValue(2);
        }}
      >
        set color red and value 2
      </button>
      <Counter value={Number(value)} onClick={setValue} style={{ color }} />
    </div>
  );
}
