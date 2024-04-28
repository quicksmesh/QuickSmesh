export function convertArgsToString(obj) {
  let result = obj?._exec;
  Object.keys(obj).forEach((key) => {
    if (key !== "_exec") {
      const value = obj[key];
      if (typeof value === "boolean") {
        if (value) {
          result += key.length === 1 ? ` -${key}` : ` --${key}`;
        }
      } else {
        if (value) {
          result +=
            key.length === 1 ? ` -${key} ${value}` : ` --${key} ${value}`;
        }
      }
    }
  });
  return result;
}
