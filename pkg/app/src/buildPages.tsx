import React from "react";
import ReactDOM from "react-dom";
import { omit } from "./helpers";

function map<V, T>(obj: Record<string, V>, fn: (arg: [string, V]) => T) {
  return Object.entries(obj).map(fn);
}

export function reactRenderer(Component, target, props, meta) {
  ReactDOM.render(<Component {...props} />, target);
}

export function buildPages(modules, renderer = reactRenderer) {
  const pages = Object.entries(modules).reduce((acc, [name, el]: any) => {
    const config = el.default || {};
    const stories = el.default?.stories
      ? el.default?.stories
      : omit(el, "default");
    const res = {
      name: name,
      nest: config.nest,
      component: el.default?.component,
      framed: config.framed,
      config: config,
      render: renderer,
      cases: map(stories, ([key, Value]) => ({
        nest: config.nest,
        framed: config.framed,
        ...(Value as any).story,
        name: key,
        Component: Value,
        render: renderer
      }))
    };
    acc.push(res);
    return acc;
  }, []);
  return pages;
}
