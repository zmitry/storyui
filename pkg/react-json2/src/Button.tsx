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

export function ExpandIcon() {
  return (
    <svg width={12} height={12} fill="none" viewBox="0 0 90 180">
      <path fill="#000" stroke="#000" d="M89 90L1 2v176l88-88z" />
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
