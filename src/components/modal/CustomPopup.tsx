import { motion, AnimatePresence } from "motion/react";
import { type Dispatch, type SetStateAction } from "react";
import Popup from "reactjs-popup";
import Swal from "sweetalert2";
import useDeviceWidth from "@/hooks/useDeviceWidth";
import { IPopupOption } from "@/types";
import { IoCloseCircleSharp } from "react-icons/io5";

// ==================== INTERFACES ====================
interface ICustomPopupProps {
  children?: React.ReactNode;
  popupOption: IPopupOption;
  setPopupOption: Dispatch<SetStateAction<IPopupOption>>;
  customHeight?: string;
  customWidth?: string;
}

// ==================== CUSTOM POPUP COMPONENT ====================
export default function CustomPopup({
  children,
  popupOption,
  setPopupOption,
  customWidth,
  customHeight,
}: ICustomPopupProps) {
  // ==================== HOOKS ====================
  const windowInnerWidth = useDeviceWidth();
  const isMobile = windowInnerWidth < 768;

  // ==================== HANDLERS ====================
  const handleClosePopup = () => {
    Swal.fire({
      title: "Unsaved Changes",
      text: "You have unsaved changes. Are you sure you want to close?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, close it!",
      cancelButtonText: "No, keep editing",
    }).then((result) => {
      if (result.isConfirmed) {
        setPopupOption((prev) => ({ ...prev, open: false }));
      }
    });
  };

  // CALCULATE RESPONSIVE WIDTH
  const getModalWidth = () => {
    if (customWidth) {
      if (windowInnerWidth < 768) return "100%";
      if (windowInnerWidth < 1024) return "80%";
      return "70%";
    }
    return isMobile ? "85%" : "40%";
  };

  const modalWidth = getModalWidth();

  // ==================== RENDER ====================
  return (
    <Popup
      modal={true}
      lockScroll
      position="right center"
      open={popupOption.open}
      closeOnDocumentClick={false}
      overlayStyle={{
        background: "rgba(0, 0, 0, 0.6)",
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
      }}
      contentStyle={{
        display: "flex",
        flexDirection: "column",
        width: modalWidth,
        height: customHeight || "100vh",
        maxHeight: "100vh",
        borderRadius: "0",
        background: "#fff",
        margin: "0",
        position: "relative",
        padding: "0",
        ...(isMobile && !customWidth && { maxWidth: "400px" }),
        ...(!isMobile && {
          maxWidth: customWidth ? "none" : "600px",
          borderTopLeftRadius: "16px",
          borderBottomLeftRadius: "16px",
        }),
      }}
    >
      <AnimatePresence>
        {popupOption.open && (
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="flex flex-col h-full"
          >
            {/* CLOSE BUTTON */}
            {!isMobile && (
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                type="button"
                onClick={handleClosePopup}
                className="absolute -left-12 top-4 rounded-full shadow-lg z-50 hover:shadow-xl transition-shadow"
                aria-label="Close modal"
              >
                <IoCloseCircleSharp size={40} className="text-red-500" />
              </motion.button>
            )}

            {/* HEADER */}
            <motion.header
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="p-4 flex justify-between items-center shadow-md shrink-0 bg-white z-10"
            >
              <h1 className="m-0 text-2xl font-semibold text-base-content">
                {popupOption.title}
              </h1>
              {isMobile && (
                <button
                  type="button"
                  onClick={handleClosePopup}
                  className="btn btn-ghost btn-sm btn-circle"
                  aria-label="Close modal"
                >
                  <IoCloseCircleSharp size={24} className="text-red-500" />
                </button>
              )}
            </motion.header>

            {/* CONTENT - FIXED SCROLL ISSUE */}
            <div className="flex-1 overflow-y-auto scrollbar-hide p-4">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                {children}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Popup>
  );
}
