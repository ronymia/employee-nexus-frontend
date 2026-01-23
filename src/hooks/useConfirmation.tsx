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
  onConfirm: (inputValue?: any) => Promise<void>;
  successTitle?: string;
  successMessage?: string;
  showSuccessToast?: boolean;
  input?:
    | "text"
    | "email"
    | "password"
    | "number"
    | "tel"
    | "range"
    | "textarea"
    | "select"
    | "radio"
    | "checkbox"
    | "file"
    | "url";
  inputPlaceholder?: string;
  inputRequired?: boolean;
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
    input,
    inputPlaceholder,
    inputRequired = false,
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
      input,
      inputPlaceholder,
      inputValidator: inputRequired
        ? (value: any) => {
            if (!value) {
              return "This field is required";
            }
            return null;
          }
        : undefined,
      showClass: {
        popup: "swal2-show",
        backdrop: "swal2-backdrop-show",
      },
      hideClass: {
        popup: "swal2-hide",
        backdrop: "swal2-backdrop-hide",
      },
      preConfirm: async (inputValue) => {
        try {
          await onConfirm(inputValue);
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
