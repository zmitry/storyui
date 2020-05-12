import React, { forwardRef } from "react";
import { Merge } from "ts-essentials";

function readJsonFile(file: File) {
  var reader = new FileReader();
  reader.readAsText(file, "UTF-8");
  let done;
  let error;
  const promise = new Promise<Object>((res, rej) => {
    done = res;
    error = rej;
  });
  reader.onload = function(evt) {
    try {
      if (typeof evt.target.result === "string") {
        const res = JSON.parse(evt.target.result);
        done(res);
      } else {
        error(new Error("invalid parsed type"));
      }
    } catch (e) {
      error(e);
    }
  };
  reader.onerror = function(evt) {
    error(evt);
  };
  return promise;
}

export const JSONFileField = forwardRef(function TextField(
  {
    className = "",
    onBlur,
    name = "",
    type = "text",
    placeholder = "empty",
    multiple = false,
  }: Merge<
    React.HTMLAttributes<HTMLInputElement>,
    {
      defaultValue?: any;
      name?: string;
      onBlur: (evt: any, value: any) => void;
      type?: string;
      multiple?: boolean;
    }
  >,
  ref: any
) {
  const classNameComposed = [type, className].join(" ");

  return (
    <input
      name={name}
      type="file"
      accept="application/JSON"
      ref={ref}
      className={classNameComposed}
      placeholder={placeholder}
      multiple={multiple}
      onChange={async (e) => {
        try {
          const result = await Promise.all(
            Array.from(e.target.files).map(readJsonFile)
          );
          if (multiple) {
            onBlur(e, result);
          } else if (result.length === 1) {
            onBlur(e, result[0]);
          } else {
            console.warn("nothing was selected");
          }
        } catch (e) {
          console.error(e);
        }
      }}
    />
  );
});
