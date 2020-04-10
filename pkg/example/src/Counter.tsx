import React from "react";

/**
 *
 * # hello docs
 * ## it's me
 */
export function Counter({
  value,
  onClick,
  style
}: {
  value: number;
  onClick: (arg: any) => void;
  style: any;
}) {
  return (
    <div style={style}>
      <button
        onClick={() => {
          onClick(value + 1);
        }}
      >
        Click me
      </button>
      count:{value}
    </div>
  );
}