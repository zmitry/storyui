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
        include: ["src", "types"],
        compilerOptions: {
          module: "esnext",
          lib: ["dom", "esnext"],
          importHelpers: true,
          declaration: true,
          sourceMap: true,
          rootDir: "./src",
          strict: true,
          noImplicitAny: false,
          downlevelIteration: true,
          strictNullChecks: false,
          strictFunctionTypes: true,
          strictPropertyInitialization: false,
          noImplicitThis: true,
          alwaysStrict: true,
          noUnusedLocals: true,
          noUnusedParameters: true,
          noImplicitReturns: true,
          noFallthroughCasesInSwitch: true,
          moduleResolution: "node",
          baseUrl: "./",
          paths: {
            "*": ["src/*", "node_modules/*"]
          },
          jsx: "react",
          esModuleInterop: true
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
