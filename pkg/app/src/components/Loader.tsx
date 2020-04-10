import React from "react";

export interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Loader(props: LoaderProps) {
  return (
    <div className="uibook-loader__position" {...props}>
      <div className="uibook-loader" />
    </div>
  );
}
