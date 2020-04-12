import React from "react";
import { Input } from "./Input";

// type Type =
//   | "text"
//   | "boolean"
//   | "number"
//   | "color"
//   | "date"

//TODO
//   | "object"
//   | "files"
//   | array
//   | "options"
//   | "radio"
//   | "select"
//   | "button";

/**
 * idea 1
 * json input = object, array
 * select with one of, many +expand/collapse = select, options, radio
 * files = files
 */
export interface FieldProps {
  type: string;
  label: string;
  onChange: (v) => void;
  value: string;
  helper?: string;

  onButtonClick?: () => void;
}

const getTypeInfo = (type: string) => {
  switch (type) {
    case "Date":
      return {
        input: "date",
        type: type,
        getValue: t => new Date(t.valueAsNumber),
        formatValue: d => {
          d = d || new Date();
          return d.toJSON().slice(0, 10);
        },
        defaultVal: new Date()
      };
    case "boolean":
    case "Boolean":
      return {
        input: "checkbox",
        type: type,
        formatValue: v => v,
        getValue: d => Boolean(d.checked)
      };
    case "number":
      return {
        input: "number",
        type: type,
        formatValue: v => v,
        getValue: d => Number(d.value)
      };
    case "color":
      return {
        input: "color",
        type: type,
        formatValue: v => v,
        getValue: d => d.value
      };
    default:
      return {
        input: "text",
        type: type,
        formatValue: v => v,
        getValue: d => d.value
      };
  }
};

function getTypeByDefaultValue(val: string) {
  try {
    if (val.startsWith("#") && (val.length === 4 || val.length === 7)) {
      return "color";
    }
    return typeof JSON.parse(val);
  } catch (e) {
    return "string";
  }
}
export function Field(props: FieldProps) {
  const type = props.type || getTypeByDefaultValue(props.value);
  const { input, getValue, defaultVal, formatValue } = getTypeInfo(type);
  switch (type) {
    case "text":
    case "number":
    case "color":
    case "Date":
    case "boolean":
    case "Boolean":
      return (
        <Input
          helper={props.helper}
          label={props.label}
          type={input}
          value={formatValue(props.value || defaultVal)}
          onChange={v => {
            return props.onChange(getValue(v.target));
          }}
        />
      );
    case "object":
    case "array":
      return (
        <Input
          helper={props.helper}
          label={props.label}
          type={"textarea"}
          value={props.value}
          onChange={v => props.onChange(v.target.value)}
        />
      );
    case "button":
      return <button onClick={props.onButtonClick}>{props.label}</button>;
  }

  return (
    <Input
      helper={props.helper}
      label={props.label}
      type={props.type}
      value={props.value}
      onChange={v => props.onChange(v.target.value)}
    />
  );
}
