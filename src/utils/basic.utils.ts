export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number = 500
) {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
}

export default function truncateText(text: string, maxChar: number) {
  if (typeof text === "string") {
    if (text?.length <= maxChar) {
      return text;
    } else {
      const truncatedText = text?.slice(0, maxChar);
      return `${truncatedText}...`;
    }
  } else {
    return text;
  }
}
