import React, { useState, useRef, useLayoutEffect } from "react";
import { Group } from "./Group";
import { Button, ExpandIcon, CloseIcon } from "./Button";
import { Field, FieldAdder, FieldProvider } from "./Field";
import { useField } from "./Field";

function isObject(value) {
  var type = typeof value;
  return (
    value != null &&
    (type == "object" || type == "function") &&
    !Array.isArray(value)
  );
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

export function ResolveField({ value, fieldName = [], onBlur = null }) {
  let input;
  if (Array.isArray(value)) {
    input = <ArrayField fieldName={fieldName} />;
  } else if (isObject(value)) {
    input = <ObjectField fieldName={fieldName} />;
  } else {
    input = (
      <Field changeable={true} onBlur={onBlur} value={value} posType="value" />
    );
  }
  return input;
}

function ObjectField({ fieldName = [] as string[] }) {
  const groupRef = useRef(null);
  const { value: fieldValue, update: updateField, updateKey } = useField(
    fieldName
  );
  const [value, setValue] = useState(fieldValue);
  const keysCount = Object.keys(value || {}).length;

  useLayoutEffect(() => {
    setValue(fieldValue);
  }, [fieldValue]);
  return (
    <Group
      ref={groupRef}
      type="map"
      showCollapsed={keysCount > 0}
      className={"object"}
      values={value}
      onAdd={(key, v) => {
        setValue({ ...value, [key]: v });
      }}
      renderItem={(key, val) => {
        return (
          <Property
            onDelete={e => {
              e.stopPropagation();
              updateField(omit(value, key), []);
            }}
            name={String(key)}
          >
            {ResolveField({
              value: val,
              fieldName: fieldName.concat(String(key)),
              onBlur: (e, v) => {
                updateField(v, [key]);
              }
            })}
          </Property>
        );
      }}
      onAddIconClick={e => groupRef.current.insertEmpty(true)}
    ></Group>
  );
}

function Property({ onDelete, name, children }) {
  return (
    <React.Fragment>
      <span>
        <Button title="Delete property" onClick={onDelete}>
          <CloseIcon />
        </Button>

        {name}
      </span>
      <span className="colon">:</span>
      <span>{children}</span>
    </React.Fragment>
  );
}
function ArrayField({ fieldName = [] as string[] }) {
  const { value: fieldValue, update: updateField } = useField(fieldName);
  const [values, setVal] = useState(fieldValue);

  useLayoutEffect(() => {
    setVal(fieldValue);
  }, [fieldValue]);
  return (
    <Group
      type="array"
      className={"array"}
      values={values}
      onAddIconClick={() => setVal(s => s.concat(""))}
      renderItem={(key, val) => {
        return (
          <Property
            onDelete={e => {
              e.stopPropagation();
              updateField(values.filter((_, vi) => String(vi) !== key));
            }}
            name={String(key)}
          >
            {ResolveField({
              value: val,
              fieldName: fieldName.concat(String(key)),
              onBlur: (e, v) => {
                updateField(v, [key]);
              }
            })}
          </Property>
        );
      }}
    ></Group>
  );
}

function TreeRenderer({ value }) {
  const queue = Object.entries(value).map((el:any)=>[el[0] as string, {...el[0], path: []}] as const)
  const list = [];
  while (queue.length !== 0) {
    const [key, item] = queue.pop();

    if(Array.isArray(item)) {

    } else if(isObject(item)) {

    } else {
      list.push(<Field changeable={true} onBlur={onBlur} value={value} posType="value" />)
    }
  }
}

let input;
if (Array.isArray(value)) {
  input = <ArrayField fieldName={fieldName} />;
} else if (isObject(value)) {
  input = <ObjectField fieldName={fieldName} />;
} else {
  input = (
 
  );
}

export function Json({ value }) {
  return (
    <div className="json-editor">
      <FieldProvider initialValue={value}>
        {ResolveField({
          value: value
        })}
      </FieldProvider>
    </div>
  );
}
