import type { TableColumnType } from "@/types";
import Pagination from "./Pagination";
import type { PaginationConfigType } from "./CustomTable";

interface ITableFooterProps {
  columns: TableColumnType[];
  paginationConfig: PaginationConfigType;
}

export default function TableFooter({
  columns,
  paginationConfig,
}: ITableFooterProps) {
  return (
    <tfoot className={`h-16 sticky bottom-0 bg-base-300 z-1`}>
      <tr className={`text-sm font-semibold`}>
        <td colSpan={columns?.length + 1}>
          <div
            className={`w-full rounded-box border border-primary-content bg-primary-content h-16 flex items-center justify-between px-4`}
          >
            {/* Pagination Info */}
            <div className={`flex flex-col items-start gap-2`}>
              <span className={`font-bold`}>
                Showing {paginationConfig?.skip} -{" "}
                {paginationConfig?.skip + paginationConfig?.paginationTotal} of{" "}
                {paginationConfig?.total}
              </span>
            </div>

            {/* Pagination Controls */}
            <div className={`flex items-center gap-4`}>
              <label className={`font-bold`}>
                Rows Per Page:
                <select
                  value={paginationConfig?.limit}
                  onChange={(e) =>
                    paginationConfig?.changeLimitHandler?.(
                      parseInt(e.target.value)
                    )
                  }
                  className={`ml-2 border border-primary rounded bg-base-300`}
                >
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
              </label>

              <Pagination
                dataAuto={`course_title_pagination`}
                perPage={paginationConfig?.limit as number}
                totalData={paginationConfig?.total}
                changeHandler={paginationConfig?.paginationHandler}
              />
            </div>
          </div>
        </td>
      </tr>
    </tfoot>
  );
}
