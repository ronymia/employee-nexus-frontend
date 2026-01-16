"use client";

import type { TableColumnType } from "@/types";

interface ICustomColumnsSet {
  columns: TableColumnType[];
  setColumns: React.Dispatch<React.SetStateAction<TableColumnType[]>>;
}

export default function CustomColumnsSet({
  columns = [],
  setColumns,
}: ICustomColumnsSet) {
  // const [mounted, setMounted] = useState(false);

  // useEffect(() => {
  //   setMounted(true);
  // }, []);

  // if (!mounted) return null;
  return (
    <div className={`dropdown`}>
      <div
        tabIndex={0}
        role="button"
        className={`btn btn-primary m-1 text-base-300`}
      >
        Columns
      </div>
      <ul
        tabIndex={0}
        className={`dropdown-content menu bg-base-300 rounded-box z-10 w-52 p-2 shadow-sm border border-primary-content`}
      >
        {columns.map((column) => (
          <li key={column?.accessorKey}>
            <label
              className={`cursor-pointer hover:bg-primary hover:text-base-300`}
            >
              <input
                type="checkbox"
                checked={column?.show}
                className={`checkbox-primary text-primary`}
                onChange={() => {
                  setColumns((prevColumns) =>
                    prevColumns.map((col) =>
                      col.accessorKey === column?.accessorKey
                        ? { ...col, show: !col.show }
                        : col
                    )
                  );
                }}
              />
              {column.header}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
