import React, { useState, forwardRef, useMemo } from "react";
import upd from "lodash/update";
import { SettingsIcon } from "./Button";
import { TextField, BoolField, NumberField } from "./Fields";
import { JsonField, Components } from "./types";
import { useMap } from "./useMap";

const mapFn = (parentPath = []) => (el: any) =>
  [el[0] as string, el[1], parentPath] as const;

const sortFn = (a, b) => {
  return String(b).localeCompare(String(a), undefined, { numeric: true });
};

export type Item = {
  key: string;
  pathKey: string;
  type: "map" | "list" | "prop";
  path: string[];
  parent: string[];
  value?: any;
  childrenLength?: number;
  field?: JsonField;
};
function getList(
  value: Record<string, any>,
  expanded: Set<string>,
  getField: (item, key, path, value) => JsonField
) {
  const queue = [] as Array<[string, any, any[]]>;

  function insert(items, path = []) {
    const next = items.map(mapFn(path)).sort(sortFn);
    queue.push(...next);
  }
  insert(Object.entries(value));
  const list = [] as Item[];
  while (queue.length !== 0) {
    const [key, item, parentPath] = queue.pop();
    const path = parentPath.concat(key);
    const k = path.join(".");
    const matchedComponent = getField(item, key, path, value);

    if (!matchedComponent) {
      throw new Error("no matched component");
    }

    if (matchedComponent.name === "map" || matchedComponent.name === "list") {
      const children = Object.entries(item);

      list.push({
        key: key,
        pathKey: k,
        type: matchedComponent.name,
        path: path,
        parent: parentPath,
        value: item,
        childrenLength: children.length,
      });
      if (expanded.has(k)) {
        insert(children, path);
      }
    } else {
      list.push({
        pathKey: k,
        key,
        type: "prop",
        path,
        parent: parentPath,
        value: item,
        field: matchedComponent,
      });
    }
  }
  return list;
}

export function useField(initialValue, expanded, components: Components) {
  const [value, update] = useState(initialValue);
  const [, keyToTypeMapActions] = useMap({} as Record<string, string>);
  const componentsMap = useMemo(() => {
    return new Map(components.map((el) => [el.name, el]));
  }, [components]);

  const getField = (item: any, key: string, path: string[], value: any) => {
    const mappedTypeName = keyToTypeMapActions.get(path.join("."));
    if (mappedTypeName) {
      return componentsMap.get(mappedTypeName);
    }
    return components.find((el) => el.isType(item, key, path, value));
  };
  const list = getList(value, expanded, getField);
  return {
    value: value,
    list,
    getField: (name: string) => componentsMap.get(name),
    getType: (path: string) => keyToTypeMapActions.get(path),
    getFieldForPath: (path: string) =>
      componentsMap.get(keyToTypeMapActions.get(path)),
    updateType: (path: string, newType: string) => {
      keyToTypeMapActions.set(path, newType);
    },
    update: (p = [], newFieldValue) => {
      const v2 = upd({ ...value }, p, newFieldValue);
      return update(v2);
    },
    dropPath(parentPath, key) {
      const updateField = (v) => {
        if (Array.isArray(v)) {
          return v.filter((_, i) => i !== Number(key));
        }
        Reflect.deleteProperty(v, key);
        return v;
      };
      let v;
      if (parentPath.length === 0) {
        v = updateField(value);
      } else {
        v = upd(value, parentPath, updateField);
      }

      update({ ...v });
    },
    updateKey: (newKeyValue, key, path) => {
      const updateKey = ({ [key]: v, ...obj }) => {
        return { [newKeyValue]: v, ...obj };
      };
      if (path.length === 0) {
        return update(updateKey(value));
      }
      return update(upd({ ...value }, path, updateKey));
    },
  };
}

export const SelectType = forwardRef(
  (
    {
      components,
      ...props
    }: React.HtmlHTMLAttributes<HTMLSelectElement> & { components: Components },
    ref
  ) => {
    const items = components.filter(
      (el) => el.name !== "fallback" && el.name !== "null"
    );
    return (
      <div className="type-select-wrapper">
        <SettingsIcon
          style={{
            position: "absolute",
            pointerEvents: "none",
            color: "var(--color-icon)",
            background: "inherit",
          }}
        />
        <select {...props} className="type-select" value={""} ref={ref as any}>
          <option disabled value="">
            Actions
          </option>
          <option label="🗑️ Delete" value="delete" />
          <option label="Duplicate" value="duplicate" />
          <optgroup label="convert to">
            <option key={"auto"} label={"auto"} value={"convert.auto"}></option>
            {items.map((el) => {
              return (
                <option
                  key={el.name}
                  label={el.name}
                  value={"convert." + el.name}
                >
                  {el.name}
                </option>
              );
            })}
          </optgroup>
          {/* <optgroup label="insert after">
            {items.map((el) => {
              return (
                <option
                  key={el.name}
                  label={el.name}
                  value={"insert." + el.name}
                >
                  {el.name}
                </option>
              );
            })}
          </optgroup> */}
        </select>
      </div>
    );
  }
);

export function Field({ value, className = "", onBlur = null }) {
  const type = typeof value;
  if (type === "string") {
    return (
      <TextField defaultValue={value} onBlur={onBlur} className={className} />
    );
  }
  return "not implemented" as any;
}

const id = (v) => v;
export function JsonValueInput({
  value,
  className = "",
  onBlur = null,
  field,
}: {
  value: any;
  field: JsonField;
  className?: string;
  onBlur: any;
}) {
  const InputFieldComponent = field.component;
  const { parse = id, format = id, ...rest } = field.props || {};
  return (
    <InputFieldComponent
      {...rest}
      defaultValue={format(value)}
      className={className}
      onBlur={(e, v) => {
        onBlur(e, parse(v));
      }}
    />
  );
}
