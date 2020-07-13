import React, { useState } from "react";
import { Json, defaultFields } from "react-json3";

const fields = [
  {
    ...defaultFields.find((el) => el.name === "file"),
    name: "mfile",
    props: {
      multiple: true,
    },
  },
  ...defaultFields,
];

function createQuery(fn) {
  let cache, err;
  return (...params) => {
    if (cache !== undefined) {
      return cache;
    }
    if (params[1] === undefined) {
      return cache;
    }
    throw (
      err ||
      fn(...params)
        .then((el) => (cache = el ?? null))
        .catch((e) => (err = e))
    );
  };
}

const useParsedProps = createQuery((fn, value) => fn(value));

export function useArgs({
  Component,
  parseProps,
  event,
  values: initialValues,
  fieldMapping: initialMapping,
}) {
  const keys = [];
  const parsedValue = useParsedProps(parseProps, initialValues);
  const args = Component.story?.args || Component.args;
  const argTypes = Component.story?.argTypes;
  const [values, setValues] = useState(
    Object.assign({}, args || {}, parsedValue)
  );
  const [fieldMapping, setMapping] = useState(
    Object.assign({}, argTypes || {}, initialMapping)
  );
  const proxy = new Proxy(
    {},
    {
      get(_, prop: string) {
        if (prop.startsWith("on")) {
          return event(prop);
        } else if (prop.startsWith("set")) {
          const propName = [prop[3].toLowerCase(), ...prop.slice(4)].join("");
          return (value) => setValues({ ...values, [propName]: value });
        } else {
          keys.push(prop);
          return (values || {})[prop];
        }
      },
    }
  );

  return {
    component: Component(proxy),
    values,
    fieldMapping,
    input: (
      <Json
        components={fields}
        fieldMapping={fieldMapping || {}}
        value={{ ...Object.fromEntries(keys.map((el) => [el, ""])), ...values }}
        onChange={
          ((e, mapping) => {
            setMapping(mapping);
            setValues(e);
          }) as any
        }
      />
    ),
  };
}
