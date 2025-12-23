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
import MobileCardSkeleton from "../loader/MobileCardSkeleton";

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

  // SORTED ROWS - Use dataSource directly, no separate state needed
  const [searchTerm, setSearchTerm] = useState("");
  const [searchField, setSearchField] = useState("");

  const sortedRows = useMemo(() => {
    if (!searchTerm || !searchField) {
      return dataSource;
    }
    return dataSource.filter((item) =>
      item[searchField]
        ?.toString()
        ?.toLowerCase()
        ?.includes(searchTerm.toLowerCase())
    );
  }, [dataSource, searchTerm, searchField]);

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

        <div
          className={`flex items-center gap-3 flex-col-reverse md:flex-row md:justify-end md:items-end w-full`}
        >
          {searchConfig?.searchable && (
            <CustomSearchField
              searchable={searchConfig?.searchable}
              debounceDelay={searchConfig?.debounceDelay}
              defaultValue={searchConfig?.defaultField}
              changeHandler={(searchCondition) => {
                setSearchTerm(searchCondition.value);
                setSearchField(searchCondition.field);
              }}
              searchableFields={searchConfig?.searchableFields}
            />
          )}
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
            setDataSource={() => {}} // Not needed since we're using different approach
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
      {windowInnerWidth < 768 && (
        <>
          {isLoading ? (
            <MobileCardSkeleton cards={5} fields={visibleColumns.length} />
          ) : sortedRows.length > 0 ? (
            <div className="flex flex-col gap-4 mt-4">
              {sortedRows.map((row, rowIndex) => (
                <div
                  key={rowIndex}
                  className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden transition-all hover:shadow-md"
                >
                  {/* Card Header with Actions */}
                  <div className="bg-gray-50/50 px-4 py-3 border-b border-gray-100 flex justify-between items-center">
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Item #{rowIndex + 1}
                    </span>
                    <div className="flex items-center gap-2">
                      <TableActionButton
                        row={row}
                        actions={actions}
                        dataAuto=""
                      />
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 flex flex-col gap-3">
                    {visibleColumns.map((col, columnIndex) => (
                      <div
                        key={columnIndex}
                        className="flex justify-between items-start gap-4 text-sm group"
                      >
                        <span className="text-gray-500 font-medium min-w-[100px] pt-0.5">
                          {col?.header}
                        </span>
                        <span className="text-gray-900 font-medium text-right wrap-break-word flex-1">
                          {row[col.accessorKey]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
