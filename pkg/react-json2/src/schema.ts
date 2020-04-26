import {
  ParsedSchemaObject,
  SchemaElement,
  SchemaType,
  ParsedSchemaType,
  ParsedSchemaElement,
} from "./types";
import { isObject } from "./utils";

function isElement(
  el: Record<string, SchemaElement> | SchemaElement
): el is SchemaElement {
  return el.type && typeof el.type === "string";
}

function isType(el: ParsedSchemaElement): el is ParsedSchemaType {
  return el.type && typeof el.type === "string" && !el["fields"];
}

function isSchemaObject(el: ParsedSchemaElement): el is ParsedSchemaObject {
  return !isType(el);
}

// [size, items, 0, name]
export function getSchemaType(
  path: string[],
  schema: ParsedSchemaObject
): ParsedSchemaObject {
  let currentObj = schema as ParsedSchemaElement;
  for (var i = 0; i < path.length; i++) {
    if (isSchemaObject(currentObj) && currentObj.type === "record") {
      let segment = path[i];
      currentObj = currentObj.fields[segment];
    } else if (isSchemaObject(currentObj)) {
      i++;
      currentObj = currentObj.fields[path[i]];
    }
  }
  return currentObj as any;
}

export function parseSchema(
  arg: Record<string, SchemaElement>
): ParsedSchemaObject {
  return {
    type: "record",
    fields: buildObjectFromSchema(arg),
  };
}
function buildObjectFromSchema(
  arg: Record<string, SchemaElement>
): Record<string, ParsedSchemaObject> {
  return Object.entries(arg).reduce((acc, [key, val]) => {
    if (val.type) {
      acc[key] = {
        ...val,
        key,
      };
      if (val["fields"]) {
        acc[key].fields = buildObjectFromSchema(val["fields"]);
      }
    } else {
      acc[key] = {
        type: "record",
        key,
        fields: buildObjectFromSchema(val as any),
      };
    }
    return acc;
  }, {} as any);
}

export function buildDefaultObjectFromSchema(arg: ParsedSchemaObject): Object {
  if (!arg.fields) {
    return arg?.defaultValue() || undefined;
  }
  if (arg.type !== "record") {
    return arg.type === "list" ? [] : {};
  }
  return Object.entries(arg.fields).reduce((acc, [key, val]) => {
    acc[key] = buildDefaultObjectFromSchema(val as any);
    return acc;
  }, {} as any);
}

export function buildSchemaFromValue(value: any, getType): ParsedSchemaObject {
  const fields = Object.entries(value).reduce((acc, [key, value]) => {
    const type = getType(value);
    acc[key] = {
      type,
      fields:
        type === "map" || type === "list"
          ? buildSchemaFromValue(value, getType)
          : undefined,
    };
    return acc;
  }, {});
  return {
    type: getType(value),
    fields,
  };
}
// function schemaToMap(args: Record<string, SchemaElement>) {
//   const queue: Array<readonly [string, SchemaElement]> = Object.entries(args);
//   const map = new Map<string, string | Object>();
//   while (queue.length !== 0) {
//     let [key, el] = queue.pop();
//     debugger;
//     if (el["item"] && el.type && typeof el.type === "string") {
//       let next = Object.entries(el.item).map(([childKey, schema]) => [
//         key + "." + childKey,
//         schema,
//       ]);
//       map.set(key + ".__key", {
//         type: "map",
//         fields: next.map((el) => el[0]),
//       });

//       queue.push(...(next as any));
//     } else if (el.type && typeof el.type === "string" && !el["item"]) {
//       map.set(key, el.type as string);
//     } else {
//       let next = Object.entries(el).map(([childKey, schema]) => [
//         key + "." + childKey,
//         schema,
//       ]);
//       map.set(key + ".__key", {
//         type: "record",
//         fields: next.map((el) => el[0]),
//       });
//       queue.push(...(next as any));
//     }
//   }
//   return map;
// }
