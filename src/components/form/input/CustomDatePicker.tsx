import { Controller, useFormContext } from "react-hook-form";
import { getErrorMessageByPropertyName } from "@/utils/schema-validator";
import dayjs, { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";
import customParseFormat from "dayjs/plugin/customParseFormat";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { RefObject, useEffect, useRef, useState } from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { FaRegCalendarAlt } from "react-icons/fa";
import { BiReset } from "react-icons/bi";
import { generateWeekDays } from "@/utils/date-time.utils";
import FieldLabel from "./components/FieldLabel";

// Extend dayjs with plugins
dayjs.extend(utc);
dayjs.extend(customParseFormat);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const generateYears = ({
  startOfYear,
  length,
}: {
  startOfYear: number;
  endOfYear?: number;
  length: number;
}) => {
  return Array.from({ length }, (_, index) => startOfYear + index);
};

interface ICustomDatePicker {
  id?: string;
  small?: string;
  dataAuto: string;
  name: string;
  required: boolean;
  label: string;
  placeholder?: string;
  wrapperClassName?: string;
  fieldClassName?: string;
  labelClassName?: string;
  startOfYear?: Dayjs;
  right?: boolean;
  disableBeforeDate?: any;
  disableAfterDate?: any;
  disabledDates?: {
    title: string;
    className: string;
    date: string;
  }[];
  specialDates?: {
    title: string;
    className: string;
    date: string;
    disabled: boolean;
  }[];
  businessOffDays?: {
    title: string;
    className: string;
    day: number;
    disabled: boolean;
  }[];
  disabled?: boolean;
  readOnly?: boolean;
  top?: boolean;
  startOfWeekDay?: number;
  formatDate?: string;
  pick?: "day" | "month" | "year";
  mode?: "button" | "input";
}

export default function CustomDatePicker({
  id,
  small,
  dataAuto,
  name,
  required,
  label,
  placeholder,
  wrapperClassName = "",
  fieldClassName = "",
  labelClassName = "",
  startOfYear,
  right,
  disableBeforeDate,
  disableAfterDate,
  disabledDates,
  specialDates,
  businessOffDays,
  disabled = false,
  readOnly = true,
  formatDate = "DD-MM-YYYY",
  mode = "input",
  pick = "day",
  startOfWeekDay = 0,
  top = false,
}: ICustomDatePicker) {
  const {
    control,
    formState: { errors },
    setError,
    watch,
  } = useFormContext();
  const calendarRef = useRef<any>(null);
  const [calendarVisible, setCalendarVisible] = useState(false);
  const errorMessage = getErrorMessageByPropertyName(errors, name);

  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [currentYear, setCurrentYear] = useState(
    startOfYear && dayjs(startOfYear, "DD-MM-YYYY", true).isValid()
      ? dayjs(startOfYear, "DD-MM-YYYY").year()
      : dayjs().year(),
  );

  // GENERATE YEAR ARRAY FOR CALENDER
  const [allYears, setAllYears] = useState(
    generateYears({
      startOfYear: currentYear - (currentYear % 12),
      length: 12,
    }),
  );
  const [renderComponent, setRenderComponent] = useState(pick);
  const value = watch(name);

  // OUT SIDE CLICK HANDLER
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        calendarRef.current &&
        event.target instanceof HTMLElement &&
        !(calendarRef.current as unknown as HTMLElement).contains(event.target)
      ) {
        setCalendarVisible(false);
      }
    };
    if (calendarVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [calendarVisible]);

  // SET DEFAULT DATE
  useEffect(() => {
    if (value === null || value === "" || value === undefined) {
      return;
    }

    // Validate the default date
    if (value) {
      // Validate the default date
      const parsedDefaultDate = dayjs(value, formatDate, true);
      if (!parsedDefaultDate.isValid()) {
        setError(name, {
          type: "manual",
          message: `Please enter a valid date in the format ${formatDate}`,
        });
        return;
      } else if (
        parsedDefaultDate.isValid() &&
        !!disableBeforeDate &&
        parsedDefaultDate.isSameOrBefore(
          dayjs(disableBeforeDate, formatDate),
          "day",
        )
      ) {
        setError(name, {
          type: "manual",
          message: `Please enter a date after ${dayjs(
            disableBeforeDate,
            formatDate,
          ).format(formatDate)}`,
        });
        return;
      } else if (
        parsedDefaultDate.isValid() &&
        !!disableAfterDate &&
        parsedDefaultDate.isAfter(dayjs(disableAfterDate, formatDate), "day")
      ) {
        setError(name, {
          type: "manual",
          message: `Please enter a date on or before ${dayjs(
            disableAfterDate,
            formatDate,
          ).format(formatDate)}`,
        });
        return;
      } else if (
        parsedDefaultDate.isValid() &&
        !!disabledDates?.some((disabledDate) =>
          parsedDefaultDate.isSame(dayjs(disabledDate.date, formatDate), "day"),
        )
      ) {
        setError(name, {
          type: "manual",
          message: `Please enter a date before ${dayjs(
            disableAfterDate,
            formatDate,
          ).format(formatDate)}`,
        });
        return;
      } else {
        setCurrentMonth(dayjs(parsedDefaultDate, formatDate));
        setCurrentYear(dayjs(parsedDefaultDate, formatDate).year());
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  // SET CURRENT MONTH
  useEffect(() => {
    setCurrentMonth((prevMonth) => {
      const newMonth = dayjs()
        .year(currentYear)
        .month(prevMonth.month())
        .date(1);
      return newMonth;
    });
  }, [currentYear]);

  const goToPreviousMonth = () => {
    const newMonth = currentMonth.clone().subtract(1, "month");
    setCurrentMonth(newMonth);
  };

  const goToNextMonth = () => {
    const newMonth = currentMonth.clone().add(1, "month");
    setCurrentMonth(newMonth);
  };

  const goToPreviousYearSet = () => {
    const startYear = allYears[0] - 12;
    setAllYears(Array.from({ length: 12 }, (_, index) => startYear + index));
  };

  const goToNextYearSet = () => {
    const startYear = allYears[allYears.length - 1] + 1;
    setAllYears(Array.from({ length: 12 }, (_, index) => startYear + index));
  };

  // GENERATE YEARS FOR CALENDER

  // GENERATE MONTHS FOR CALENDER
  const renderCalendarMonths = () => {
    return Array.from({ length: 12 }, (_, i) =>
      dayjs().month(i).format("MMMM"),
    );
  };
  // RENDER WEEKDAYS
  const renderWeekDays = () => {
    return generateWeekDays({ startOfWeekDay: startOfWeekDay as any }).map(
      (weekDay, index) => (
        <div
          key={`weekDay-${index}`}
          className="w-10 text-center py-2 font-bold"
        >
          {weekDay?.shortName}
        </div>
      ),
    );
  };

  const renderCalendarDays = ({
    fieldOnChange,
    fieldValue,
  }: {
    fieldOnChange: any;
    fieldValue: any;
  }) => {
    const startOfMonth = currentMonth.clone().startOf("month");
    const endOfMonth = currentMonth.clone().endOf("month");
    const daysInMonth = [];
    let currentDay = startOfMonth.clone();

    while (currentDay.isSameOrBefore(endOfMonth, "day")) {
      daysInMonth.push(currentDay);
      currentDay = currentDay.clone().add(1, "day");
    }

    // This gives how many empty boxes to insert at the beginning
    const emptyDivs = (startOfMonth.day() - startOfWeekDay + 7) % 7;

    //
    const previousMonth = dayjs(startOfMonth).subtract(1, "month");

    const daysInPrevMonth = previousMonth.daysInMonth();

    const prevMonthDates = Array.from({ length: emptyDivs }, (_, i) => {
      return dayjs(previousMonth).date(daysInPrevMonth - emptyDivs + i + 1);
    });

    const daysInMonthBoxes = currentMonth.daysInMonth();
    const emptyStartBoxes = (startOfMonth.day() - startOfWeekDay + 7) % 7;
    const totalCells = 42;
    const totalDisplayed = emptyStartBoxes + daysInMonthBoxes;
    const emptyEndBoxes = totalCells - totalDisplayed;

    const nextMonth = currentMonth.clone().add(1, "month");

    const nextMonthDates = Array.from({ length: emptyEndBoxes }, (_, i) => {
      return dayjs(nextMonth).date(i + 1);
    });

    return (
      <>
        {/* Render empty divs for alignment */}
        {prevMonthDates.map((date, index) => (
          <div
            key={`prev-${index}`}
            className="w-10 h-10 text-gray-400 flex items-center justify-center cursor-not-allowed"
          >
            {date.date()}
          </div>
        ))}

        {/* Render days of the month */}
        {daysInMonth.map((day) => {
          const isSelected = day.isSame(dayjs(fieldValue, formatDate), "day");

          const isToday = day.isSame(dayjs(), "day");

          // DISABLE BEFORE DATES
          const isDisabledBefore =
            disableBeforeDate &&
            day.isBefore(dayjs(disableBeforeDate, formatDate));

          // DISABLE AFTER DATES
          const isDisabledAfter =
            disableAfterDate &&
            day.isAfter(dayjs(disableAfterDate, formatDate));

          // MATCH SPECIAL DATE
          const matchedSpecialDate = specialDates?.find((specialDate) =>
            day.isSame(dayjs(specialDate.date, formatDate), "day"),
          );

          // DISABLE DATES
          const isDisabled =
            disabledDates?.some((disabledDate) =>
              day.isSame(dayjs(disabledDate.date, formatDate), "day"),
            ) ||
            (matchedSpecialDate?.disabled ?? false);

          // SHOULD APPLY OPACITY (Only for non-special disabled dates)
          const shouldApplyOpacity =
            (isDisabled || !!isDisabledBefore || !!isDisabledAfter) &&
            !matchedSpecialDate;

          // BUTTON CLASS
          let buttonClass = "w-10 h-10 rounded-md ";
          if (isSelected) {
            buttonClass += " bg-primary text-base-300 border-primary";
          } else if (isToday) {
            buttonClass += " bg-blue-100";
          } else {
            buttonClass +=
              " bg-gray-200 border-gray-500 border-opacity-40 hover:border-primary hover:bg-primary hover:text-base-300";
          }

          return (
            <button
              type="button"
              data-auto={`days`}
              title={`${
                // DISABLED DATES TITLE
                disabledDates?.find(
                  (d) =>
                    dayjs(d.date, "DD-MM-YYYY").format("DD-MM-YYYY") ===
                    day.format("DD-MM-YYYY"),
                )?.title || ""
              }
                ${
                  // SPECIAL DATES TITLE
                  specialDates?.find(
                    (d) =>
                      dayjs(d.date, "DD-MM-YYYY").format("DD-MM-YYYY") ===
                      day.format("DD-MM-YYYY"),
                  )?.title || ""
                }
                ${
                  // SPECIAL DATES TITLE
                  businessOffDays?.find((d) => day.day() === d.day)?.title || ""
                }
                `}
              key={day.format("x")}
              onClick={() => {
                // handleDateClick(day);

                // SET VALUE INTO HOOK FORM STATE
                fieldOnChange?.(day.format(formatDate));

                // CLOSE CALENDAR
                setCalendarVisible(false);
              }}
              className={`disabled:cursor-not-allowed ${
                shouldApplyOpacity
                  ? "disabled:border disabled:border-solid disabled:border-gray disabled:opacity-20"
                  : ""
              } ${small ? "h-7 w-7" : "md:h-10 md:w-10 h-7 w-7"}
                  ${
                    disabledDates?.find(
                      (d) =>
                        dayjs(d.date, "DD-MM-YYYY").format("DD-MM-YYYY") ===
                        day.format("DD-MM-YYYY"),
                    )?.className || ""
                  }
                  ${
                    specialDates?.find(
                      (d) =>
                        dayjs(d.date, "DD-MM-YYYY").format("DD-MM-YYYY") ===
                        day.format("DD-MM-YYYY"),
                    )?.className || ""
                  }
                   ${
                     // SPECIAL DATES TITLE
                     businessOffDays?.find((d) => day.day() === d.day)
                       ?.className || ""
                   }
                   ${buttonClass}
                `}
              disabled={isDisabled || !!isDisabledBefore || !!isDisabledAfter}
            >
              {day.format("D")}
            </button>
          );
        })}
        {/* Next month dates */}
        {nextMonthDates.map((date, index) => (
          <div
            key={`next-${index}`}
            className="w-10 h-10 text-gray-400 flex items-center justify-center cursor-not-allowed"
          >
            {date.date()}
          </div>
        ))}
      </>
    );
  };

  // MONTH AND YEAR
  const renderMonthAndYear = () => {
    return (
      <div
        data-auto={`month_year_component`}
        className="inline-flex items-center justify-center gap-x-2 w-full font-semibold text-lg"
      >
        {/* MONTH */}
        <button
          type="button"
          data-auto={`select_month`}
          onClick={() => setRenderComponent("month")} // SHOW MONTH COMPONENT
        >
          {currentMonth.format("MMMM")}
        </button>
        {/* YEAR */}
        <button
          type="button"
          data-auto={`select_year`}
          onClick={() => setRenderComponent("year")} // SHOW YEAR COMPONENT
        >
          {currentMonth.format("YYYY")}
        </button>
      </div>
    );
  };

  const handleMonthClick = (index: number) => {
    setCurrentMonth(currentMonth.clone().month(index));
    setRenderComponent("day");
  };

  const handleYearClick = (year: number) => {
    setCurrentYear(year);
    setRenderComponent("day");
  };

  return (
    <div
      ref={calendarRef as RefObject<HTMLDivElement>}
      data-auto={`${dataAuto}-date_picker_wrapper`}
      className={`relative flex flex-col justify-start gap-y-1.5 w-full ${wrapperClassName}`}
    >
      {/* LABEL */}
      {label ? (
        <FieldLabel
          key={`${name}-fieldLabel`}
          htmlFor={id ? id : name}
          dataAuto={`${dataAuto}`}
          label={label}
          required={required}
          disabled={disabled}
          labelClassName={labelClassName}
        />
      ) : null}

      {/* HOOK FORM CONTROLLER */}
      <Controller
        control={control}
        name={`${name}`}
        rules={{
          required: {
            value: required,
            message: `${label} is required`,
          },
        }}
        render={({ field }) => {
          return (
            <>
              {/* INPUT FIELD */}
              {mode === "button" ? (
                <button
                  type="button"
                  onClick={() =>
                    !disabled && setCalendarVisible(!calendarVisible)
                  }
                  className={`flex flex-row items-center justify-center gap-2 font-semibold drop-shadow-xs text-xs md:text-base text-nowrap ${
                    calendarVisible ? "text-primary" : "text-gray-500"
                  }`}
                >
                  {field.value
                    ? dayjs(field.value, formatDate).format("MMMM D, YYYY")
                    : ""}
                  <FaRegCalendarAlt />
                </button>
              ) : (
                <div className="relative">
                  <input
                    data-auto={dataAuto}
                    type="text"
                    id={id ? id : name}
                    name={name}
                    value={
                      field.value
                        ? dayjs(field.value, formatDate).format(formatDate)
                        : ""
                    }
                    placeholder={placeholder ? placeholder : label}
                    onClick={() =>
                      !disabled && setCalendarVisible(!calendarVisible)
                    }
                    readOnly={readOnly}
                    className={`w-full bg-base-300 input input-md rounded-field border px-3
                ${
                  errorMessage
                    ? "border-red-500 focus:border-red-500 focus:outline-red-500"
                    : "focus:outline-primary border-[#d9d9d9] focus:border-primary"
                }
               ${fieldClassName}`}
                  />
                  <button
                    type="button"
                    disabled={calendarVisible}
                    className={`absolute text-3xl right-2.5  bottom-1/2 translate-y-1/2 ${
                      field.value ? "-top-10" : "top-0"
                    } `}
                  >
                    {field.value ? (
                      <BiReset
                        data-tip="reset"
                        data-auto={`${dataAuto}-date_picker_reset`}
                        className={`tooltip tooltip-bottom  text-xl text-primary z-10 `}
                        onClick={(event) => {
                          event.preventDefault();
                          if (!disabled) {
                            field.onChange("");
                          }
                        }}
                      />
                    ) : (
                      <FaRegCalendarAlt
                        className="text-primary text-xl"
                        onClick={() =>
                          !disabled && setCalendarVisible(!calendarVisible)
                        }
                      />
                    )}
                  </button>
                </div>
              )}

              {/* RENDER CALENDER */}
              {calendarVisible && (
                <div
                  data-auto={`date_picker`}
                  className={`w-[350px] absolute bg-base-300 shadow-xl border border-primary-content p-5 rounded-md z-[1000]
                          ${right ? "right-0" : "left-0"}
                          ${top ? "top-auto bottom-full mb-2" : "top-full mt-2"}
                          ${
                            small
                              ? "md:w-[250px] px-3 py-3"
                              : "md:w-[350px] px-3 md:px-5 md:py-5"
                          }
        `}
                >
                  {/* DATE SELECT */}
                  {renderComponent === "day" && (
                    <section data-auto={`date_component`}>
                      {/* MONTH AND YEAR NAME */}
                      <header className="flex justify-between">
                        {/* PREVIOUS BUTTON */}
                        <button
                          type="button"
                          data-auto={`prev_month`}
                          onClick={goToPreviousMonth}
                        >
                          {" "}
                          <FaAngleLeft size={24} />{" "}
                        </button>
                        {/* SHOW MONTH AND YEAR */}
                        {renderMonthAndYear()}
                        {/* NEXT BUTTON */}
                        <button
                          type="button"
                          data-auto={`next_month`}
                          onClick={goToNextMonth}
                        >
                          {" "}
                          <FaAngleRight size={24} />
                        </button>
                      </header>

                      {/* RENDER WEEKS AND DAYS */}
                      <section
                        data-auto={`${dataAuto}-calender_days`}
                        className="grid grid-cols-7 mt-4 gap-1"
                      >
                        {renderWeekDays()}
                        {renderCalendarDays({
                          fieldOnChange: field.onChange,
                          fieldValue: field.value,
                        })}
                      </section>
                    </section>
                  )}

                  {/* MONTH SELECT COMPONENT */}
                  {renderComponent === "month" && (
                    <section data-auto={`month_component`}>
                      {/* TITLE */}
                      <header className="flex items-center justify-center">
                        <h3
                          className={`text-center mb-2 text-primary text-lg font-medium`}
                        >
                          Select Month
                        </h3>
                      </header>
                      {/* MONTH LIST */}
                      <section
                        data-auto={`month_list`}
                        className="grid grid-cols-3 gap-1 mt-4"
                      >
                        {renderCalendarMonths().map((month, index) => (
                          <button
                            key={index}
                            type="button"
                            data-auto={`${dataAuto}-month`}
                            onClick={() => handleMonthClick(index)}
                            className={`btn ${
                              currentMonth.month() === index
                                ? "bg-primary text-base-300"
                                : "border border-solid border-gray bg-primary-content opacity-60 hover:bg-primary hover:opacity-90 hover:text-base-300"
                            }`}
                          >
                            {month}
                          </button>
                        ))}
                      </section>
                    </section>
                  )}

                  {/* YEAR COMPONENT */}
                  {renderComponent === "year" && (
                    <section data-auto={`year_component`}>
                      {/* HEADER */}
                      <header className="flex justify-between">
                        {/* PREVIOUS YEARS BUTTON */}
                        <button
                          type="button"
                          data-auto={`prev_year`}
                          onClick={goToPreviousYearSet}
                        >
                          {" "}
                          <FaAngleLeft size={24} />
                        </button>
                        {/*  */}
                        <span>{`${allYears[0]} - ${
                          allYears[allYears.length - 1]
                        }`}</span>
                        {/* NEXT YEARS BUTTON */}
                        <button
                          type="button"
                          data-auto={`next_year`}
                          onClick={goToNextYearSet}
                        >
                          <FaAngleRight size={24} />
                        </button>
                      </header>

                      {/* YEAR LIST */}
                      <section
                        data-auto={`year_list`}
                        className="grid grid-cols-3 mt-4"
                      >
                        {allYears.map((year, index) => {
                          const yearDayjs = dayjs(year.toString(), "YYYY");
                          const isSelected = dayjs(
                            currentYear.toString(),
                            "YYYY",
                          ).isSame(yearDayjs);
                          return (
                            <button
                              key={index}
                              type="button"
                              data-auto={`${dataAuto}-year`}
                              onClick={() => handleYearClick(year)}
                              className={`btn ${
                                isSelected
                                  ? "bg-primary text-base-300"
                                  : "border border-solid border-gray bg-primary-content opacity-60 hover:bg-primary hover:opacity-90 hover:text-base-300"
                              }`}
                            >
                              {year}
                            </button>
                          );
                        })}
                      </section>
                    </section>
                  )}
                </div>
              )}
            </>
          );
        }}
      />
      {/* ERROR MESSAGE */}
      <small
        data-auto={`${dataAuto}-date_picker_error_message`}
        id={`${id ? id : name}-error`} // ID to link with input field's aria-describedby
        role="alert"
        aria-label="error message"
        aria-live="assertive" // Ensures screen readers announce the message immediately
        aria-atomic="true" // Ensures the whole message is read out
        className={`text-error font-medium`}
      >
        {errorMessage}
      </small>
    </div>
  );
}
