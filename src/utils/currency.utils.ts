export const getCurrencySymbol = (currencyCode: string): string => {
  try {
    if (!currencyCode) return "";

    // Check for common manual overrides if Intl doesn't satisfy or for fallback
    // e.g. BDT might not render '৳' in all environments without locale, but usually works with 'en-BD' or just code.
    // However, simplest standard way:
    return (
      new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: currencyCode,
      })
        .formatToParts(1)
        .find((part) => part.type === "currency")?.value || currencyCode
    );
  } catch (error) {
    // If currency code is invalid, return the code itself
    return currencyCode;
  }
};
