import React, { useState } from "react";
import { Button, PlusIcon, CloseIcon } from "./Button";
import { Field, FieldAdder, FieldProvider, useField2 } from "./Field";

function isObject(value) {
  var type = typeof value;
  return (
    value != null &&
    (type == "object" || type == "function") &&
    !Array.isArray(value)
  );
}

const mapFn = (parentPath = []) => (el: any) =>
  [el[0] as string, el[1], parentPath] as const;

const sortFn = (a, b) => {
  if (a[0] > b[0]) {
    return -1;
  } else if (a[0] < b[0]) {
    return 1;
  }
  return 0;
};

const arrayWrap = val => `[${val}]`;
const objWrap = val => `{${val}}`;

type Item = {
  key: string;
  pathKey: string;
  title: string;
  type: "map" | "list" | "prop";
  path: string[];
  parent: string[];
  value?: any;
};
function getList(value: Record<string, any>, expanded: Set<string>) {
  const queue = Object.entries(value)
    .map(mapFn([]))
    .sort(sortFn);
  const list = [] as Item[];
  while (queue.length !== 0) {
    const [key, item, parentPath] = queue.pop();
    const isPropObject = isObject(item);
    const isPropArray = Array.isArray(item);
    const path = parentPath.concat(key);
    const k = path.join(".");

    if (isPropArray || isPropObject) {
      const children = Object.entries(item);
      const title = isPropObject
        ? objWrap(children.length)
        : arrayWrap(children.length);

      list.push({
        key: key,
        pathKey: k,
        title: title,
        type: isPropObject ? "map" : "list",
        path: path,
        parent: parentPath
      });
      if (expanded.has(k)) {
        const next = children.map(mapFn(path)).sort(sortFn);
        queue.push(...next);
      }
    } else {
      list.push({
        pathKey: k,
        key,
        title: key,
        type: "prop",
        path,
        parent: parentPath,
        value: item
      });
    }
  }
  return list;
}

function Property2({
  onDelete = null,
  onAddIconClick = null,
  name,
  children,
  depth,
  ...props
}) {
  return (
    <div
      role="button"
      className="row"
      style={{
        paddingLeft: 40 + depth * 20,
        display: "flex",
        alignItems: "center",
        position: "relative"
      }}
      {...props}
    >
      <Button
        style={{ position: "absolute", left: 0 }}
        tabIndex={1}
        title="Delete property"
        onClick={onDelete}
      >
        <CloseIcon />
      </Button>
      {name}
      <span className="colon">:</span>
      {children}
      {onAddIconClick && (
        <Button
          style={{
            position: "absolute",
            left: 20
          }}
          onClick={onAddIconClick}
          tabIndex={1}
          title="Delete property"
        >
          <PlusIcon />
        </Button>
      )}
    </div>
  );
}

function useExpanded() {
  const [expanded, setExpanded] = useState(new Set<string>());
  const toggleExpanded = (key: string[]) => {
    setExpanded(s => {
      const k = key.join(".");
      if (s.has(k)) {
        s.delete(k);
      } else {
        s.add(k);
      }
      return new Set(s);
    });
  };
  return [expanded, { toggleExpanded }] as const;
}

function ObjectField({ updateField, el, onDelete, toggleExpanded }) {
  const [hasAdder, setHasAdder] = useState(false);
  return (
    <>
      <Property2
        onDelete={onDelete}
        onClick={() => toggleExpanded(el.path)}
        name={el.key}
        depth={el.parent.length}
        onAddIconClick={e => {
          e.stopPropagation();
          setHasAdder(true);
        }}
      >
        <span className="grey">{el.title}</span>
      </Property2>
      {hasAdder && (
        <FieldAdder
          style={{
            paddingLeft: 20 + el.path.length * 20
          }}
          onBlur={(key, v) => {
            if (key) {
              updateField(el.path.concat(key), () => v);
            }
            setHasAdder(false);
          }}
        />
      )}
    </>
  );
}

function TreeRenderer(props) {
  const [expanded, { toggleExpanded }] = useExpanded();
  const { value, update: updateField, dropPath } = useField2();
  const list = getList(value, expanded);
  return (
    <>
      {list.map(el => {
        const onDelete = e => {
          e.stopPropagation();
          e.preventDefault();
          dropPath(el.path);
        };
        if (el.type === "prop") {
          return (
            <Property2
              key={el.pathKey}
              onDelete={onDelete}
              name={el.title}
              depth={el.parent.length}
            >
              <Field
                changeable
                value={el.value}
                posType="value"
                onBlur={(e, v) => {
                  updateField(el.path, () => v);
                }}
              />
            </Property2>
          );
        } else if (el.type == "map" || el.type == "list") {
          if (el.type === "map") {
            return (
              <ObjectField
                key={el.pathKey}
                el={el}
                updateField={updateField}
                onDelete={onDelete}
                toggleExpanded={toggleExpanded}
              />
            );
          }
          return (
            <Property2
              key={el.pathKey}
              onDelete={onDelete}
              onClick={() => toggleExpanded(el.path)}
              name={el.key}
              depth={el.parent.length}
              onAddIconClick={e => {
                e.stopPropagation();
                updateField(el.path, s => s.concat(""));
              }}
            >
              <span className="grey">{el.title}</span>
            </Property2>
          );
        }
        return;
      })}
    </>
  );
}
//

export function Json({ value }) {
  return (
    <div className="json-editor" style={{ padding: 20 }}>
      <FieldProvider initialValue={value}>
        <TreeRenderer value={value as any} />
      </FieldProvider>
    </div>
  );
}
