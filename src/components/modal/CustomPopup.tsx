import useDeviceWidth from "@/hooks/useDeviceWidth";
import { IPopupOption } from "@/types";
import React, { type Dispatch, type SetStateAction } from "react";
import { IoCloseCircleSharp } from "react-icons/io5";
import Popup from "reactjs-popup";
import Swal from "sweetalert2";
//

export default function CustomPopup({
  children,
  popupOption,
  setPopupOption,
  customWidth,
  customHeight,
}: {
  children?: React.ReactNode;
  popupOption: IPopupOption;
  setPopupOption: Dispatch<SetStateAction<IPopupOption>>;
  customHeight?: string;
  customWidth?: string;
}) {
  // GET DEVICE WIDTH
  const windowInnerWidth = useDeviceWidth();
  const isMobile = windowInnerWidth < 768;

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
        width: customWidth || (isMobile ? "85%" : "40%"),
        height: customHeight || "100vh",
        maxHeight: "100vh",
        borderRadius: "0",
        background: "#fff",
        margin: "0",
        transition: "transform 0.3s ease-in-out, opacity 0.3s ease-in-out",
        transform: popupOption.open ? "translateX(0)" : "translateX(100%)",
        opacity: popupOption.open ? 1 : 0,
        position: "relative",
        ...(isMobile && {
          maxWidth: "400px",
        }),
        ...(!isMobile && {
          maxWidth: "600px",
          borderTopLeftRadius: "16px",
          borderBottomLeftRadius: "16px",
        }),
      }}
    >
      {/* CLOSE BUTTON - OUTSIDE MODAL */}
      <button
        type="button"
        onClick={handleClosePopup}
        className={`absolute -left-10 top-4 rounded-full shadow-lg z-50 `}
        aria-label="Close modal"
      >
        <IoCloseCircleSharp size={36} className="text-red-500 " />
      </button>

      {/* HEADER */}
      <header className="p-4 flex justify-between items-center drop-shadow shadow">
        {/* TITLE */}
        <h1 className="m-0 text-2xl font-semibold py-1.5">
          {popupOption.title}
        </h1>
      </header>

      {/* CONTENT */}
      <div className="p-2.5 flex-1 overflow-hidden overflow-y-scroll scroll-smooth scrollbar-hide">
        {children}
      </div>
    </Popup>
  );
}
