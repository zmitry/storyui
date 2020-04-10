import React from "react";
import { Input } from "./Input";

export function InputStory() {
  return (
    <div>
      <Input label="hello" type="text" />
      <Input label="hello2" type="textarea" />
    </div>
  );
}
