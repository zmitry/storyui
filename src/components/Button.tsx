import React from "react";

export interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {}

export function Button(props: ButtonProps) {
  return <button className="uibook-button" {...props} />;
}
