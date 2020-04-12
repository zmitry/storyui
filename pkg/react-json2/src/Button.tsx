import React from "react";

export function Button({
  className,
  title,
  ...props
}: React.HtmlHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      title={title}
      role={title ? "tooltip" : "button"}
      className={"icon-button " + className}
      {...props}
    />
  );
}
