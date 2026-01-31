"use client";

import useDeviceWidth from "@/hooks/useDeviceWidth";
import type { TableActionType, TableColumnType } from "@/types";
import { useState } from "react";
import type { Dispatch, MouseEvent, SetStateAction } from "react";
import { AiFillFilter } from "react-icons/ai";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";

interface TableHeaderType {
  dataSource: any[];
  originalDataSource: any[];
  setDataSource: Dispatch<SetStateAction<any[]>>;
  columns: TableColumnType[];
  setColumns: Dispatch<SetStateAction<TableColumnType[]>>;
  actions: TableActionType[];
}

export default function TableHeader({
  dataSource,
  originalDataSource,
  setDataSource,
  columns,
  setColumns,
  actions,
}: TableHeaderType) {
  // GET DEVICE WIDTH
  const windowInnerWidth = useDeviceWidth();
  // GET SEARCH TERMS FOR FILTER
  const [searchTerms, setSearchTerms] = useState<string>("");
  // GET SELECTED FILTERS
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  // FILTERABLE HEADER
  const filterableHeader = (fieldName: string) => {
    return [...dataSource]
      ?.map((row) => row[fieldName])
      .filter((item) => item !== undefined && item !== null);
  };

  // HANDLE ON SEARCH
  const handleSearch = (searchTerms: string) => {
    setSearchTerms(searchTerms);
  };

  // HANDLE TOGGLE CHECKBOX
  const handleToggleCheckbox = (item: string, checked: boolean) => {
    if (checked) {
      setSelectedFilters([...selectedFilters, item]);
    } else {
      setSelectedFilters(selectedFilters.filter((field) => field !== item));
    }
  };

  // HANDLE SORT
  const handleSort = (fieldName: string) => {
    // FIND SORT DIRECTION
    const sortDirection = columns.find(
      (col) => col.accessorKey === fieldName,
    )?.sortDirection;

    if (!sortDirection) return;

    // UPDATE COLUMNS
    setColumns((prevColumns) =>
      prevColumns.map((col) =>
        col.accessorKey === fieldName
          ? {
              ...col,
              sortDirection:
                sortDirection === "ascending" ? "descending" : "ascending",
            }
          : col,
      ),
    );

    // UPDATE DATA
    setDataSource((prevData) => {
      const isAscending = sortDirection === "ascending";
      return prevData.sort((a, b) => {
        if (isAscending) {
          return a[fieldName] > b[fieldName] ? 1 : -1;
        } else {
          return a[fieldName] < b[fieldName] ? 1 : -1;
        }
      });
    });
  };

  // HANDLE SUBMIT FILTER
  const handleSubmit = (fieldName: string) => {
    // FIND SELECTED FILTERS
    if (selectedFilters.length === 0) {
      setDataSource(originalDataSource);
    }
    // APPLY SELECTED FILTERS
    if (selectedFilters.length > 0) {
      setDataSource((prevData) =>
        prevData.filter(
          (item) =>
            item[fieldName] && selectedFilters.includes(item[fieldName]),
        ),
      );
    }
  };

  // HANDLE RESET
  const handleReset = () => {
    setSearchTerms("");
    setSelectedFilters([]);
    setDataSource(originalDataSource);
  };
  return (
    <thead className={`h-16 sticky -top-3 bg-base-300 z-auto overflow-auto`}>
      {/* Main Header Row */}
      <tr className={``}>
        {columns?.map((col, index) => {
          // FILTERS ITEMS
          const filteredItems = filterableHeader(col?.accessorKey)?.filter(
            (item) =>
              String(item).toLowerCase().includes(searchTerms.toLowerCase()),
          );
          return (
            <th
              key={col?.accessorKey}
              align={col?.align || "left"}
              style={{
                width: col?.minWidth ? `${col?.minWidth}%` : "auto",
              }}
              className={``}
            >
              <div
                className={`h-16 bg-primary-content border-t border-b border-primary-content px-4 flex flex-row items-center justify-between cursor-pointer hover:bg-primary/30
                            ${
                              index === 0
                                ? "border-l rounded-l-box"
                                : "border-l-0"
                            }
                            ${
                              actions.length === 0 &&
                              index === columns.length - 1
                                ? "border-r rounded-r-box"
                                : "border-r-0"
                            }
                            ${col?.sortable ? "tooltip" : ""}
                           `}
                data-tip={`click to sort ${
                  col?.sortDirection === "ascending"
                    ? "descending"
                    : "ascending"
                }`}
                onClick={(e: MouseEvent<HTMLDivElement>) => {
                  const target = e.target as HTMLElement; // Cast to HTMLElement

                  if (
                    target.closest(".dropdown") ||
                    target.tagName === "INPUT" ||
                    target.tagName === "BUTTON" ||
                    target.tagName === "LABEL"
                  ) {
                    return;
                  }
                  if (col?.sortable) {
                    handleSort(col?.accessorKey);
                  }
                }}
              >
                {col?.header}

                <div
                  className={`flex flex-row items-center justify-center gap-1`}
                >
                  {/* SORTING */}
                  {col?.sortable && (
                    <div className="flex flex-col">
                      <IoMdArrowDropup
                        className={`cursor-pointer text-gray-600`}
                      />
                      <IoMdArrowDropdown
                        className={`cursor-pointer text-gray-600`}
                      />
                    </div>
                  )}

                  {/* FILTER COMPONENTS */}
                  {col?.filterable && (
                    <div
                      className={`overflow-visible dropdown  ${
                        index === 0 && windowInnerWidth < 1440
                          ? "dropdown-start"
                          : " dropdown-end"
                      }`}
                    >
                      {/* FILTER ICON */}
                      <div
                        tabIndex={0}
                        role="button"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        className={`m-1`}
                      >
                        <AiFillFilter
                          className={`cursor-pointer text-gray-600`}
                        />
                      </div>

                      {/* DROPDOWN CONTENT */}
                      <ul
                        tabIndex={0}
                        className={`dropdown-content menu bg-base-300 rounded-box z-50 w-52 max-h-80 p-2 border border-primary-content block`}
                      >
                        {/* SEARCH INPUT */}
                        <li className={`mb-1`}>
                          <input
                            type="text"
                            id={`search-${col?.accessorKey}`}
                            name={`search-${col?.accessorKey}`}
                            value={searchTerms}
                            checked={
                              selectedFilters.includes(col?.accessorKey) ||
                              false
                            }
                            placeholder={`Search ${col?.header}`}
                            onChange={(e) => handleSearch(e.target.value)}
                            className={`input input-sm bg-base-300 focus:outline-none border-primary-content focus:bg-base-300 placeholder:text-xs active:bg-base-300`}
                          />
                        </li>

                        <ul
                          className={`max-h-60 overflow-x-hidden overflow-y-scroll`}
                        >
                          {/* SEARCH RESULTS */}
                          {filteredItems?.map((item, index) => (
                            <li key={`${item}-${index}`}>
                              <label
                                htmlFor={`${col.accessorKey}-${item}`}
                                className={`flex flex-row items-center gap-x-2 ${
                                  selectedFilters.includes(item)
                                    ? "bg-primary-content text-primary"
                                    : ""
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  id={`${col.accessorKey}-${item}`}
                                  name={item}
                                  value={item}
                                  checked={
                                    selectedFilters.includes(item) || false
                                  }
                                  onChange={(e) =>
                                    handleToggleCheckbox(item, e.target.checked)
                                  }
                                  className={`checked:checkbox-primary`}
                                />
                                <span>{item}</span>
                              </label>
                            </li>
                          ))}
                        </ul>

                        {/* ACTION BUTTON */}
                        <li className={`flex flex-row justify-between mt-1`}>
                          <button
                            type="button"
                            onClick={handleReset}
                            className={`btn btn-ghost btn-xs text-primary hover:bg-primary-content border hover:border-primary`}
                          >
                            Reset
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSubmit(col?.accessorKey)}
                            className={`btn btn-xs btn-primary`}
                          >
                            Filters
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </th>
          );
        })}
        {actions.length > 0 && (
          <th
            key="actions"
            style={{
              minWidth: "5%",
              maxWidth: "10%",
              width: "5%",
            }}
            colSpan={actions.length}
            className={``}
          >
            <div
              className={`bg-primary-content flex items-center justify-start h-16 border-t border-b border-r border-primary-content rounded-r-box`}
            >
              Action
            </div>
          </th>
        )}
      </tr>
    </thead>
  );
}
