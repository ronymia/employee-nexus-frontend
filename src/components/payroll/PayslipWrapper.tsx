"use client";

import { IPayrollItem } from "@/types";
import moment from "moment";
import { useState } from "react";
import { PiDownloadSimple, PiXCircle, PiEye } from "react-icons/pi";
import dynamic from "next/dynamic";

// Dynamically import PDFDownloadLink and PDFViewer to avoid SSR issues
const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  { ssr: false }
);

const PDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFViewer),
  { ssr: false }
);

// Import the PDF document component
import { PayslipPDF } from "./PayslipPDF";

interface PayslipProps {
  item: IPayrollItem;
  onClose?: () => void;
  showActions?: boolean;
}

function PayslipWrapper({ item, onClose, showActions = true }: PayslipProps) {
  const [showPDFPreview, setShowPDFPreview] = useState(false);
  console.log({ item });

  return (
    <div className="w-full">
      {/* Action Buttons */}
      {showActions && (
        <div className="flex items-center justify-between mb-4 p-4 bg-base-200 rounded-lg">
          <div className="flex gap-2">
            <button
              onClick={() => setShowPDFPreview(!showPDFPreview)}
              className="btn btn-sm btn-primary gap-2"
            >
              <PiEye size={18} />
              {showPDFPreview ? "Hide" : "Preview"} PDF
            </button>
            <PDFDownloadLink
              document={<PayslipPDF item={item} />}
              fileName={`payslip-${item.user?.profile?.fullName}-${moment(
                item.payrollCycle?.periodEnd
              ).format("MMM-YYYY")}.pdf`}
              className="btn btn-sm btn-secondary gap-2"
            >
              {({ loading }) => (
                <>
                  <PiDownloadSimple size={18} />
                  {loading ? "Generating..." : "Download PDF"}
                </>
              )}
            </PDFDownloadLink>
          </div>
          {onClose && (
            <button onClick={onClose} className="btn btn-sm btn-ghost gap-2">
              <PiXCircle size={18} />
              Close
            </button>
          )}
        </div>
      )}

      {/* PDF Preview */}
      {showPDFPreview && (
        <div className="mb-4 border-2 border-gray-300 rounded-lg overflow-hidden">
          <PDFViewer width="100%" height="800px">
            <PayslipPDF item={item} />
          </PDFViewer>
        </div>
      )}

      {/* Info Message when not in preview mode */}
      {!showPDFPreview && (
        <div className="alert alert-info">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="stroke-current shrink-0 w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <span>
            Click "Preview PDF" to view the payslip or "Download PDF" to save
            it.
          </span>
        </div>
      )}
    </div>
  );
}

export default PayslipWrapper;
