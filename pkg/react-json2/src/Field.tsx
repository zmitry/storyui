import React, { useState, forwardRef, useMemo, useRef } from "react";
import upd from "lodash/update";
import { SettingsIcon } from "./Button";
import { TextField, BoolField, NumberField } from "./Fields";
import { JsonField, Components } from "./types";
import { useMap } from "./useMap";
import get from "lodash/get";
import { isObjectLike } from "./utils";
import { useSet } from "./useSet";

const mapFn = (parentPath = []) => (el: any) =>
  [el[0] as string, el[1], parentPath] as const;

const sortFn = (a, b) => {
  return String(b).localeCompare(String(a), undefined, { numeric: true });
};
function isJsonLike(d: any) {
  return (
    typeof d === "string" &&
    (isObjectLike(d, "{", "}") || isObjectLike(d, "[", "]"))
  );
}

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

    let listItem: Item = {
      pathKey: k,
      key,
      type: "prop",
      path,
      parent: parentPath,
      value: item,
      field: matchedComponent,
    };
    list.push(listItem);
    if (matchedComponent.name === "map" || matchedComponent.name === "list") {
      const children = Object.entries(item);
      listItem.childrenLength = children.length;
      listItem.type = matchedComponent.name;
      listItem.field = undefined;
      if (expanded.has(k)) {
        insert(children, path);
      }
    }
  }
  return list;
}

export function useField(initialValue, components: Components, isField) {
  const [expanded, { toggle: toggleExpanded, add: addExpanded }] = useSet(
    new Set<string>()
  );

  const [, keyToTypeMapActions] = useMap({} as Record<string, string>);
  const componentsMap = useMemo(() => {
    return new Map(components.map((el) => [el.name, el]));
  }, [components]);

  const [value, update] = useState({
    ...initialValue,
  });

  const getField = (item: any, key: string, path: string[], value: any) => {
    const mappedTypeName = keyToTypeMapActions.get(path.join("."));
    if (mappedTypeName) {
      return componentsMap.get(mappedTypeName);
    }
    return isField(item, key, path, value);
  };
  const list = getList(value, expanded, getField);
  function dropPath(parentPath, key) {
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
  }
  function updateType(path: string, newType: string) {
    keyToTypeMapActions.set(path, newType);
  }
  const updateField = (p = [], newFieldValue) => {
    const v2 = upd({ ...value }, p, newFieldValue);
    return update(v2);
  };
  const getType = (path: string) => keyToTypeMapActions.get(path);
  return {
    toggleExpanded,
    expanded,
    value: value,
    list,
    onDelete(el: Item) {
      dropPath(el.parent, el.key);
    },
    onItemAdd(el: Item) {
      updateField(el.path, (v) => {
        if (el.type === "map") {
          return { ...v, "": "" };
        }
        return v.concat("");
      });
      const newPath = el.path.concat(String(el.childrenLength)).join(".");
      const type = getType(
        el.path.concat(String(el.childrenLength - 1)).join(".")
      );
      updateType(newPath, type);
      addExpanded(el.pathKey);
    },
    onConvertType(el: Item, newType: string) {
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
      let fieldType = componentsMap.get(newType);
      const defaultValue =
        ((v) => fieldType.defaultValue(v, el.field?.name, el.type)) ||
        (() => "");
      updateField(el.path, defaultValue);
    },
    onDuplicate(el: Item) {
      const parentValue = get(value, el.parent);
      let newKey = el.key + "_copy";
      if (Array.isArray(parentValue)) {
        newKey = String(parentValue.length);
      }
      let path = el.parent.concat(newKey);
      updateField(path, () => el.value);
    },
    updateField,
    updateType,
    getType: (path: string) => keyToTypeMapActions.get(path),
    dropPath,
    updateKey: (newKeyValue, key, path) => {
      if (newKeyValue === key) {
        return;
      }
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
      (el) => el.name !== "fallback" && el.name !== "null" && !el.hidden
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

function Validate({ children, parse, onBlur }) {
  const [invalid, setMsg] = useState(false);
  let ref = useRef(null);

  const onBlurInternal = (event, value) => {
    try {
      const res = parse(value);
      setMsg(false);
      onBlur(event, res);
    } catch (e) {
      ref.current.setCustomValidity(e);
      setMsg(true);
      event.preventDefault();
      if (!invalid) {
        ref.current.reportValidity();
        ref.current.focus();
      }
    }
  };
  return (
    <div>
      {children(onBlurInternal, ref)}
      {invalid && (
        <span
          tabIndex={1}
          aria-label="validation message"
          style={{ marginLeft: 5 }}
          onMouseEnter={() => {
            ref.current.reportValidity();
          }}
        >
          ⚠️
        </span>
      )}
    </div>
  );
}

export function JsonValueInput({
  value,
  className = "",
  onBlur = null,
  field,
  validate,
}: {
  value: any;
  field: JsonField;
  className?: string;
  onBlur: any;
  validate?: any;
}) {
  const InputFieldComponent = field.component;
  const { parse = id, format = id } = field || {};
  const parseFn = (...args) => {
    const res = validate ? validate(...args) : undefined;
    if (res) {
      throw res;
    }
    return parse(res);
  };

  return (
    <Validate parse={parseFn} onBlur={onBlur}>
      {(onBlurWithValidation, ref) => (
        <InputFieldComponent
          {...field.props}
          ref={ref}
          defaultValue={format(value)}
          className={className}
          onBlur={onBlurWithValidation}
        />
      )}
    </Validate>
  );
}
