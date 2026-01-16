import dayjs from "dayjs";
import localeData from "dayjs/plugin/localeData";

// extend dayjs with localeData
dayjs.extend(localeData);

// GENERATE WEEK DAYS
export const generateWeekDays = ({
  startOfWeekDay = 0,
}: {
  startOfWeekDay?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
}) => {
  // full weekday names
  const weekdays = dayjs.weekdays();
  // short weekday names
  const weekdaysShort = dayjs.weekdaysShort();

  // reorder days based on given start day
  const reorderedDays = [
    ...weekdays.slice(startOfWeekDay),
    ...weekdays.slice(0, startOfWeekDay),
  ];

  return reorderedDays.map((day) => {
    const originalIndex = weekdays.indexOf(day);
    return {
      name: day,
      shortName: weekdaysShort[originalIndex],
      dayOfWeek: originalIndex,
    };
  });
};

// GENERATE MONTH
export const generateMonth = Array.from({ length: 12 }, (_, index) => ({
  id: index + 1,
  name: dayjs().month(index).format("MMMM"), // Full month name (e.g., January)
  shortName: dayjs().month(index).format("MMM"), // Abbreviated name (e.g., Jan)
}));

// GENERATE YEAR
export const generateYears = ({
  startOfYear = 2000,
  endOfYear = dayjs().year() + 5,
} = {}) => {
  return Array.from({ length: endOfYear - startOfYear + 1 }, (_, index) => ({
    value: startOfYear + index,
    label: String(startOfYear + index),
  }));
};

export function convertTo12HourFormat(time: string) {
  if (!time || typeof time !== "string" || !time.includes(":")) return "";

  const [hours, minutes] = time.split(":");

  let convertedHours = parseInt(hours, 10);
  if (isNaN(convertedHours)) return "";

  let meridiem = "AM";

  if (convertedHours >= 12) {
    meridiem = "PM";
    if (convertedHours > 12) convertedHours -= 12;
  } else if (convertedHours === 0) {
    convertedHours = 12;
  }

  const formattedHours = convertedHours.toString().padStart(2, "0");
  const formattedMinutes = (minutes || "00").padStart(2, "0");

  return `${formattedHours}:${formattedMinutes} ${meridiem}`;
}

export function convertTo24HourFormat(time: string) {
  if (!time || typeof time !== "string" || !time.includes(" ")) return "";

  const [rawTime, meridiem] = time.split(" ");
  if (!rawTime || !meridiem) return "";

  const [hours, minutes] = rawTime.split(":");
  let convertedHours = parseInt(hours, 10);
  if (isNaN(convertedHours)) return "";

  if (meridiem === "PM" && convertedHours !== 12) {
    convertedHours += 12;
  } else if (meridiem === "AM" && convertedHours === 12) {
    convertedHours = 0;
  }

  const formattedHours = convertedHours.toString().padStart(2, "0");
  const formattedMinutes = (minutes || "00").padStart(2, "0");

  return `${formattedHours}:${formattedMinutes}:00`;
}
