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

export function PlusIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      stroke="currentColor"
      {...props}
    >
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  );
}

export function CloseIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      stroke="currentColor"
      {...props}
    >
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  );
}
