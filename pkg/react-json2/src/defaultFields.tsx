import {
  BoolField,
  JSONFileField,
  NullField,
  NumberField,
  SelectField,
  TextField,
} from "./Fields";
import { Components, JsonField } from "./types";
import { isColor, isObject, isValidDate } from "./utils";

export const defaultFields: Components = [
  {
    name: "null",
    isType: (value) =>
      value === undefined ||
      value === null ||
      (typeof value === "number" && isNaN(value)),
    component: NullField,
  },
  {
    name: "file",
    component: JSONFileField,
    defaultValue: (v) => {
      return "";
    },
  },
  {
    name: "color",
    isType: (value: string) =>
      typeof value === "string" && value.startsWith("#") && value.length === 7,
    component: TextField,
    defaultValue: (v) => {
      if (isColor(v)) {
        return v;
      }
      return "#cccccc";
    },
    props: {
      type: "color",
    },
  },
  {
    name: "select",
    isType: (_1, _2, path) => {
      return path[0] === "selectItem";
    },
    component: SelectField,
    defaultValue: () => "A",
    props: {
      multiple: true,
      options: ["A", "B", "C", "D"],
    },
  },
  {
    name: "date",
    isType: (value) => value.__proto__.constructor === Date,
    component: TextField,
    defaultValue: () => new Date(),
    props: {
      type: "date",
      parse: (v: string) => {
        return new Date(v);
      },
      format: (v: Date) => {
        if (!isValidDate(v)) {
          v = new Date();
        }
        return v.toJSON().slice(0, 10);
      },
    },
  },
  {
    name: "bool",
    isType: (value) => typeof value === "boolean",
    component: BoolField,
    defaultValue: () => false,
  },
  {
    name: "number",
    isType: (value) => typeof value === "number",
    component: NumberField,
    defaultValue: () => 0,
  },
  {
    name: "text",
    isType: (value) => typeof value === "string",
    component: TextField,
    defaultValue: (v: any) => {
      if (v) {
        if (
          v.__proto__.constructor === Object ||
          v.__proto__.constructor === Array
        ) {
          return JSON.stringify(v);
        }
      }
      String(v || "");
    },
  },
  {
    name: "map",
    isType: isObject,
    defaultValue: () => ({}),
    props: {},
  },
  {
    name: "list",
    isType: Array.isArray,
    defaultValue: () => [{ name: "string" }],
  },
  {
    name: "fallback",
    isType: () => true,
    component: TextField,
    defaultValue: () => "",
    props: {
      format: (v) => String(v),
    },
  },
];

export type InputField = Omit<JsonField, "isType">;

export function convert(fields: Components) {
  const is = [] as Array<[string, Function]>;
  const fieldsMap = new Map<string, InputField>();

  fields.map((el) => {
    is.push([el.name, el.isType]);
    fieldsMap.set(el.name, el);
  });

  const isType = (...args) => {
    const res = is.find(([key, fn]) => {
      return fn && fn(...args);
    });
    if (res) {
      return res[0];
    }
    return "fallback";
  };
  return {
    isType,
    fieldsMap,
  };
}
