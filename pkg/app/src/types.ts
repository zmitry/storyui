import React from "react";
export type Story = {
  nest: boolean;
  framed: boolean;
  name: string;
  Component: React.Component;
  render: any;
};

export type File = {
  layout: React.Component;
  name: string;
  nest: boolean;
  config: any;
  framed: boolean;
  cases: Story[];
  component: React.Component;
  inputs: any;
};
