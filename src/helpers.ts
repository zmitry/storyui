export function omit(object, ...keys: string[]) {
  return keys.reduce(
    (obj, key) => {
      if (object && object.hasOwnProperty(key)) {
        delete obj[key];
      }
      return obj;
    },
    { ...object }
  );
}

export function capitalize(text: string) {
  if (!text) {
    return text;
  }
  const [t, ...rest] = text;
  const d = t.toUpperCase() + rest.join("");
  return d;
}
