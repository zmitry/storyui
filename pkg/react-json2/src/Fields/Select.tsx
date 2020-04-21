import React, { forwardRef } from "react";
import { Merge } from "ts-essentials";

type SelectProps = React.DetailedHTMLProps<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  HTMLSelectElement
>;
export const SelectField = forwardRef(function TextField(
  {
    defaultValue,
    onBlur,
    options,
  }: Merge<
    SelectProps,
    {
      defaultValue?: string;
      name?: string;
      onBlur: (evt: any, value: string) => void;
      options: string[];
    }
  >,
  ref: any
) {
  return (
    <select
      ref={ref}
      onChange={(e) => {
        onBlur(e, e.target.value);
      }}
      value={defaultValue}
    >
      {options.map((el, i) => (
        <option value={el} label={el} children={el} key={i} />
      ))}
    </select>
  );
});
