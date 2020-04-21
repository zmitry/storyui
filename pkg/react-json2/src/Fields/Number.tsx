import React, { useRef, forwardRef } from "react";
import { Merge } from "ts-essentials";
import { mergeRefs } from "../utils";
import { useValue } from "./Text";

export const NumberField = forwardRef(function TextField(
  {
    defaultValue,
    className = "",
    onBlur,
    name = "",
  }: Merge<
    React.HTMLAttributes<HTMLInputElement>,
    {
      defaultValue?: number;
      name?: string;
      onBlur: (evt: any, value: number) => void;
    }
  >,
  ref: any
) {
  const innerRef = useRef(null);
  const type = "number";
  const [value, setValue] = useValue(defaultValue);
  const classNameComposed = [type, className].join(" ");
  const w = value ? Math.min(Math.max((String(value) || "").length, 2), 20) : 5;

  const onBlurInternal = (e) => {
    onBlur && onBlur(e, parseFloat(value));
    innerRef.current.blur();
  };
  return (
    <input
      name={name}
      ref={mergeRefs([ref, innerRef])}
      onClick={() => {
        innerRef.current.select();
      }}
      className={classNameComposed}
      value={value}
      placeholder="empty"
      onChange={(e) => {
        setValue(e.target.value);
      }}
      onBlur={onBlurInternal}
      style={{ width: w + 2 + "ch" }}
      type={type}
      onKeyDown={(e) => {
        if (e.which === 13) {
          onBlurInternal(e);
        }
      }}
    />
  );
});
