// utils/transformResponse.ts
export const transformResponse = (response: any): any => {
  if (!response?.data) return response;

  console.log({ response });
  for (const key in response.data) {
    console.log({ key });
    const value = response.data[key];
    console.log({ value });
    // Detect { data, meta } pattern
    if (
      value &&
      typeof value === "object" &&
      "data" in value &&
      "meta" in value
    ) {
      response.data = {
        ...response.data,
        [key]: value.data, // flatten data
        meta: value.meta, // move meta
      };
    }
  }

  return response;
};
