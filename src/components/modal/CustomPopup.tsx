import useDeviceWidth from "@/hooks/useDeviceWidth";
import { IPopupOption } from "@/types";
import React, { type Dispatch, type SetStateAction } from "react";
import { IoCloseCircleSharp } from "react-icons/io5";
import Popup from "reactjs-popup";
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
  const handleClosePopup = () =>
    setPopupOption((prev) => ({ ...prev, open: false }));

  return (
    <>
      <Popup
        modal={true}
        lockScroll
        position={isMobile ? "bottom center" : "center center"}
        open={popupOption.open}
        closeOnDocumentClick={false}
        overlayStyle={{
          background: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          justifyContent: isMobile ? "flex-end" : "center",
          alignItems: isMobile ? "flex-end" : "center",
        }}
        contentStyle={{
          display: "flex",
          flexDirection: "column",
          width: customWidth || (isMobile ? "98%" : "50%"),
          height: customHeight || "auto",
          maxHeight: "90vh",
          borderRadius: "10px",
          background: "#fff",
          margin: isMobile ? "10px" : undefined,
          ...(isMobile && {
            width: "calc(100% - 20px)",
            // maxWidth: "400px",
          }),
        }}
      >
        {/* HEADER */}
        <header
          className={`p-4 flex justify-between items-center drop-shadow shadow`}
        >
          {/* TITLE */}
          <h1 className={`m-0 text-2xl font-semibold py-1.5`}>
            {popupOption.title}
          </h1>
          <button type="button" onClick={handleClosePopup}>
            <IoCloseCircleSharp
              size={30}
              className={`text-gray-500 hover:text-error`}
            />
          </button>
        </header>

        {/* CONTENT */}
        <div
          className={`p-2.5 flex-1 overflow-hidden overflow-y-scroll scroll-smooth`}
        >
          {children}
        </div>
      </Popup>
    </>
  );
}
