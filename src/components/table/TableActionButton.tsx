import { FiEdit } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import { BiShow } from "react-icons/bi";
import type { TableActionType } from "@/types";
import useAppStore from "@/stores/useAppStore";
import Link from "next/link";

interface IActionButtonsProps {
  actions: TableActionType[];
  row: any;
  dataAuto: string;
}

export default function TableActionButton({
  actions,
  row,
  dataAuto,
}: IActionButtonsProps) {
  // GET PERMISSIONS
  const { permissions } = useAppStore((state) => state) || [];
  return (
    <>
      {actions
        // .filter((action) =>
        //   action?.permissions.some((permission) =>
        //     permissions.includes(permission)
        //   )
        // )
        .filter(
          (action) =>
            !action?.disabledOn?.some(
              (disable) => row?.[disable?.accessorKey] === disable?.value
            )
        )
        .map((action) => {
          const Icon =
            action?.name === "edit"
              ? FiEdit
              : action?.name === "delete"
              ? MdDelete
              : action?.name === "view"
              ? BiShow
              : undefined;
          const dataAutoAttr = `${dataAuto}_${action?.name}-${row?.id}`;
          const iconClass = `text-3xl p-1 bg-gray-50 rounded border border-primary/20 drop-shadow cursor-pointer ${
            action?.name === "delete" ? "text-red-500" : "text-primary"
          }`;

          // Render a Link
          if (action?.type === "link" && action?.href) {
            return (
              <Link
                href={
                  typeof action.href === "function"
                    ? action.href(row)
                    : action.href
                }
                key={action?.name}
                data-auto={dataAutoAttr}
                aria-label={action.name}
              >
                {action?.Icon ? (
                  <action.Icon className={iconClass} />
                ) : Icon ? (
                  <Icon className={iconClass} />
                ) : null}
              </Link>
            );
          }

          // Default: Render a Button
          return (
            <button
              data-auto={dataAutoAttr}
              key={action?.name}
              type="button"
              onClick={() => action?.handler?.(row)}
              aria-label={action.name}
              // className={`bg-gray-100 transition border-gray-500`}
            >
              {action?.Icon ? (
                <action.Icon className={iconClass} />
              ) : Icon ? (
                <Icon className={iconClass} />
              ) : null}
            </button>
          );
        })}
    </>
  );
}
