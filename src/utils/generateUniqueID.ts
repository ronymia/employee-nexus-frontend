export const generateUniqueID = (): string => {
  const timestamp = new Date().getTime().toString();

  return timestamp;
};
