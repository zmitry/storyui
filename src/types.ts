import React from "react";
type Story = {
  storyComponent: React.Component;
  name: string;
  iframe?: boolean;
  inputs: any;
};

export type File = {
  layout: React.Component;
  name: string;
  path: string;
  stories: Story[];
  component: React.Component;
  inputs: any;
};
