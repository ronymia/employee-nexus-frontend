"use client";

import {
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import type { TableActionType, TableColumnType } from "@/types";
import CustomColumnsSet from "./CustomColumnsSet";
import TableHeader from "./TableHeader";
import TableFooter from "./TableFooter";
import TableBody from "./TableBody";
import CustomSearchField from "../form/input/CustomSearchField";
import TableActionButton from "./TableActionButton";
import useDeviceWidth from "@/hooks/useDeviceWidth";

export interface PaginationConfigType {
  page: number;
  limit: number;
  skip?: number;
  total: number;
  totalPages?: number;
  paginationTotal?: number;
  showPagination: boolean;
  paginationHandler: (page: number) => void;
  changeLimitHandler: (limit: number) => void;
}

export interface TableConfigType {
  stickyHeader?: boolean;
  tableType?: "default" | "compact";
}

export interface SearchConfigType {
  searchable: boolean;
  debounceDelay: number;
  defaultField: string;
  searchableFields: { label: string; value: string }[];
}
interface ICustomTableProps {
  children?: ReactNode;
  rowHeight?: string;
  dataSource: any[];
  columns: TableColumnType[];
  setColumns: Dispatch<SetStateAction<TableColumnType[]>>;
  isLoading: boolean;
  actions: TableActionType[];
  dataAuto?: string;
  tableConfig?: TableConfigType;
  sortConfig?: {
    key: string;
    direction: "ascending" | "descending";
  };
  searchConfig?: SearchConfigType;
  paginationConfig?: PaginationConfigType;
}

export default function CustomTable({
  children,
  dataSource = [],
  columns = [],
  setColumns = () => {},
  isLoading = false,
  actions = [],
  tableConfig = {
    tableType: "default",
  },
  searchConfig = {
    searchable: false,
    debounceDelay: 500,
    defaultField: "",
    searchableFields: [],
  },
  paginationConfig = {
    page: 1,
    limit: 10,
    skip: 0,
    total: 0,
    totalPages: 0,
    paginationTotal: 0,
    showPagination: false,
    paginationHandler: () => {},
    changeLimitHandler: () => {},
  },
}: ICustomTableProps) {
  // GET DEVICE WIDTH
  const windowInnerWidth = useDeviceWidth();
  const [sortedData, setSortedData] = useState(dataSource);

  // SORTED ROWS
  const sortedRows = useMemo(() => sortedData, [sortedData]);

  // UPDATE COLUMNS TO SHOW ONLY VISIBLE ONES
  const visibleColumns = columns.filter((col) => col?.show === true);

  /* ===================================== RETURN JSX ===================================== */
  return (
    <div className={``}>
      {/* COLUMNS SET AND FILTER  */}
      <section
        className={`flex items-center justify-between flex-col md:flex-row`}
      >
        {windowInnerWidth > 768 && (
          <CustomColumnsSet columns={columns} setColumns={setColumns} />
        )}

        <div className={`flex items-center gap-3 flex-col-reverse md:flex-row`}>
          <CustomSearchField
            searchable={searchConfig?.searchable}
            debounceDelay={searchConfig?.debounceDelay}
            defaultValue={searchConfig?.defaultField}
            changeHandler={(searchCondition) => {
              /** Handle search */
              setSortedData(
                dataSource.filter((item) =>
                  item[searchCondition.field]
                    ?.toString()
                    ?.toLowerCase()
                    ?.includes(searchCondition.value.toLowerCase())
                )
              );
            }}
            searchableFields={searchConfig?.searchableFields}
          />
          {/* TABLE CHILDREN */}
          <div className="w-full md:w-auto flex flex-row items-center justify-between md:justify-end">
            {" "}
            {windowInnerWidth < 768 && (
              <CustomColumnsSet columns={columns} setColumns={setColumns} />
            )}
            {children}
          </div>
        </div>
      </section>
      {/* TABLE */}
      {windowInnerWidth > 768 && (
        <table
          key={tableConfig.tableType}
          className="w-full border-separate border-spacing-y-2 table-auto text-sm"
        >
          {/* <===================================== Table Header ===================================> */}
          <TableHeader
            columns={visibleColumns}
            setColumns={setColumns}
            actions={actions}
            dataSource={sortedRows}
            originalDataSource={dataSource}
            setDataSource={setSortedData}
          />

          {/* <===================================== Table Body ===================================> */}
          {tableConfig.tableType === "default" && (
            <TableBody
              key={tableConfig.tableType}
              dataSource={sortedRows}
              columns={visibleColumns}
              isLoading={isLoading}
              actions={actions}
            />
          )}

          {/* <===================================== Table Footer ==================================> */}
          {paginationConfig.showPagination && (
            <TableFooter
              columns={visibleColumns}
              paginationConfig={paginationConfig}
            />
          )}
        </table>
      )}
      {windowInnerWidth < 768 &&
        sortedRows.length > 0 &&
        sortedRows.map((row, rowIndex) => (
          <table key={rowIndex}>
            <thead>
              <TableActionButton row={row} actions={actions} dataAuto="" />
            </thead>
            <tbody>
              {visibleColumns.map((col, columnIndex) => (
                <tr key={columnIndex}>
                  <td>{col?.header} : </td>
                  <td>{row[col.accessorKey]} </td>
                </tr>
              ))}
            </tbody>
          </table>
        ))}
    </div>
  );
}
