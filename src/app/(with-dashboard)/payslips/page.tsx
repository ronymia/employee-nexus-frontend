"use client";

import { useState } from "react";
import { useQuery } from "@apollo/client/react";
import { GET_ALL_PAYSLIPS } from "@/graphql";
import CustomLoading from "@/components/loader/CustomLoading";
import { IPayrollItem } from "@/types";
import moment from "moment";
import { PiDownloadSimple, PiReceipt, PiCalendar } from "react-icons/pi";
import CustomPopup from "@/components/modal/CustomPopup";
import usePopupOption from "@/hooks/usePopupOption";
import PayslipWrapper from "@/components/payroll/PayslipWrapper";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import useAppStore from "@/hooks/useAppStore";

interface PayslipCardProps {
  item: IPayrollItem;
  onViewPayslip: (item: IPayrollItem) => void;
}

const PayslipCard = ({ item, onViewPayslip }: PayslipCardProps) => {
  const month = moment(item.payrollCycle?.periodEnd).format("MMMM YYYY");
  const earnings = item.grossPay;
  const deductions = item.totalDeductions;
  const grossPay = item.grossPay;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow">
      {/* Mobile View */}
      <div className="block lg:hidden">
        {/* Header with Gross Pay Circle */}
        <div className="flex items-center gap-4 mb-4">
          {/* Circular Chart */}
          <div className="relative w-20 h-20 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: "Earnings", value: earnings },
                    { name: "Deductions", value: deductions },
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={28}
                  outerRadius={38}
                  paddingAngle={2}
                  dataKey="value"
                >
                  <Cell fill="#2563eb" />
                  <Cell fill="#60a5fa" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xs font-bold text-gray-900">
                {(grossPay / 1000).toFixed(1)}K
              </span>
              <span className="text-[10px] text-gray-500">Gross Pay</span>
            </div>
          </div>

          {/* Month and Summary */}
          <div className="flex-1 items-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {month}
            </h3>
            <div className="flex items-start flex-col gap-2 text-sm">
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-primary"></span>
                <span className="text-gray-600">
                  ৳{earnings.toLocaleString()}
                </span>
                <span className="text-xs text-gray-500">Earnings</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-blue-300"></span>
                <span className="text-gray-600">
                  ৳{deductions.toLocaleString()}
                </span>
                <span className="text-xs text-gray-500">Deductions</span>
              </div>
            </div>
          </div>
        </div>

        {/* Earnings Section */}
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-primary mb-2">Earnings</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Basic</span>
              <span className="font-medium">
                ৳{item.basicSalary.toLocaleString()}
              </span>
            </div>
            {item.components
              ?.filter((c) => c.component?.componentType === "EARNING")
              .map((comp, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span className="text-gray-600">{comp.component?.name}</span>
                  <span className="font-medium">
                    ৳{comp.amount.toLocaleString()}
                  </span>
                </div>
              ))}
          </div>
        </div>

        {/* Deductions Section */}
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-primary mb-2">
            Deductions
          </h4>
          <div className="space-y-2">
            {item.components
              ?.filter((c) => c.component?.componentType === "DEDUCTION")
              .map((comp, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span className="text-gray-600">{comp.component?.name}</span>
                  <span className="font-medium">
                    ৳{comp.amount.toLocaleString()}
                  </span>
                </div>
              ))}
          </div>
        </div>
        {/* <div className="flex flex-col gap-1">
         
        </div> */}

        {/* Gross Deductions */}
        <div className="flex justify-between items-center py-2 border-t border-gray-200 mb-4">
          <span className="text-sm font-semibold text-primary">
            Gross Deductions
          </span>
          <span className="text-sm font-bold text-primary">
            ৳{deductions.toLocaleString()}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => onViewPayslip(item)}
            className="flex-1 btn btn-sm btn-primary text-white"
          >
            Download
          </button>
          <button className="flex-1 btn btn-sm btn-outline btn-primary">
            Raise Issue
          </button>
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden lg:block">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <PiReceipt className="text-primary" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{month}</h3>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <PiCalendar size={16} />
                <span>
                  {moment(item.payrollCycle?.periodStart).format("MMM DD")} -{" "}
                  {moment(item.payrollCycle?.periodEnd).format("MMM DD, YYYY")}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-sm text-gray-500">Gross Pay</p>
              <p className="text-2xl font-bold text-gray-900">
                ৳{grossPay.toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Net Pay</p>
              <p className="text-2xl font-bold text-green-600">
                ৳{item.netPay.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-4">
          {/* Earnings */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-primary"></span>
              Earnings: ৳{earnings.toLocaleString()}
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Basic</span>
                <span className="font-medium">
                  ৳{item.basicSalary.toLocaleString()}
                </span>
              </div>
              {item.components
                ?.filter((c) => c.component?.componentType === "EARNING")
                .map((comp, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {comp.component?.name}
                    </span>
                    <span className="font-medium">
                      ৳{comp.amount.toLocaleString()}
                    </span>
                  </div>
                ))}

              {/* Adjustments - Earnings */}
              {(item.adjustments?.filter(
                (adj) => adj.type === "bonus" || adj.type === "reimbursement",
              ).length ?? 0) > 0 && (
                <div className="mt-3 pt-3 border-t border-green-200">
                  <p className="text-xs font-semibold text-green-600 mb-2">
                    Adjustments
                  </p>
                  {item.adjustments
                    ?.filter(
                      (adj) =>
                        adj.type === "bonus" || adj.type === "reimbursement",
                    )
                    .map((adj, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span className="text-green-600">
                          {adj.description}
                        </span>
                        <span className="font-medium text-green-600">
                          +৳{adj.amount.toLocaleString()}
                        </span>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>

          {/* Deductions */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-300"></span>
              Deductions: ৳{deductions.toLocaleString()}
            </h4>
            <div className="space-y-2">
              {item.components
                ?.filter((c) => c.component?.componentType === "DEDUCTION")
                .map((comp, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {comp.component?.name}
                    </span>
                    <span className="font-medium">
                      ৳{comp.amount.toLocaleString()}
                    </span>
                  </div>
                ))}

              {/* Adjustments - Deductions */}
              {(item.adjustments?.filter(
                (adj) =>
                  adj.type === "penalty" || adj.type === "advance_deduction",
              ).length ?? 0) > 0 && (
                <div className="mt-3 pt-3 border-t border-red-200">
                  <p className="text-xs font-semibold text-red-600 mb-2">
                    Adjustments
                  </p>
                  {item.adjustments
                    ?.filter(
                      (adj) =>
                        adj.type === "penalty" ||
                        adj.type === "advance_deduction",
                    )
                    .map((adj, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span className="text-red-600">{adj.description}</span>
                        <span className="font-medium text-red-600">
                          -৳{adj.amount.toLocaleString()}
                        </span>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <span
              className={`badge ${
                item.status === "PAID"
                  ? "badge-success"
                  : item.status === "APPROVED"
                    ? "badge-info"
                    : "badge-warning"
              } badge-sm`}
            >
              {item.status}
            </span>
            {item.paidAt && (
              <span className="text-xs text-gray-500">
                Paid on {moment(item.paidAt).format("MMM DD, YYYY")}
              </span>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => onViewPayslip(item)}
              className="btn btn-sm btn-primary gap-2"
            >
              <PiDownloadSimple size={16} />
              Download PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Dummy data for UI preview
// const dummyPayslips: any[] = [
//   {
//     id: 1,
//     userId: 1,
//     payrollCycleId: 1,
//     basicSalary: 30000,
//     grossPay: 67500,
//     totalDeductions: 5500,
//     netPay: 62000,
//     status: "PAID",
//     paymentMethod: "BANK_TRANSFER",
//     transactionRef: "TXN202502001",
//     paidAt: "2022-02-28T10:30:00Z",
//     createdAt: "2022-02-28T10:00:00Z",
//     user: {
//       id: 1,
//       profile: {
//         fullName: "John Doe",
//       },
//       employee: {
//         employeeId: "EMP001",
//         department: {
//           name: "Engineering",
//         },
//         designation: {
//           name: "Senior Developer",
//         },
//       },
//     },
//     payrollCycle: {
//       periodStart: "2022-02-01",
//       periodEnd: "2022-02-28",
//       paymentDate: "2022-03-05",
//     },
//     components: [
//       {
//         id: 1,
//         amount: 2980,
//         component: {
//           name: "Leave Encashment",
//           componentType: "EARNING",
//         },
//       },
//       {
//         id: 2,
//         amount: 15000,
//         component: {
//           name: "HRA",
//           componentType: "EARNING",
//         },
//       },
//       {
//         id: 3,
//         amount: 10000,
//         component: {
//           name: "Other Allowance",
//           componentType: "EARNING",
//         },
//       },
//       {
//         id: 4,
//         amount: 9520,
//         component: {
//           name: "SPL Allowance",
//           componentType: "EARNING",
//         },
//       },
//       {
//         id: 5,
//         amount: 3000,
//         component: {
//           name: "Employee PF Contribution",
//           componentType: "DEDUCTION",
//         },
//       },
//       {
//         id: 6,
//         amount: 1000,
//         component: {
//           name: "Income Tax",
//           componentType: "DEDUCTION",
//         },
//       },
//       {
//         id: 7,
//         amount: 1500,
//         component: {
//           name: "Insurance",
//           componentType: "DEDUCTION",
//         },
//       },
//     ],
//     adjustments: [
//       {
//         id: 1,
//         payrollItemId: 1,
//         type: "bonus",
//         description: "Project Completion Bonus",
//         amount: 8000,
//         isRecurring: false,
//         createdBy: 1,
//         notes: "Milestone achievement",
//         createdAt: "2022-02-25T10:00:00Z",
//         updatedAt: "2022-02-25T10:00:00Z",
//       },
//     ],
//   },
//   {
//     id: 2,
//     userId: 1,
//     payrollCycleId: 2,
//     basicSalary: 30000,
//     grossPay: 65000,
//     totalDeductions: 4800,
//     netPay: 60200,
//     status: "APPROVED",
//     paymentMethod: "BANK_TRANSFER",
//     transactionRef: null,
//     paidAt: null,
//     createdAt: "2022-03-28T10:00:00Z",
//     user: {
//       id: 1,
//       profile: {
//         fullName: "John Doe",
//       },
//       employee: {
//         employeeId: "EMP001",
//         department: {
//           name: "Engineering",
//         },
//         designation: {
//           name: "Senior Developer",
//         },
//       },
//     },
//     payrollCycle: {
//       periodStart: "2022-03-01",
//       periodEnd: "2022-03-31",
//       paymentDate: "2022-04-05",
//     },
//     components: [
//       {
//         id: 8,
//         amount: 15000,
//         component: {
//           name: "HRA",
//           componentType: "EARNING",
//         },
//       },
//       {
//         id: 9,
//         amount: 10000,
//         component: {
//           name: "Transport Allowance",
//           componentType: "EARNING",
//         },
//       },
//       {
//         id: 10,
//         amount: 10000,
//         component: {
//           name: "Performance Bonus",
//           componentType: "EARNING",
//         },
//       },
//       {
//         id: 11,
//         amount: 2800,
//         component: {
//           name: "Employee PF Contribution",
//           componentType: "DEDUCTION",
//         },
//       },
//       {
//         id: 12,
//         amount: 2000,
//         component: {
//           name: "Income Tax",
//           componentType: "DEDUCTION",
//         },
//       },
//     ],
//   },
//   {
//     id: 3,
//     userId: 1,
//     payrollCycleId: 3,
//     basicSalary: 30000,
//     grossPay: 68500,
//     totalDeductions: 6200,
//     netPay: 62300,
//     status: "PENDING",
//     paymentMethod: "BANK_TRANSFER",
//     transactionRef: null,
//     paidAt: null,
//     createdAt: "2022-04-28T10:00:00Z",
//     user: {
//       id: 1,
//       profile: {
//         fullName: "John Doe",
//       },
//       employee: {
//         employeeId: "EMP001",
//         department: {
//           name: "Engineering",
//         },
//         designation: {
//           name: "Senior Developer",
//         },
//       },
//     },
//     payrollCycle: {
//       periodStart: "2022-04-01",
//       periodEnd: "2022-04-30",
//       paymentDate: "2022-05-05",
//     },
//     components: [
//       {
//         id: 13,
//         amount: 3500,
//         component: {
//           name: "Overtime Pay",
//           componentType: "EARNING",
//         },
//       },
//       {
//         id: 14,
//         amount: 15000,
//         component: {
//           name: "HRA",
//           componentType: "EARNING",
//         },
//       },
//       {
//         id: 15,
//         amount: 10000,
//         component: {
//           name: "Medical Allowance",
//           componentType: "EARNING",
//         },
//       },
//       {
//         id: 16,
//         amount: 10000,
//         component: {
//           name: "Special Allowance",
//           componentType: "EARNING",
//         },
//       },
//       {
//         id: 17,
//         amount: 3200,
//         component: {
//           name: "Employee PF Contribution",
//           componentType: "DEDUCTION",
//         },
//       },
//       {
//         id: 18,
//         amount: 1500,
//         component: {
//           name: "Income Tax",
//           componentType: "DEDUCTION",
//         },
//       },
//       {
//         id: 19,
//         amount: 1500,
//         component: {
//           name: "Professional Tax",
//           componentType: "DEDUCTION",
//         },
//       },
//     ],
//   },
// ];

export default function PayslipsPage() {
  const { popupOption, setPopupOption } = usePopupOption();
  const [selectedYear] = useState(moment().year());
  const user = useAppStore((state) => state.user);

  console.log({ user });

  const { data, loading } = useQuery<{
    payrollItems: {
      data: IPayrollItem[];
    };
  }>(GET_ALL_PAYSLIPS, {
    variables: {
      query: {
        userId: Number(user?.id),
      },
    },
    // skip: true, // Skip the query to use dummy data
  });

  // Use dummy data instead of API data
  const payslips = data?.payrollItems.data;

  const handleViewPayslip = (item: IPayrollItem) => {
    setPopupOption({
      open: true,
      form: "payslip" as any,
      actionType: "view",
      data: item,
      title: `Payslip - ${moment(item.payrollCycle?.periodEnd).format(
        "MMMM YYYY",
      )}`,
    });
  };

  if (loading) {
    return <CustomLoading />;
  }

  // Generate year options (current year and 2 previous years)
  // const currentYear = moment().year();
  // const yearOptions = [currentYear, currentYear - 1, currentYear - 2];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-primary text-white p-4 sticky top-0 z-10 shadow-md">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Payslip</h1>
          <button className="btn btn-ghost btn-sm text-white">
            <PiReceipt size={20} />
          </button>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Payslips</h1>
            <p className="text-sm text-gray-500 mt-1">
              View and download your salary slips
            </p>
          </div>
          {/* <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="select select-bordered"
          >
            {yearOptions.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select> */}
        </div>
      </div>

      {/* Year Filter for Mobile */}
      <div className="lg:hidden px-4 py-3 bg-white border-b border-gray-200">
        {/* <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="select select-bordered select-sm w-full"
        >
          {yearOptions.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select> */}
      </div>

      {/* Content */}
      <div className="p-4 lg:p-6">
        {payslips?.length === 0 ? (
          <div className="text-center py-12">
            <PiReceipt className="mx-auto text-gray-400 mb-4" size={64} />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Payslips Found
            </h3>
            <p className="text-gray-500">
              No payslips available for {selectedYear}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {payslips?.map((item) => (
              <PayslipCard
                key={item.id}
                item={item}
                onViewPayslip={handleViewPayslip}
              />
            ))}
          </div>
        )}
      </div>

      {/* Payslip Modal */}
      <CustomPopup popupOption={popupOption} setPopupOption={setPopupOption}>
        {popupOption.form === ("payslip" as any) && (
          <PayslipWrapper
            item={popupOption.data}
            onClose={() =>
              setPopupOption({
                ...popupOption,
                open: false,
              })
            }
          />
        )}
      </CustomPopup>
    </div>
  );
}
