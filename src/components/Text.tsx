import React from "react";
export function Text({
  children,
  ...props
}: { children: React.ReactNode } & React.HtmlHTMLAttributes<HTMLSpanElement>) {
  return (
    <span className="uibook-text" {...props}>
      {children}
    </span>
  );
}
