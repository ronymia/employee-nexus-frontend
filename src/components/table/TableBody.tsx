"use client";

import TableSkeleton from "../loader/TableSkeleton";
import useDeviceWidth from "@/hooks/useDeviceWidth";
import TableActionButton from "./TableActionButton";
import type { TableActionType, TableColumnType } from "@/types";
import { noDataFoundImage } from "@/assets";
import Image from "next/image";

interface ITableBodyProps {
  dataSource: any[];
  columns: TableColumnType[];
  isLoading?: boolean;
  actions?: TableActionType[];
  dataAuto?: string;
}

export default function TableBody({
  dataSource,
  columns,
  isLoading = false,
  actions = [],
  dataAuto = "",
}: ITableBodyProps) {
  // GET DEVICE WIDTH
  const windowInnerWidth = useDeviceWidth();
  return (
    <tbody className={`w-full`}>
      {!isLoading ? (
        dataSource.length > 0 ? (
          dataSource.map((row, rowIndex) => (
            <tr key={rowIndex} className={`border-primary-content font-medium`}>
              {/* <===================================== Table Columns ===================================> */}
              {columns?.map((col, index) => (
                <td
                  key={col?.accessorKey}
                  align={col?.align || "left"}
                  style={{
                    width:
                      windowInnerWidth > 768
                        ? col?.minWidth
                          ? `${col?.minWidth}%`
                          : "auto"
                        : "100%",
                  }}
                  className={``}
                >
                  <div
                    className={`h-16 border-t border-b border-primary-content flex items-center justify-start px-4 
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
                           `}
                  >
                    {col?.accessorFn
                      ? col?.accessorFn({
                          row,
                          value: row?.[col?.accessorKey],
                        })
                      : row?.[col?.accessorKey] || "N/A"}
                  </div>
                </td>
              ))}
              {/* <===================================== Action for Desktop ==================================> */}
              {actions?.length > 0 && (
                <td className={`text-right`}>
                  <div
                    className={`flex items-center justify-start gap-x-1.5 border-t border-b border-r border-primary-content rounded-r-box h-16 pr-3`}
                  >
                    <TableActionButton
                      key={row?.id}
                      actions={actions}
                      row={row}
                      dataAuto={dataAuto}
                    />
                  </div>
                </td>
              )}
            </tr>
          ))
        ) : (
          <tr className={`bg-base-200`}>
            <td
              colSpan={columns.length + 1}
              className={`p-6 rounded-box text-center`}
            >
              <div
                className={`flex flex-col items-center justify-center gap-4 w-full h-full py-10`}
              >
                <Image
                  loading="eager"
                  src={noDataFoundImage}
                  alt="No data found"
                  className={`w-40`}
                />
                <div className={`text-center`}>
                  <h4 className={`font-semibold text-lg mb-1`}>
                    Nothing Found!
                  </h4>
                  <p className={`font-light`}>
                    {`Please add a new entity to see the content here. Thank you!`}
                  </p>
                </div>
              </div>
            </td>
          </tr>
        )
      ) : (
        <TableSkeleton columns={columns.length} rows={5} />
      )}
    </tbody>
  );
}
