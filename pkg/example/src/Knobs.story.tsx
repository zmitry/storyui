import React from "react";
import { Color } from "storyui";

// props ui is automatically generated based on your default values
export function KobsStoryWithDefault({
  number = 1,
  bool = false,
  text = "qwer",
  color = "#ccc",
  date = new Date()
}) {
  console.log("date: ", number, color);
  return <div />;
}

// props ui is automatically generated based on your types
export function KobsStoryWithTypes({
  number,
  bool,
  text
}: {
  number: Number;
  bool: Boolean;
  text: String;
  color: Color;
  date: Date;
}) {
  console.log("date: ", number);
  return <div />;
}
