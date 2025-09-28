export const getErrorMessageByPropertyName = (
  obj: Record<string, any>,
  propertyPath: string
) => {
  const properties = propertyPath.includes(".")
    ? propertyPath.split(".")
    : [propertyPath];

  let value = obj;

  for (const prop of properties) {
    if (value?.[prop] !== undefined) {
      value = value[prop];
    } else {
      return undefined;
    }
  }

  return value.message;
};
