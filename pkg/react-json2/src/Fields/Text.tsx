import React, {
  useState,
  useRef,
  createContext,
  useLayoutEffect,
  forwardRef,
} from "react";
import { Merge } from "ts-essentials";
import { mergeRefs } from "../utils";

export function useValue(defaultValue) {
  const [value, setValue] = useState(defaultValue);
  useLayoutEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);
  return [value, setValue] as const;
}

export const TextField = forwardRef(function TextField(
  {
    defaultValue,
    className = "",
    onBlur,
    name = "",
    type = "text",
    placeholder = "empty",
  }: Merge<
    React.HTMLAttributes<HTMLInputElement>,
    {
      defaultValue?: string;
      name?: string;
      onBlur: (evt: any, value: string) => void;
      type?: string;
    }
  >,
  ref: any
) {
  const innerRef = useRef(null);
  /* eslint-disable react-hooks/rules-of-hooks */
  const [value, setValue] = useState(defaultValue);
  const classNameComposed = [type, className].join(" ");
  const w = value ? (value || "").length : 5;
  const onBlurInternal = (e) => {
    onBlur && onBlur(e, value);
  };
  const onFakeBlurInternal = (e) => {
    onBlur && onBlur(e, value);
    innerRef.current.blur();
  };

  useLayoutEffect(() => {
    if (type === "text") {
      setValue(defaultValue);
    }
  }, [defaultValue, type]);

  // useLayoutEffect(() => {
  //   if (!defaultValue) {
  //     innerRef.current.focus();
  //   }
  // }, [defaultValue]);
  return (
    <input
      name={name}
      ref={mergeRefs([ref, innerRef])}
      onClick={(e) => {
        innerRef.current.select();
      }}
      className={classNameComposed}
      style={type === "text" ? { width: w + 0.5 + "ch" } : {}}
      value={value}
      placeholder={placeholder}
      onChange={(e) => {
        setValue(e.target.value);
        console.log("type: ", type);
        if (type !== "text") {
          onFakeBlurInternal(e);
        }
        innerRef.current.setCustomValidity("");
      }}
      type={type}
      onBlur={onBlurInternal}
      onKeyDown={(e) => {
        if (e.which == 13) {
          onFakeBlurInternal(e);
        }
      }}
    />
  );
});

export const NullField = forwardRef(function NullField(
  {
    defaultValue,
    ...rest
  }: Merge<
    React.HTMLAttributes<HTMLInputElement>,
    {
      defaultValue?: null | undefined | number;
      name?: string;
      onBlur: (evt: any, value: string) => void;
      type?: string;
    }
  >,
  ref: any
) {
  let value = "";
  let placeholder = "empty";
  if (defaultValue === null) {
    placeholder = "null";
  } else if (defaultValue === undefined) {
    placeholder = "undefined";
  } else if (isNaN(defaultValue)) {
    placeholder = "NaN";
  } else {
    value = String(defaultValue);
  }
  return (
    <TextField
      {...rest}
      defaultValue={value}
      ref={ref}
      placeholder={placeholder}
    />
  );
});
