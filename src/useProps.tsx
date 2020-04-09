import React, { useState } from "react";
import { event } from "./event";
import { capitalize } from "./helpers";
import { Field } from "./components/Form";

function isLowerCase(str) {
  return str === str.toLowerCase() && str !== str.toUpperCase();
}

export function useArgs({ props }) {
  let fields = {};

  let events = {};
  Object.entries(props).reduce((acc, [key, value]) => {
    if (key.startsWith("set") && !isLowerCase(key[3])) {
      return acc;
    }
    if (key.startsWith("on")) {
      events[key] = event(key);
    } else {
      const docValue = value as any;
      const initialValue = docValue.defaultValue?.value || "";
      const [val, update] = useState(initialValue.replace(/['"]+/g, ""));
      fields[key] = {
        type: docValue.tsType?.name,
        value: val,
        update,
        label: key,
        key
      };
    }
    return acc;
  }, {});
  return {
    fields,
    events
  };
}

function getHandler(key) {
  return "set" + capitalize(key);
}

type Field = {
  type: string;
  value: any;
  label: string;
  update: (v: any) => void;
  key: string;
  helper?: string;
};

function toProps(fields: Field[]) {
  return fields.reduce((acc, el) => {
    acc[el.key] = el.value;
    acc[getHandler(el.key)] = el.update;
    return acc;
  }, {});
}

export function Inputs({ fields }: { fields: Record<string, Field> }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gridAutoFlow: "row dense",
        gridGap: 10
      }}
    >
      {Object.values(fields).map(field => {
        return (
          <Field
            type={field.type}
            value={field.value}
            onChange={field.update}
            label={field.label}
          />
        );
      })}
    </div>
  );
}

export function useProps(Component) {
  const args = Component.__docgenInfo?.props ? useArgs(Component.__docgenInfo) : null;
  const props = args
    ? {
        ...toProps(Object.values(args.fields)),
        ...args.events
      }
    : null;

  return {
    propsEditor: args && <Inputs fields={args.fields} />,
    props
  };
}
