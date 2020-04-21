import React from "react";
import { Button, PlusIcon, ExpandButton } from "./Button";
import { Field, useField, SelectType, JsonValueInput } from "./Field";
import { useSet } from "./useSet";
import {
  TextField,
  BoolField,
  NumberField,
  NullField,
  JSONFileField,
} from "./Fields";
import { Components } from "./types";
import get from "lodash/get";
import { SelectField } from "./Fields/Select";

function isObject(value) {
  var type = typeof value;
  return (
    value !== null &&
    (type === "object" || type === "function") &&
    !Array.isArray(value)
  );
}

const arrayWrap = (val) => `[${val}]`;
const objWrap = (val) => `{${val}}`;

function expandIcon({ expanded, onClick }) {
  return (
    <Button
      onClick={onClick}
      style={{
        marginLeft: -18,
      }}
    >
      <ExpandButton expanded={expanded} />
    </Button>
  );
}

function PlainProperty({ depth, children, name, actions, ...props }) {
  return (
    <div
      className="row"
      style={{
        paddingLeft: 60 + depth * 20,
        display: "flex",
        alignItems: "center",
        position: "relative",
      }}
      {...props}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          alignItems: "center",
          height: "100%",
          display: "flex",
        }}
      >
        {actions}
      </div>
      {name}:{children}
    </div>
  );
}

function TreeRenderer({
  value: initialValue,
  components,
}: {
  value: any;
  components: Components;
}) {
  const [expanded, { toggle: toggleExpanded, add: addExpanded }] = useSet(
    new Set<string>()
  );

  const {
    value,
    list,
    update: updateField,
    dropPath,
    updateKey,
    updateType,
    getType,
    getField,
  } = useField(initialValue, expanded, components);
  return (
    <>
      {list.map((el) => {
        const onDelete = (e) => {
          e.stopPropagation();
          e.preventDefault();
          dropPath(el.parent, el.key);
        };
        const onActions = (e: any) => {
          const eventName = e.target.value;

          if (eventName === "delete") {
            onDelete(e);
          } else if (eventName.startsWith("convert")) {
            const newType = eventName.split(".")[1];
            if (newType === "auto") {
              updateType(el.pathKey, undefined);
              if (isJsonLike(el.value)) {
                try {
                  updateField(el.path, () => {
                    try {
                      return JSON.parse(el.value);
                    } catch (e) {
                      return el.value;
                    }
                  });
                } catch (e) {
                  console.error("failed to parse");
                }
              }
              return;
            }
            updateType(el.pathKey, newType);
            let fieldType = getField(newType);
            const defaultValue =
              ((v) => fieldType.defaultValue(v, el.field?.name, el.type)) ||
              (() => "");
            updateField(el.path, defaultValue);
          } else if (eventName === "duplicate") {
            const parentValue = get(value, el.parent);
            let newKey = el.key + "_copy";
            if (Array.isArray(parentValue)) {
              newKey = String(parentValue.length);
            }
            let path = el.parent.concat(newKey);
            updateField(path, () => el.value);
          }
        };
        const onAdd = (e) => {
          e.stopPropagation();
          updateField(el.path, (v) => {
            if (el.type === "map") {
              return { ...v, "": "" };
            }
            const last = el.value[el.childrenLength - 1];
            getType(el.pathKey);
            return v.concat(last);
          });
          const newPath = el.path.concat(String(el.childrenLength)).join(".");
          const type = getType(
            el.path.concat(String(el.childrenLength - 1)).join(".")
          );
          updateType(newPath, type);
          addExpanded(el.pathKey);
        };
        const onKeyEdit = (e, v) => {
          if (v !== el.key) {
            updateKey(v, el.key, el.parent);
          }
        };
        if (el.type === "prop") {
          const isArray = Array.isArray(get(value, el.parent));
          const name = !isArray ? (
            <Field value={el.key || ""} onBlur={onKeyEdit} />
          ) : (
            el.key
          );
          return (
            <PlainProperty
              actions={
                <SelectType onChange={onActions} components={components} />
              }
              key={el.pathKey}
              name={name}
              depth={el.parent.length}
            >
              <JsonValueInput
                value={el.value}
                field={el.field}
                className="value"
                onBlur={(e, v) => {
                  updateField(el.path, () => v);
                }}
              />
            </PlainProperty>
          );
        } else if (el.type === "map" || el.type === "list") {
          const title =
            el.type === "map"
              ? objWrap(el.childrenLength)
              : arrayWrap(el.childrenLength);
          const actions = (
            <>
              <SelectType onChange={onActions} components={components} />
            </>
          );
          const name = (
            <>
              {expandIcon({
                expanded: expanded.has(el.pathKey),
                onClick: () => toggleExpanded(el.pathKey),
              })}
              <Field value={el.key || ""} onBlur={onKeyEdit} />
            </>
          );
          return (
            <PlainProperty
              actions={actions}
              key={el.pathKey}
              name={name}
              depth={el.parent.length}
            >
              <span className="grey">{title}</span>
              <Button onClick={onAdd} title="Add property">
                <PlusIcon />
              </Button>
            </PlainProperty>
          );
        }
        return;
      })}
    </>
  );
}
//

function isValidDate(d: any) {
  return d instanceof Date && !isNaN(d as any);
}

function isObjectLike(d, leftParen, rightParen) {
  return d.trim().startsWith(leftParen) && d.trim().endsWith(rightParen);
}
function isJsonLike(d: any) {
  return (
    typeof d === "string" &&
    (isObjectLike(d, "{", "}") || isObjectLike(d, "[", "]"))
  );
}
const isColor = (value: string) =>
  typeof value === "string" && value.startsWith("#") && value.length === 7;
const defaultComponents: Components = [
  {
    name: "null",
    isType: (value) =>
      value === undefined ||
      value === null ||
      (typeof value === "number" && isNaN(value)),
    component: NullField,
    props: {},
  },
  {
    name: "file",
    isType: (value: string, key: string) => false,
    component: JSONFileField,
    defaultValue: (v) => {
      return "";
    },
    props: {},
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
    props: {},
  },
  {
    name: "number",
    isType: (value) => typeof value === "number",
    component: NumberField,
    defaultValue: () => 0,
    props: {},
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
    props: {},
  },

  {
    name: "map",
    isType: (value) => isObject(value),
    defaultValue: () => ({}),
    props: {},
  },
  {
    name: "list",
    isType: (value) => Array.isArray(value),
    defaultValue: () => [],
    props: {},
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

export function Json({
  value,
  components = defaultComponents,
}: {
  value: any;
  components?: Components;
}) {
  return (
    <div className="json-editor" style={{ padding: 20 }}>
      <TreeRenderer value={value as any} components={components} />
    </div>
  );
}
