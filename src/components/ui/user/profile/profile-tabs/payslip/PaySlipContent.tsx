"use client";

import { PiReceipt } from "react-icons/pi";

export default function PaySlipContent() {
  return (
    <div className="bg-base-100 rounded-lg p-6 shadow-sm">
      <div className="flex flex-col items-center justify-center py-12">
        <PiReceipt className="text-6xl text-base-content/30 mb-4" />
        <h3 className="text-lg font-semibold mb-2 text-base-content">
          Pay Slip Information
        </h3>
        <p className="text-base-content/60 text-center">
          No pay slip records found!
        </p>
      </div>
    </div>
  );
}
