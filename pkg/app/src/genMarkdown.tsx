import React from "react";

function generateDesciption(description) {
  return description + "\n";
}

export function generatePropType(type) {
  let values;
  if (Array.isArray(type.value)) {
    values =
      "(" +
      type.value
        .map(function(typeValue) {
          return typeValue.name || typeValue.value;
        })
        .join("|") +
      ")";
  } else {
    values = type.value;
  }

  return type.name + (values ? values : "");
}

function generatePropDefaultValue(value) {
  return value.value;
}

function generateProp(propName, prop) {
  const name =
    "**" +
    propName +
    "**" +
    (prop.required ? "*" : "") +
    (prop.tsType ? ":" + generatePropType(prop.tsType) : "");
  const description = prop.description ? prop.description : "";
  return {
    name: name,
    defaultValue: prop.defaultValue
      ? generatePropDefaultValue(prop.defaultValue)
      : "",
    description,
  };
}

function generateProps(props) {
  if (!props) return <div />;
  return (
    <table>
      <tr>
        <th>Name</th>
        <th>Default</th>
        <th>Description</th>
      </tr>
      <tbody>
        {Object.keys(props)
          .sort()
          .map(function(propName) {
            return generateProp(propName, props[propName]);
          })
          .map((el) => {
            return (
              <tr>
                <td>{el.name}</td>
                <td>{el.defaultValue}</td>
                <td>{el.description}</td>
              </tr>
            );
          })}
      </tbody>
    </table>
  );
}

export function GenerateHtml(reactAPI) {
  return generateProps(reactAPI.props);
}
