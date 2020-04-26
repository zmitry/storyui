import { Components } from "./types";
import {
  NullField,
  JSONFileField,
  TextField,
  BoolField,
  SelectField,
  NumberField,
} from "./Fields";
import { isColor, isValidDate, isObject } from "./utils";

export const isNull = (value) =>
  value === undefined ||
  value === null ||
  (typeof value === "number" && isNaN(value));

const fields = {
  null: {
    component: NullField,
  },
  file: {
    component: JSONFileField,
    defaultValue: (v) => {
      return "";
    },
  },
  text: {
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
  map: {
    defaultValue: () => ({}),
  },
  specialMap: {
    hidden: true,
    defaultValue: () => ({}),
    pta,
  },
  list: {
    defaultValue: () => [],
  },
};
// export const defaultFields: Components = [
//   {
//     name: "null",
//     component: NullField,
//     props: {},
//   },
//   {
//     name: "file",
//     isType: (value: string, key: string) => false,
//     component: JSONFileField,
//     defaultValue: (v) => {
//       return "";
//     },
//     props: {},
//   },
//   {
//     name: "color",
//     isType:
//     component: TextField,
//     defaultValue: (v) => {
//       if (isColor(v)) {
//         return v;
//       }
//       return "#cccccc";
//     },
//     props: {
//       type: "color",
//     },
//   },
//   {
//     name: "select",
//     isType: (_1, _2, path) => {
//       return path[0] === "selectItem";
//     },
//     component: SelectField,
//     defaultValue: () => "A",
//     props: {
//       multiple: true,
//       options: ["A", "B", "C", "D"],
//     },
//   },
//   {
//     name: "date",
//     isType: (value) => value.__proto__.constructor === Date,
//     component: TextField,
//     defaultValue: () => new Date(),
//     props: {
//       type: "date",
//       parse: (v: string) => {
//         return new Date(v);
//       },
//       format: (v: Date) => {
//         if (!isValidDate(v)) {
//           v = new Date();
//         }
//         return v.toJSON().slice(0, 10);
//       },
//     },
//   },
//   {
//     name: "bool",
//     isType: (value) => typeof value === "boolean",
//     component: BoolField,
//     defaultValue: () => false,
//     props: {},
//   },
//   {
//     name: "number",
//     isType: (value) => typeof value === "number",
//     component: NumberField,
//     defaultValue: () => 0,
//     props: {},
//   },
//   {
//     name: "email",
//     isType: (value, path) => typeof value === "string" && path === "email",
//     component: TextField,
//     defaultValue: (v: any) => {
//       if (v) {
//         if (
//           v.__proto__.constructor === Object ||
//           v.__proto__.constructor === Array
//         ) {
//           return JSON.stringify(v);
//         }
//       }
//       String(v || "");
//     },
//     parse: (value: string = "") => {
//       if (!(value.startsWith("{") && value.endsWith("}"))) {
//         throw "Is not JSON";
//       }
//       return value;
//     },
//     props: {},
//   },
//   {
//     name: "text",
//     isType: (value) => typeof value === "string",
//     component: TextField,
//     defaultValue: (v: any) => {
//       if (v) {
//         if (
//           v.__proto__.constructor === Object ||
//           v.__proto__.constructor === Array
//         ) {
//           return JSON.stringify(v);
//         }
//       }
//       String(v || "");
//     },
//     props: {},
//   },
//   {
//     name: "map",
//     isType: (value) => isObject(value),
//     defaultValue: () => ({}),
//     props: {},
//   },
//   {
//     name: "list",
//     isType: (value) => Array.isArray(value),
//     defaultValue: () => [],
//     props: {},
//   },
//   {
//     name: "fallback",
//     isType: () => true,
//     component: TextField,
//     defaultValue: () => "",
//     props: {
//       format: (v) => String(v),
//     },
//   },
// ];
