import marked from "marked";

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
  return `|${name}|${
    prop.defaultValue ? generatePropDefaultValue(prop.defaultValue) : ""
  }|${description}|`;
}

function generateProps(props) {
  if (!props) return "\n";
  return (
    `|Name|Default|Description|
  |---|---|---|\n` +
    Object.keys(props)
      .sort()
      .map(function(propName) {
        return generateProp(propName, props[propName]);
      })
      .join("\n")
  );
}

export function generateMarkdown(reactAPI) {
  const markdownString =
    generateDesciption(reactAPI.description) + "\n" + generateProps(reactAPI.props);
  return markdownString;
}

export function GenerateHtml(reactAPI) {
  const t = marked(generateMarkdown(reactAPI));
  return t;
}
