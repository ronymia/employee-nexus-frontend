import { getErrorMessageByPropertyName } from "@/utils/schema-validator";
import { Controller, useFormContext } from "react-hook-form";
import { type RefObject, useState } from "react";
import useClickOutside from "@/hooks/useClickOutside";
import { AnimatePresence, motion } from "motion/react";
import { RxCrossCircled } from "react-icons/rx";
import { FaSync } from "react-icons/fa";
import truncateText from "@/utils/truncateText";
import FieldLabel from "./components/FieldLabel";

type IOption = { label: string; value: string | number };

interface ICustomSelectProps {
  position?: "top" | "bottom";
  dataAuto: string;
  id?: string;
  name: string;
  placeholder?: string;
  defaultValues?: any;
  changeHandler?: (value: any) => void;
  label?: string;
  wrapperClassName?: string;
  fieldClassName?: string;
  required: boolean;
  labelClassName?: string;
  dataTestId?: string;
  disabled?: boolean;
  multipleSelect?: boolean;
  isLoading: boolean;
  CustomCloseIcon?: any;
  options: IOption[];
  addNewItem?: boolean;
  handleAddNewItem?: () => void;
}

export default function CustomSelect({
  dataAuto: dataTestId,
  id,
  name,
  required,
  label,
  options,
  multipleSelect = false,
  isLoading = false,
  disabled = false,
  position = "bottom",
  CustomCloseIcon = RxCrossCircled,
  wrapperClassName = "",
  fieldClassName = "",
  labelClassName = "",
  placeholder = "Search...",
  addNewItem = false,
  handleAddNewItem,
}: ICustomSelectProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const errorMessage = getErrorMessageByPropertyName(errors, name);

  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useClickOutside(() => setIsOpen(false));
  const [searchTerms, setSearchTerms] = useState("");

  const filteredOptions = options?.filter((option) =>
    option?.label.toLowerCase().includes(searchTerms.toLowerCase())
  );

  return (
    <Controller
      control={control}
      name={name}
      rules={{
        required: {
          value: required,
          message: `${label} is required`,
        },
      }}
      render={({ field }) => {
        const selectedValue = multipleSelect
          ? options?.filter((item) => field?.value?.includes(item.value)) ?? []
          : options?.filter((item) => item?.value === field.value) ?? [];
        // HANDLE OPTION SELECTION
        const handleSelect = (option: IOption) => {
          // IF ALREADY SELECTED
          const isSelected = selectedValue?.some(
            (item) => item.value === option.value
          );

          // IF MULTIPLE
          if (multipleSelect) {
            // IF MULTIPLE
            if (isSelected) {
              field.onChange?.(
                field?.value?.filter((item: any) => item !== option?.value)
              );
            } else {
              field?.onChange?.([...(field.value || []), option?.value]);
            }
          } else {
            if (isSelected) {
              field.onChange("");
              setIsOpen(false);
              return;
            }
            field.onChange(option?.value);
            setIsOpen(false);
            return;
          }
        };

        // HANDLE REMOVE
        const handleRemove = (removedOption: IOption) => {
          // IF MULTIPLE
          if (multipleSelect) {
            const newSelectedOptions = field.value?.filter(
              (item: any) => item !== removedOption?.value
            );
            field.onChange?.(newSelectedOptions);
            return;
          } else {
            field.onChange?.("");
          }
        };
        return (
          <div
            ref={selectRef as RefObject<HTMLDivElement>}
            data-testid={`${dataTestId}_container`}
            className={`${wrapperClassName} flex flex-col justify-start gap-y-1.5 relative h-auto`}
          >
            {/* LABEL */}
            {label ? (
              <FieldLabel
                key={`${name}-fieldLabel`}
                htmlFor={id ? id : name}
                dataAuto={`${dataTestId}`}
                label={label}
                required={required}
                disabled={disabled}
                labelClassName={labelClassName}
              />
            ) : null}

            {/* SELECTED OPTIONS */}
            <ul
              tabIndex={0}
              onClick={() => {
                if (!isLoading && !disabled) {
                  setIsOpen(!isOpen);
                }
              }}
              className={`relative input input-md w-full flex flex-wrap gap-1 text-base-300 bg-base-300 rounded-field focus:outline-primary 
            border border-solid focus:border-primary p-1 pr-8 
            has-[input:focus-within]:border-primary 
            has-[input:focus-within]:ring-primary 
            has-[input:focus-within]:ring-2 
            has-[input:focus-within]:ring-offset-1 
            ${errorMessage ? "border-red-500" : "border-[#d9d9d9]"} 
            ${fieldClassName} 
            ${isLoading ? "cursor-not-allowed opacity-70" : "cursor-pointer"}`}
              aria-expanded={isOpen}
              aria-haspopup="listbox"
              aria-controls={``}
              role="combobox"
            >
              {/* Selected Options */}
              <AnimatePresence mode="wait">
                {selectedValue.length > 0
                  ? selectedValue.map((option) => (
                      <motion.li
                        role="option"
                        key={option.value}
                        layout
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                        data-tip={option?.label}
                        className={`${
                          disabled
                            ? "pointer-events-none bg-primary !text-base-300"
                            : "bg-primary-content"
                        } text-black px-2 rounded cursor-pointer inline-flex items-center justify-center gap-3 py-1 text-xs font-medium tooltip`}
                      >
                        {truncateText(option?.label, 20)}
                        {!disabled && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemove(option);
                              setIsOpen(false);
                            }}
                            aria-label={`Remove ${option.label}`}
                          >
                            {typeof CustomCloseIcon === "function" ? (
                              <CustomCloseIcon className="text-red-500 hover:bg-red-500 rounded-full hover:text-base-300" />
                            ) : (
                              CustomCloseIcon
                            )}
                          </button>
                        )}
                      </motion.li>
                    ))
                  : null}
                {multipleSelect && (
                  <input
                    type="search"
                    id={id ? id : name}
                    name={name}
                    value={searchTerms}
                    disabled={disabled}
                    onChange={(e) => setSearchTerms(e.target.value)}
                    placeholder={placeholder}
                    autoComplete="off"
                    className={`border-none focus:border-0 focus:outline-none text text-gray-800 p-2 w-auto bg-transparent disabled:cursor-not-allowed`}
                  />
                )}
                {!multipleSelect && selectedValue.length === 0 && (
                  <input
                    type="search"
                    id={id ? id : name}
                    name={name}
                    value={searchTerms}
                    disabled={disabled}
                    onChange={(e) => setSearchTerms(e.target.value)}
                    placeholder={placeholder}
                    autoComplete="off"
                    className={`border-none focus:border-0 focus:outline-none text text-gray-800 p-2 w-auto bg-transparent focus-within:relative disabled:cursor-not-allowed`}
                  />
                )}
              </AnimatePresence>

              {/* Right-side Icon */}
              <div className={`absolute right-2 top-1/2 -translate-y-1/2`}>
                {isLoading ? (
                  <FaSync className={"text-gray-500 animate-spin"} />
                ) : !disabled ? (
                  <motion.svg
                    initial={false}
                    animate={{ scaleY: isOpen ? -1 : 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 35,
                    }}
                    className={`h-5 w-5 text-gray-500`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </motion.svg>
                ) : null}
              </div>
            </ul>

            {/* DROPDOWN OPTIONS LIST */}
            <AnimatePresence>
              {isOpen && (
                <motion.ul
                  className={`absolute ${
                    position === "bottom" ? "top-full" : "bottom-full"
                  } mt-1.5 w-full bg-base-300 shadow-lg drop-shadow-2xs rounded overflow-y-auto max-h-64 border-2 border-primary-content z-[50] scrollbar-thin scrollbar-thumb-primary scrollbar-track-transparent`}
                  role="listbox"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* FILTERED OPTIONS */}
                  {filteredOptions?.length > 0 ? (
                    filteredOptions.map((option) => (
                      <motion.li
                        key={option?.value}
                        // whileHover={{ scale: 1.02 }}
                        onClick={() => handleSelect(option)}
                        className={`cursor-pointer px-3 py-2 m-2  hover:bg-primary rounded-md hover:text-base-300 drop-shadow-lg
                        ${
                          selectedValue.some(
                            (item) => item?.value === option?.value
                          )
                            ? "bg-primary text-base-300"
                            : "text-gray-700"
                        }
                    `}
                        role="option"
                        aria-selected={selectedValue.some(
                          (item) => item?.value === option?.value
                        )}
                      >
                        {option.label}
                      </motion.li>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-gray-500">
                      No options found
                    </div>
                  )}
                  {addNewItem && (
                    <button
                      type="button"
                      onClick={(event) => {
                        // Prevent the default behavior
                        event.stopPropagation();
                        event.preventDefault();
                        // Close the dropdown
                        setIsOpen(false);
                        // Call the addNewItem function
                        handleAddNewItem?.();
                      }}
                      className={`w-full text-center bg-primary text-base-300 py-2 hover:bg-primary-focus`}
                    >
                      Add New Option
                    </button>
                  )}
                </motion.ul>
              )}
            </AnimatePresence>
            {/* ERROR MESSAGE */}
            <small className={`text-error font-medium`}>{errorMessage}</small>
          </div>
        );
      }}
    />
  );
}
