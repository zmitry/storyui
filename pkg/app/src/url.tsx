export function parse<T = any>(query): T {
  const res = {};
  for (let [key, value] of new URLSearchParams(query).entries()) {
    try {
      res[key] = JSON.parse(value);
    } catch (e) {
      res[key] = value;
      console.error(
        "can not parse json from query at key: ",
        key,
        ", value: ",
        value
      );
    }
  }
  return res as any;
}

export function stringify(obj) {
  return new URLSearchParams(
    Object.entries(obj).map(([key, value]) => [
      key,
      JSON.stringify(value ?? null),
    ])
  ).toString();
}
