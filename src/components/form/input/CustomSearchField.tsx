"use client";
import { useEffect, useState } from "react";
import { IoChevronDownCircleOutline } from "react-icons/io5";

export default function CustomSearchField({
  defaultValue = "",
  searchableFields = [],
  changeHandler,
  debounceDelay = 500,
  searchable = false,
}: {
  debounceDelay: number;
  searchable: boolean;
  defaultValue: string;
  searchableFields: { label: string; value: string }[];
  changeHandler: (payload: { field: string; value: string }) => void;
}) {
  const [selectedField, setSelectedField] = useState(defaultValue);
  const [searchTerms, setSearchTerms] = useState("");

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      changeHandler?.({
        field: selectedField,
        value: searchTerms,
      });
    }, debounceDelay);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerms, debounceDelay, changeHandler, selectedField]);

  return (
    <div
      className={`flex items-center rounded-field pl-3 outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline-2 
        has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-primary-content h-10`}
    >
      {/* <div className="shrink-0 text-base text-gray-400 select-none sm:text-sm/6">
        $
      </div> */}
      <input
        id={selectedField}
        name={selectedField}
        type="search"
        autoComplete="off"
        aria-autocomplete="none"
        placeholder={`Search by ${
          searchableFields.find((field) => field.value === selectedField)?.label
        }`}
        aria-label={`search by`}
        readOnly={searchable}
        value={searchTerms}
        onChange={(e) => {
          setSearchTerms(e.target.value);
        }}
        className={`block min-w-0 grow bg-base-300 py-1.5 pr-3 pl-1 text-base placeholder:text-gray-500 focus:outline-none sm:text-sm/6`}
      />

      {/* Dropdown for selecting search field */}
      <div className={`grid shrink-0 grid-cols-1 focus-within:relative`}>
        <select
          id={selectedField}
          name={selectedField}
          aria-label={`search by ${selectedField}`}
          disabled={searchable}
          value={selectedField}
          onChange={(e) => {
            setSelectedField(e.target.value);
          }}
          className={`h-10 focus-within:relative col-start-1 row-start-1 w-full appearance-none rounded-field bg-primary py-1.5 pr-7 pl-3 text-base 
            text-base-300 *:bg-base-300 *:text-gray-600 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-primary sm:text-sm/6`}
        >
          {searchableFields.map(({ label, value }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <IoChevronDownCircleOutline
          aria-hidden="true"
          className={`pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-base-300 sm:size-4`}
        />
      </div>
    </div>
  );
}
