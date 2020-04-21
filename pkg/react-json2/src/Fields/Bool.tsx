import React, { useRef, forwardRef } from "react";
import { Merge } from "ts-essentials";
import { mergeRefs } from "../utils";
import { useValue } from "./Text";

export const BoolField = forwardRef(function TextField(
  {
    defaultValue,
    className = "",
    onBlur,
    name = "",
  }: Merge<
    React.HTMLAttributes<HTMLInputElement>,
    {
      defaultValue?: boolean;
      name?: string;
      onBlur: (evt: any, value: boolean) => void;
    }
  >,
  ref: any
) {
  const innerRef = useRef(null);

  const [value, setValue] = useValue(defaultValue);
  const classNameComposed = ["checkbox", className].join(" ");

  const valueAsStr = value ? "true" : "false";
  return (
    <label className="checkbox-label">
      <input
        name={name}
        ref={mergeRefs([innerRef, ref])}
        className={classNameComposed}
        checked={value}
        placeholder="empty"
        onChange={(e) => {
          const v = e.target.checked;
          setValue(v);
          onBlur && onBlur(e, v);
        }}
        aria-checked={valueAsStr}
        type="checkbox"
      />
      {valueAsStr}
    </label>
  );
});
