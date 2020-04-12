import React, { useState, useRef, useLayoutEffect } from "react";
import { Group } from "./Group";
import { Button } from "./Button";
import { Field, FieldAdder } from "./Field";

function isObject(value) {
  var type = typeof value;
  return (
    value != null &&
    (type == "object" || type == "function") &&
    !Array.isArray(value)
  );
}
//
function map<V, T>(
  obj: Record<string, V>,
  fn: (arg: [string, V], i: number) => T
) {
  return Object.entries(obj).map(fn);
}

export function omit(object, ...keys: string[]) {
  return keys.reduce(
    (obj, key) => {
      if (object && object.hasOwnProperty(key)) {
        delete obj[key];
      }
      return obj;
    },
    { ...object }
  );
}

export function ResolveField({ value }) {
  let input;
  if (Array.isArray(value)) {
    input = <ArrayField value={value} />;
  } else if (isObject(value)) {
    input = <ObjectField value={value} />;
  } else {
    input = <Field value={value} posType="value" changeable={!value} />;
  }
  return input;
}

function ObjectField({ value: defaultValue }) {
  const groupRef = useRef(null);
  const [addEnabled, setAddEnable] = useState(false);
  const [value, setValue] = useState(defaultValue);
  console.log("value: ", value);
  const keysCount = Object.keys(value || {}).length;

  return (
    <Group
      ref={groupRef}
      type="map"
      showCollapsed={keysCount > 0}
      className={"object"}
      end={
        <Button
          title="Add property"
          className="add-btn"
          onClick={() => setAddEnable(true)}
        >
          +
        </Button>
      }
    >
      {map(value, ([key, val], i) => {
        console.log("key: ", key, String(key));
        return (
          <>
            <span className="entry-line">
              <span className="name">
                <Field
                  changeable={false}
                  value={String(key)}
                  posType="name"
                  before={
                    <Button
                      className="deleteProp"
                      title="Delete property"
                      onClick={e => {
                        e.stopPropagation();
                        setValue(omit(value, key));
                      }}
                    >
                      ✕
                    </Button>
                  }
                />
              </span>
              <span className="colon">:</span>
              {ResolveField({
                value: val
              })}
              {i !== Object.keys(value).length - 1 && ","}
            </span>
          </>
        );
      })}
      {addEnabled && (
        <span className="entry-line">
          <Adder
            onBlur={(key, v) => {
              console.log("v: ", { ...value, [key]: v });
              if (key) {
                setValue({ ...value, [key]: v });
              }
              setAddEnable(false);
            }}
          />
        </span>
      )}
    </Group>
  );
}

function ArrayField({ value }) {
  const [val, setVal] = useState(value);

  return (
    <Group
      type="array"
      className={"array"}
      end={
        <Button
          title="Add item"
          className="add-btn"
          onClick={() => setVal(s => s.concat(s[0]))}
        >
          +
        </Button>
      }
    >
      {val.map((v, i) => {
        return (
          <div key={i} className="entry-line">
            <Button
              className="deleteProp"
              title="Delete item"
              onClick={e => {
                e.stopPropagation();
                setVal(v => v.filter((_, vi) => vi === i));
              }}
            >
              ✕
            </Button>
            {ResolveField({
              value: v
            })}
            {i !== val.length - 1 && ","}
          </div>
        );
      })}
    </Group>
  );
}

export function Json({ value }) {
  return (
    <div className="json-editor">
      {ResolveField({
        value: value
      })}
    </div>
  );
}
