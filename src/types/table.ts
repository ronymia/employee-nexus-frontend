import type { ElementType } from "react";
import type { IconType } from "react-icons";

export interface TableActionType {
  name: string;
  type: "link" | "button";
  href?: string | ((row: any) => string);
  handler: (row: any) => void;
  Icon?: ElementType | IconType;
  permissions: string[];
  disabledOn: { accessorKey: string; value: any }[];
  isLoading?: (row: any) => boolean;
}

export interface TableColumnType {
  key: string;
  dataIndex?: string;
  header: string;
  accessorKey: string;
  accessorFn?: (row: any) => any;
  minWidth?: number;
  show: boolean;
  isMainField?: boolean;
  align?: "left" | "center" | "right";
  // Add these for sorting
  sortable?: boolean;
  filterable?: boolean;
  sortDirection?: "ascending" | "descending" | null;
  //   sortDirections: ['descend'];
  defaultSortOrder?: "ascending";
  filterSearch?: boolean;
  showSorterTooltip?: { target: "full-header" };
  filters?: [
    {
      text: "Joe";
      value: "Joe";
      children: [];
    }
  ];
  // onFilter: (value, record) => record.name.indexOf(value as string) === 0;
  // sorter: (a, b) => a.name.length - b.name.length;
  fixed?: "left" | "right";
}
