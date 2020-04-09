import React, { useState } from "react";
import capitalize from "lodash/capitalize";
import ErrorBoundary from "react-error-boundary";
import omit from "lodash/omit";
import { event } from "./event";
import { Stack, Loader, OpenLinkIcon, EditIcon, IconButton, HStack } from "./components";
import { Field } from "./components/Form";
import { css } from "emotion";
import { Card } from "./components/Card";

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

const classes = {
  header: css`
    display: flex;
    align-items: center;
  `
};

export function Page({ Value, title }) {
  // const [targetRef, isInViewport] = useIsInViewport(20);
  const isInViewport = true;
  const args = Value.__docgenInfo?.props ? useArgs(Value.__docgenInfo) : null;
  const props = args
    ? {
        ...toProps(Object.values(args.fields)),
        ...args.events
      }
    : {};
  const [propsExpanded, setExpanded] = useState(false);
  return (
    <Card
      title={
        <div className={classes.header}>
          <h4 style={{ margin: 0 }}>{title}</h4>
          <HStack gap={5} style={{ marginLeft: "auto" }}>
            {args && (
              <IconButton
                aria-label="Show props"
                data-balloon-pos="down"
                selected={propsExpanded}
                onClick={() => setExpanded(s => !s)}
              >
                <EditIcon />
              </IconButton>
            )}
            <a
              target="_blank"
              href={
                "#" +
                new URLSearchParams({
                  page: title,
                  iframe: "single"
                }).toString()
              }
            >
              <IconButton aria-label="Open in separate window" data-balloon-pos="down">
                <OpenLinkIcon />
              </IconButton>
            </a>
          </HStack>
        </div>
      }
    >
      <Stack gap={15}>
        {isInViewport ? (
          <>
            <div style={{ background: "white", padding: 10 }}>
              <ErrorBoundary
                key={JSON.stringify(props)}
                FallbackComponent={() => "error" as any}
                onError={err => {
                  console.log(err);
                  return "err";
                }}
              >
                <Value {...props} />
              </ErrorBoundary>
            </div>
          </>
        ) : (
          <Loader />
        )}
      </Stack>
      {propsExpanded ? <Inputs fields={args.fields} /> : null}
    </Card>
  );
}

function GetCases(imports) {
  return Object.entries(imports).map(([key, Value]) => ({
    name: key,
    Component: Value
  }));
}

export function buildPages(reqCtx) {
  const pages = reqCtx
    .keys()
    .map(fname => [fname, reqCtx(fname)])
    .reduce((acc, [name, el]) => {
      const config = el.default || {};
      const stories = el.default?.stories ? el.default?.stories : omit(el, "default");
      const nest = config.framed || config.nest;
      const res = {
        name: name,
        nest: nest,
        component: el.default?.component,
        framed: config.framed,
        config: config,
        cases: GetCases(stories)
      };
      acc.push(res);
      return acc;
    }, []);
  return pages;
}
