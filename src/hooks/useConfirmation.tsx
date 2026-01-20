import Swal from "sweetalert2";
import { showToast } from "@/components/ui/CustomToast";

// ==================== TYPESCRIPT INTERFACES ====================
interface IUseConfirmationOptions {
  title?: string;
  message?: string;
  itemName?: string;
  itemDescription?: string;
  icon?: "warning" | "info" | "question" | "success" | "error";
  confirmButtonText?: string;
  confirmButtonColor?: string;
  cancelButtonText?: string;
  onConfirm: () => Promise<void>;
  successTitle?: string;
  successMessage?: string;
  showSuccessToast?: boolean;
}

// ==================== CUSTOM HOOK ====================
export default function useConfirmation() {
  const confirm = async ({
    title = "Are you sure?",
    message,
    itemName,
    itemDescription,
    icon = "warning",
    confirmButtonText = "Yes, confirm!",
    confirmButtonColor = "#3085d6",
    cancelButtonText = "Cancel",
    onConfirm,
    successTitle = "Success!",
    successMessage = "Action completed successfully",
    showSuccessToast = true,
  }: IUseConfirmationOptions) => {
    // Build HTML message
    let htmlMessage = message || "";

    if (itemName) {
      htmlMessage = `Do you want to proceed with <strong>${itemName}</strong>?${
        itemDescription
          ? `<br/><small style="color: rgba(0,0,0,0.6);">${itemDescription}</small>`
          : ""
      }`;
    } else if (!message) {
      htmlMessage = "Do you want to proceed with this action?";
    }

    const result = await Swal.fire({
      title,
      html: htmlMessage,
      icon,
      showCancelButton: true,
      confirmButtonColor,
      cancelButtonColor: "#6b7280",
      confirmButtonText,
      cancelButtonText,
      showLoaderOnConfirm: true,
      allowOutsideClick: false,
      backdrop: true,
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
          await onConfirm();
          return true;
        } catch (error: any) {
          Swal.showValidationMessage(
            `Action failed: ${error.message || "Unknown error"}`,
          );
          return false;
        }
      },
    });

    if (result.isConfirmed && showSuccessToast) {
      showToast.success(successTitle, successMessage);
    }
  };

  return { confirm };
}
