import Swal from "sweetalert2";
import { showToast } from "@/components/ui/CustomToast";

// ==================== TYPESCRIPT INTERFACES ====================
interface IUseDeleteConfirmationOptions {
  title?: string;
  onDelete: () => Promise<void>;
  itemName?: string;
  itemDescription?: string;
  confirmButtonText?: string;
  successMessage?: string;
}

// ==================== CUSTOM HOOK ====================
export default function useDeleteConfirmation() {
  const confirm = async ({
    title = "Are you sure?",
    onDelete,
    itemName,
    itemDescription,
    confirmButtonText = "Yes, delete it!",
    successMessage = "Item deleted successfully",
  }: IUseDeleteConfirmationOptions) => {
    const htmlMessage = itemName
      ? `Do you want to delete <strong>${itemName}</strong>?${
          itemDescription
            ? `<br/><small style="color: rgba(0,0,0,0.6);">${itemDescription}</small>`
            : ""
        }`
      : "Do you want to delete this item?";

    Swal.fire({
      title,
      html: htmlMessage,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText,
      cancelButtonText: "Cancel",
      showLoaderOnConfirm: true,
      allowOutsideClick: false,
      backdrop: true,
      // Custom animations using SweetAlert's built-in classes
      showClass: {
        popup: "swal2-show",
        backdrop: "swal2-backdrop-show",
      },
      hideClass: {
        popup: "swal2-hide",
        backdrop: "swal2-backdrop-hide",
      },
      preConfirm: async () => {
        try {
          await onDelete();
          return true;
        } catch (error: any) {
          Swal.showValidationMessage(
            `Delete failed: ${error.message || "Unknown error"}`
          );
          return false;
        }
      },
    }).then((result) => {
      if (result.isConfirmed) {
        showToast.success("Deleted!", successMessage);
      }
    });
  };

  return { confirm };
}
