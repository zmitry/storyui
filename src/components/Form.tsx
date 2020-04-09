import React from "react";
import { Input } from "./Input";

// type Type =
//   | "text"
//   | "boolean"
//   | "number"
//   | "color"
//   | "object"
//   | "array"
//   | "date"
//   | "button";

//   | "files"
//   | "options"
//   | "radio"
//   | "select"

export interface FieldProps {
  type: string;
  label: string;
  onChange: (v) => void;
  value: string;

  onButtonClick?: () => void;
}

function format(value) {
  try {
    return JSON.stringify(JSON.parse(value), null, 2);
  } catch (v) {
    return value;
  }
}

export function Field(props: FieldProps) {
  switch (props.type) {
    case "text":
    case "number":
    case "color":
    case "date":
      return (
        <Input
          label={props.label}
          type={props.type}
          value={props.value}
          onChange={v => {
            console.log(v);
            return props.onChange(v.target.value);
          }}
        />
      );
    case "object":
    case "array":
      return (
        <Input
          label={props.label}
          type={"textarea"}
          value={format(props.value)}
          onChange={v => props.onChange(v.target.value)}
        />
      );
    case "button":
      return <button onClick={props.onButtonClick}>{props.label}</button>;
  }

  return (
    <Input
      label={props.label}
      type={props.type}
      value={props.value}
      onChange={v => props.onChange(v.target.value)}
    />
  );
}
