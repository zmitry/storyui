import React from "react";
import { Json } from "./Json";
import JSONTree from "react-json-tree";

export function JSONTSTORY() {
  // Inside a React component:
  const json = {
    array: [1, 2, 3],
    bool: true,
    object: {
      foo: "bar"
    }
  };

  return <JSONTree data={json} />;
}
export function JSONStory() {
  return (
    <Json
      value={{
        a: "1",
        b: {
          a: "1"
        },
        c: [{ a: "1" }, { a: "1" }],
        d: {
          a: {
            a: 1,
            b: "1",
            c: {
              d: {
                a: "1"
              }
            }
          }
        }
      }}
    />
  );
}

export function JSONStory2() {
  return (
    <Json
      value={{
        a: "1",
        b: {
          a: {
            a: 1,
            b: "1",
            c: {
              d: {
                a: "1"
              }
            }
          }
        },
        c: [{ a: "1" }],
        "asdfasf-d": [
          { a: "1" },
          {
            a: 1,
            b: "1"
          }
        ]
      }}
    />
  );
}

export function JSONStory3() {
  return (
    <Json
      value={[
        {
          a: "1",
          b: {
            a: {
              a: 1,
              b: "1"
            }
          },
          c: [{ a: "1" }],
          "asdfasf-d": [
            { a: "1" },
            {
              a: 1,
              b: "1"
            }
          ]
        },
        {
          a: "1",
          b: {
            a: {
              a: 1,
              b: "1"
            }
          },
          c: [{ a: "1" }],
          "asdfasf-d": [
            { a: "1" },
            {
              a: 1,
              b: "1"
            }
          ]
        }
      ]}
    />
  );
}
