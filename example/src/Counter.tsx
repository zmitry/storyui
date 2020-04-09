import React from "react";

export function Counter({ value, onClick }: { value: number; onClick: (arg: any) => void }) {
  return (
    <div>
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
