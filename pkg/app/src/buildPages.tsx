import React from "react";
import ReactDOM from "react-dom";
import { omit } from "./helpers";

function map<V, T>(obj: Record<string, V>, fn: (arg: [string, V]) => T) {
  return Object.entries(obj).map(fn);
}

const id = children => children;

export const reactRenderer = ({ wrapper = id }) => (
  Component,
  target,
  props
) => {
  ReactDOM.render(wrapper(<Component {...props} />), target);
};

export function buildPages(
  modules: Record<string, Record<string, any> & { default?: any }>,
  renderer = reactRenderer({})
) {
  const pages = map(modules, ([name, el]) => {
    const config = el.default || {};
    const stories = el.default?.stories
      ? el.default?.stories
      : omit(el, "default");
    return {
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
  });
  return pages;
}
