import React from "react";

export function Button({
  className,
  title,
  ...props
}: React.HtmlHTMLAttributes<HTMLButtonElement>) {
  return (
    <button title={title} className={"icon-button " + className} {...props} />
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
      <line strokeWidth={2} cx={2} x1="12" y1="5" x2="12" y2="19"></line>
      <line strokeWidth={2} cx={2} x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  );
}

export function SettingsIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      stroke="currentColor"
      {...props}
    >
      <path
        fill="currentColor"
        d={`M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z`}
      />
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

export function ExpandButton({ expanded = false, ...props }) {
  return (
    <svg
      width="9"
      height="9"
      viewBox="0 0 217 259"
      fill="none"
      style={{
        ...props.style,
        width: 9,
        height: 9,
        color: "var(--color-icon)",
        transition: "transform 0.2s ease",
        transform: expanded ? "rotate(90deg)" : "",
      }}
      {...props}
    >
      <path
        d="M215.5 120.5L1 1V258L215.5 120.5Z"
        fill="currentColor"
        stroke="currentColor"
      />
    </svg>
  );
}
