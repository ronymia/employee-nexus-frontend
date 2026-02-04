import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import relativeTime from "dayjs/plugin/relativeTime";

// Extend dayjs with required plugins
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);

/**
 * Date format presets following strict UTC → Local conversion rules
 */
export const FORMAT_PRESETS = {
  /** Standard date display: "Feb 04, 2026" */
  DISPLAY_DATE: "MMM DD, YYYY",

  /** Date with time: "Feb 04, 2026 02:30 PM" */
  DISPLAY_DATETIME: "MMM DD, YYYY hh:mm A",

  /** Input field format: "04-02-2026" */
  INPUT_DATE: "DD-MM-YYYY",

  /** Short date: "Feb 04" */
  SHORT_DATE: "MMM DD",

  /** ISO date format: "2026-02-04" */
  ISO_DATE: "YYYY-MM-DD",

  /** Month and year: "February 2026" */
  MONTH_YEAR: "MMMM YYYY",

  /** Full date: "February 04, 2026" */
  FULL_DATE: "MMMM DD, YYYY",

  /** Compact date: "02/04/2026" */
  COMPACT_DATE: "MM/DD/YYYY",

  /** Time only: "02:30 PM" */
  TIME_ONLY: "hh:mm A",
} as const;

/**
 * Options for customFormatDate function
 */
export interface CustomFormatDateOptions {
  /** Fallback text when date is invalid/null/undefined. Default: "N/A" */
  fallback?: string;

  /** If true, returns relative time (e.g., "2 hours ago") instead of formatted date */
  relative?: boolean;
}

/**
 * RULE: DATA OUT (UI / Display / Frontend) — ALWAYS LOCAL
 *
 * Format a date for display in the UI by converting UTC → Local time.
 * This is the primary function for displaying dates to users.
 *
 * @param date - The date to format (can be UTC string, Date object, or dayjs instance)
 * @param format - The format string (use FORMAT_PRESETS for consistency). Default: "MMM DD, YYYY"
 * @param options - Additional formatting options
 * @returns Formatted date string in local timezone
 *
 * @example
 * // Display a date from API (UTC) to user (local)
 * customFormatDate("2026-02-04T04:00:00.000Z") // → "Feb 04, 2026"
 *
 * @example
 * // With custom format
 * customFormatDate("2026-02-04T04:00:00.000Z", FORMAT_PRESETS.DISPLAY_DATETIME)
 * // → "Feb 04, 2026 10:00 AM" (if user is in UTC+6)
 *
 * @example
 * // Relative time
 * customFormatDate(timestamp, undefined, { relative: true }) // → "2 hours ago"
 *
 * @example
 * // With fallback for null values
 * customFormatDate(null, undefined, { fallback: "Not set" }) // → "Not set"
 */
export function customFormatDate(
  date: string | Date | dayjs.Dayjs | null | undefined,
  format: string = FORMAT_PRESETS.DISPLAY_DATE,
  options: CustomFormatDateOptions = {},
): string {
  const { fallback = "N/A", relative = false } = options;

  // Handle null/undefined
  if (!date) {
    return fallback;
  }

  try {
    // Parse as UTC and convert to local
    const dayjsDate = dayjs.utc(date).local();

    // Check if valid
    if (!dayjsDate.isValid()) {
      return fallback;
    }

    // Return relative time if requested
    if (relative) {
      return dayjsDate.fromNow();
    }

    // Return formatted date in local timezone
    return dayjsDate.format(format);
  } catch (error) {
    console.error("Error formatting date:", error);
    return fallback;
  }
}

/**
 * RULE: DATA IN (Payloads / API / Database) — ALWAYS UTC
 *
 * Convert a local date/time input to UTC ISO string for API submission.
 * This function ensures all dates sent to the backend are in UTC format.
 *
 * @param date - The date to convert (local time string, Date object, or dayjs instance)
 * @param inputFormat - The format of the input date string (if string). Default: "DD-MM-YYYY"
 * @returns UTC ISO string ready for API submission
 *
 * @example
 * // Convert form input (local) to UTC for API
 * formatDateForAPI("04-02-2026") // → "2026-02-03T18:00:00.000Z" (if user is in UTC+6)
 *
 * @example
 * // With custom input format
 * formatDateForAPI("2026-02-04", "YYYY-MM-DD") // → "2026-02-03T18:00:00.000Z"
 *
 * @example
 * // From Date object
 * formatDateForAPI(new Date("2026-02-04")) // → UTC ISO string
 */
export function formatDateForAPI(
  date: string | Date | dayjs.Dayjs | null | undefined,
  inputFormat: string = FORMAT_PRESETS.INPUT_DATE,
): string {
  if (!date) {
    throw new Error("Date is required for API formatting");
  }

  try {
    // If it's a string, parse with the provided format, otherwise parse directly
    const dayjsDate =
      typeof date === "string" ? dayjs.utc(date, inputFormat) : dayjs.utc(date);

    if (!dayjsDate.isValid()) {
      throw new Error(`Invalid date: ${date}`);
    }

    // Return UTC ISO string
    return dayjsDate.toISOString();
  } catch (error) {
    console.error("Error formatting date for API:", error);
    throw error;
  }
}

/**
 * RULE: DATA IN - For datetime inputs (date + time)
 *
 * Convert a datetime input to UTC ISO string for API submission.
 * Use this when you have both date and time components.
 *
 * @param datetime - The datetime to convert (can be Date object, dayjs instance, or ISO string)
 * @returns UTC ISO string
 *
 * @example
 * // Convert datetime from form to UTC
 * formatDateTimeForAPI(new Date("2026-02-04T14:30:00"))
 * // → "2026-02-04T08:30:00.000Z" (if user is in UTC+6)
 */
export function formatDateTimeForAPI(
  datetime: string | Date | dayjs.Dayjs | null | undefined,
): string {
  if (!datetime) {
    throw new Error("Datetime is required for API formatting");
  }

  try {
    // Parse as UTC if it's already an ISO string, otherwise convert to UTC
    const dayjsDate = dayjs(datetime).utc();

    if (!dayjsDate.isValid()) {
      throw new Error(`Invalid datetime: ${datetime}`);
    }

    return dayjsDate.toISOString();
  } catch (error) {
    console.error("Error formatting datetime for API:", error);
    throw error;
  }
}

/**
 * Get current UTC timestamp as ISO string
 * Use this for creating timestamps for API submission
 *
 * @returns Current time in UTC ISO format
 *
 * @example
 * getCurrentUTCTimestamp() // → "2026-02-04T08:29:08.000Z"
 */
export function getCurrentUTCTimestamp(): string {
  return dayjs().utc().toISOString();
}

/**
 * Get start of day in UTC for date range queries
 *
 * @param date - The date (optional, defaults to today)
 * @returns Start of day in UTC ISO format
 *
 * @example
 * getUTCStartOfDay() // → Today at 00:00:00.000Z
 */
export function getUTCStartOfDay(date?: string | Date | dayjs.Dayjs): string {
  return dayjs(date).utc().startOf("day").toISOString();
}

/**
 * Get end of day in UTC for date range queries
 *
 * @param date - The date (optional, defaults to today)
 * @returns End of day in UTC ISO format
 *
 * @example
 * getUTCEndOfDay() // → Today at 23:59:59.999Z
 */
export function getUTCEndOfDay(date?: string | Date | dayjs.Dayjs): string {
  return dayjs(date).utc().endOf("day").toISOString();
}
