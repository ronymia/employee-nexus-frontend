import { IPayrollSummaryEmployee } from "@/types/dashboard.type";
import { customFormatDate } from "@/utils/date-format.utils";

interface IPayrollSummaryProps {
  payrollSummary: IPayrollSummaryEmployee;
}

export default function PayrollSummary({
  payrollSummary,
}: IPayrollSummaryProps) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
      <h3 className="text-lg font-semibold text-base-content mb-4">
        Payroll Summary
      </h3>

      {/* Current Month */}
      <div className="bg-linear-to-r from-primary to-green-400 text-white rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm opacity-90">Current Month</span>
          <span className="badge badge-sm bg-white text-primary">
            {payrollSummary.currentMonth.status}
          </span>
        </div>
        <div className="text-3xl font-bold mb-1">
          ${payrollSummary.currentMonth.netPay.toLocaleString()}
        </div>
        <div className="text-sm opacity-90">Net Pay</div>
        <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
          <div>
            Gross: ${payrollSummary.currentMonth.grossPay.toLocaleString()}
          </div>
          <div>
            Deductions: $
            {payrollSummary.currentMonth.totalDeductions.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Last Payment */}
      <div className="p-4 bg-gray-50 rounded-lg mb-4">
        <div className="text-sm text-base-content/70 mb-1">Last Payment</div>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-lg font-semibold text-base-content">
              ${payrollSummary.lastPayment.netPay.toLocaleString()}
            </div>
            <div className="text-xs text-base-content/70">
              {payrollSummary.lastPayment.month}
            </div>
          </div>
          <div className="text-xs text-base-content/70">
            Paid on {customFormatDate(payrollSummary.lastPayment.paidDate)}
          </div>
        </div>
      </div>

      {/* Year to Date */}
      <div className="pt-4 border-t">
        <h4 className="text-sm font-semibold text-base-content mb-3">
          Year to Date
        </h4>
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center">
            <div className="text-lg font-bold text-base-content">
              ${(payrollSummary.yearToDate.totalGrossPay / 1000).toFixed(0)}K
            </div>
            <div className="text-xs text-base-content/70">Gross</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-error">
              ${(payrollSummary.yearToDate.totalDeductions / 1000).toFixed(0)}K
            </div>
            <div className="text-xs text-base-content/70">Deductions</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-success">
              ${(payrollSummary.yearToDate.totalNetPay / 1000).toFixed(0)}K
            </div>
            <div className="text-xs text-base-content/70">Net</div>
          </div>
        </div>
      </div>
    </div>
  );
}
