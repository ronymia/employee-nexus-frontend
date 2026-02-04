"use client";

import { useQuery } from "@apollo/client/react";
import CustomLoading from "@/components/loader/CustomLoading";
import { IPayrollItem } from "@/types";
import {
  PiDownloadSimple,
  PiReceipt,
  PiCurrencyDollar,
  PiTrendUp,
  PiTrendDown,
  PiUser,
} from "react-icons/pi";
import moment from "moment";
import CustomPopup from "@/components/modal/CustomPopup";
import usePopupOption from "@/hooks/usePopupOption";
import PayslipWrapper from "@/components/payroll/PayslipWrapper";
import { GET_ALL_PAYSLIPS } from "@/graphql/payslip.api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface PayslipCardProps {
  item: IPayrollItem;
  onViewPayslip: (item: IPayrollItem) => void;
}

const PayslipCard = ({ item, onViewPayslip }: PayslipCardProps) => {
  // const earnings = item.grossPay;
  // const deductions = item.totalDeductions;
  console.log({ item });

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
            <PiUser className="text-primary" size={24} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {item.user?.profile?.fullName || "N/A"}
            </h3>
            <p className="text-sm text-gray-500">
              {item.user?.employee?.employeeId || "N/A"} •{" "}
              {item.user?.employee?.designation?.name || "N/A"}
            </p>
            <p className="text-xs text-gray-500">
              {moment(item.payrollCycle?.periodStart).format("MMM DD")} -{" "}
              {moment(item.payrollCycle?.periodEnd).format("MMM DD, YYYY")}
            </p>
          </div>
        </div>

        <span
          className={`badge ${
            item.status === "PAID"
              ? "badge-success"
              : item.status === "APPROVED"
                ? "badge-info"
                : "badge-warning"
          }`}
        >
          {item.status}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="bg-blue-50 rounded-lg p-3">
          <p className="text-xs text-gray-600 mb-1">Gross Pay</p>
          <p className="text-lg font-bold text-gray-900">
            ৳{item.grossPay.toLocaleString()}
          </p>
        </div>
        <div className="bg-red-50 rounded-lg p-3">
          <p className="text-xs text-gray-600 mb-1">Deductions</p>
          <p className="text-lg font-bold text-red-600">
            ৳{item.totalDeductions.toLocaleString()}
          </p>
        </div>
        <div className="bg-green-50 rounded-lg p-3">
          <p className="text-xs text-gray-600 mb-1">Net Pay</p>
          <p className="text-lg font-bold text-green-600">
            ৳{item.netPay.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <h4 className="text-xs font-semibold text-gray-700 mb-2">
            Earnings Breakdown
          </h4>
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">Basic</span>
              <span className="font-medium">
                ৳{item.basicSalary.toLocaleString()}
              </span>
            </div>
            {item.payrollItemComponents
              ?.filter((c) => c?.componentType === "EARNING")
              .map((comp, idx: number) => (
                <div key={idx} className="flex justify-between text-xs">
                  <span className="text-gray-600">
                    {comp.payrollComponent?.name}
                  </span>
                  <span className="font-medium">
                    ৳{comp.value.toLocaleString()}
                  </span>
                </div>
              ))}
          </div>
          {(item.payslipAdjustments?.filter(
            (adj) => adj.payrollComponent?.componentType === "EARNING",
          ).length ?? 0) > 0 && (
            <div className="mt-2 pt-2 border-t border-green-200">
              <p className="text-xs font-semibold text-green-600 mb-1">
                Adjustments
              </p>
              {item.payslipAdjustments
                ?.filter(
                  (adj) => adj.payrollComponent?.componentType === "EARNING",
                )
                .map((adj, idx: number) => (
                  <div key={idx} className="flex justify-between text-xs">
                    <span className="text-green-600">
                      {adj.payrollComponent?.name}
                    </span>
                    <span className="font-medium text-green-600">
                      +৳{adj.value.toLocaleString()}
                    </span>
                  </div>
                ))}
            </div>
          )}
        </div>

        <div>
          <h4 className="text-xs font-semibold text-gray-700 mb-2">
            Deductions Breakdown
          </h4>
          <div className="space-y-1">
            {item.user?.employee?.employeePayrollComponents
              ?.filter((c) => c.payrollComponent?.componentType === "DEDUCTION")
              .map((comp, idx: number) => (
                <div key={idx} className="flex justify-between text-xs">
                  <span className="text-gray-600">
                    {comp.payrollComponent?.name}
                  </span>
                  <span className="font-medium">
                    ৳{comp.value.toLocaleString()}
                  </span>
                </div>
              ))}
          </div>
          {(item.payslipAdjustments?.filter(
            (adj) => adj.payrollComponent?.componentType === "DEDUCTION",
          ).length ?? 0) > 0 && (
            <div className="mt-2 pt-2 border-t border-red-200">
              <p className="text-xs font-semibold text-red-600 mb-1">
                Adjustments
              </p>
              {item.payslipAdjustments
                ?.filter(
                  (adj) => adj.payrollComponent?.componentType === "DEDUCTION",
                )
                .map((adj, idx: number) => (
                  <div key={idx} className="flex justify-between text-xs">
                    <span className="text-red-600">
                      {adj.payrollComponent?.name}
                    </span>
                    <span className="font-medium text-red-600">
                      -৳{adj.value.toLocaleString()}
                    </span>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-2 pt-3 border-t border-gray-200">
        <button
          onClick={() => onViewPayslip(item)}
          className="flex-1 btn btn-sm btn-primary gap-2"
        >
          <PiDownloadSimple size={16} />
          Download PDF
        </button>
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
//     basicSalary: 50000,
//     grossPay: 85000,
//     totalDeductions: 12000,
//     netPay: 73000,
//     status: "PAID",
//     paymentMethod: "BANK_TRANSFER",
//     transactionRef: "TXN202402001",
//     paidAt: "2024-02-28T10:30:00Z",
//     createdAt: "2024-02-28T10:00:00Z",
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
//       periodStart: "2024-02-01",
//       periodEnd: "2024-02-28",
//       paymentDate: "2024-03-05",
//     },
//     components: [
//       {
//         id: 1,
//         amount: 20000,
//         component: {
//           name: "HRA",
//           componentType: "EARNING",
//         },
//       },
//       {
//         id: 2,
//         amount: 15000,
//         component: {
//           name: "Performance Bonus",
//           componentType: "EARNING",
//         },
//       },
//       {
//         id: 3,
//         amount: 7000,
//         component: {
//           name: "Employee PF",
//           componentType: "DEDUCTION",
//         },
//       },
//       {
//         id: 4,
//         amount: 3000,
//         component: {
//           name: "Income Tax",
//           componentType: "DEDUCTION",
//         },
//       },
//       {
//         id: 5,
//         amount: 2000,
//         component: {
//           name: "Professional Tax",
//           componentType: "DEDUCTION",
//         },
//       },
//     ],
//     adjustments: [
//       {
//         id: 1,
//         payrollItemId: 1,
//         type: "bonus",
//         description: "Quarterly Bonus",
//         amount: 5000,
//         isRecurring: false,
//         createdBy: 1,
//         notes: "Q1 performance bonus",
//         createdAt: "2024-02-28T09:00:00Z",
//         updatedAt: "2024-02-28T09:00:00Z",
//       },
//     ],
//   },
//   {
//     id: 2,
//     userId: 2,
//     payrollCycleId: 1,
//     basicSalary: 45000,
//     grossPay: 74500,
//     totalDeductions: 12000,
//     netPay: 62500,
//     status: "APPROVED",
//     paymentMethod: "BANK_TRANSFER",
//     transactionRef: null,
//     paidAt: null,
//     createdAt: "2024-02-28T10:00:00Z",
//     user: {
//       id: 2,
//       profile: {
//         fullName: "Sarah Johnson",
//       },
//       employee: {
//         employeeId: "EMP002",
//         department: {
//           name: "Marketing",
//         },
//         designation: {
//           name: "Marketing Manager",
//         },
//       },
//     },
//     payrollCycle: {
//       periodStart: "2024-02-01",
//       periodEnd: "2024-02-28",
//       paymentDate: "2024-03-05",
//     },
//     components: [
//       {
//         id: 6,
//         amount: 18000,
//         component: {
//           name: "HRA",
//           componentType: "EARNING",
//         },
//       },
//       {
//         id: 7,
//         amount: 9000,
//         component: {
//           name: "Transport Allowance",
//           componentType: "EARNING",
//         },
//       },
//       {
//         id: 8,
//         amount: 6000,
//         component: {
//           name: "Employee PF",
//           componentType: "DEDUCTION",
//         },
//       },
//       {
//         id: 9,
//         amount: 2500,
//         component: {
//           name: "Income Tax",
//           componentType: "DEDUCTION",
//         },
//       },
//       {
//         id: 10,
//         amount: 1000,
//         component: {
//           name: "Insurance",
//           componentType: "DEDUCTION",
//         },
//       },
//     ],
//     adjustments: [
//       {
//         id: 2,
//         payrollItemId: 2,
//         type: "reimbursement",
//         description: "Travel Reimbursement",
//         amount: 2500,
//         isRecurring: false,
//         createdBy: 1,
//         notes: "Client visit expenses",
//         createdAt: "2024-02-27T10:00:00Z",
//         updatedAt: "2024-02-27T10:00:00Z",
//       },
//       {
//         id: 3,
//         payrollItemId: 2,
//         type: "advance_deduction",
//         description: "Loan Repayment",
//         amount: 2500,
//         isRecurring: true,
//         createdBy: 1,
//         notes: "Monthly installment",
//         createdAt: "2024-02-27T10:00:00Z",
//         updatedAt: "2024-02-27T10:00:00Z",
//       },
//     ],
//   },
//   {
//     id: 3,
//     userId: 3,
//     payrollCycleId: 1,
//     basicSalary: 60000,
//     grossPay: 95000,
//     totalDeductions: 15000,
//     netPay: 80000,
//     status: "PAID",
//     paymentMethod: "BANK_TRANSFER",
//     transactionRef: "TXN202402003",
//     paidAt: "2024-02-28T10:30:00Z",
//     createdAt: "2024-02-28T10:00:00Z",
//     user: {
//       id: 3,
//       profile: {
//         fullName: "Michael Chen",
//       },
//       employee: {
//         employeeId: "EMP003",
//         department: {
//           name: "Engineering",
//         },
//         designation: {
//           name: "Tech Lead",
//         },
//       },
//     },
//     payrollCycle: {
//       periodStart: "2024-02-01",
//       periodEnd: "2024-02-28",
//       paymentDate: "2024-03-05",
//     },
//     components: [
//       {
//         id: 11,
//         amount: 25000,
//         component: {
//           name: "HRA",
//           componentType: "EARNING",
//         },
//       },
//       {
//         id: 12,
//         amount: 10000,
//         component: {
//           name: "Special Allowance",
//           componentType: "EARNING",
//         },
//       },
//       {
//         id: 13,
//         amount: 8000,
//         component: {
//           name: "Employee PF",
//           componentType: "DEDUCTION",
//         },
//       },
//       {
//         id: 14,
//         amount: 5000,
//         component: {
//           name: "Income Tax",
//           componentType: "DEDUCTION",
//         },
//       },
//       {
//         id: 15,
//         amount: 2000,
//         component: {
//           name: "Professional Tax",
//           componentType: "DEDUCTION",
//         },
//       },
//     ],
//   },
//   {
//     id: 4,
//     userId: 4,
//     payrollCycleId: 1,
//     basicSalary: 35000,
//     grossPay: 52000,
//     totalDeductions: 8300,
//     netPay: 43700,
//     status: "PENDING",
//     paymentMethod: "BANK_TRANSFER",
//     transactionRef: null,
//     paidAt: null,
//     createdAt: "2024-02-28T10:00:00Z",
//     user: {
//       id: 4,
//       profile: {
//         fullName: "Emily Davis",
//       },
//       employee: {
//         employeeId: "EMP004",
//         department: {
//           name: "HR",
//         },
//         designation: {
//           name: "HR Specialist",
//         },
//       },
//     },
//     payrollCycle: {
//       periodStart: "2024-02-01",
//       periodEnd: "2024-02-28",
//       paymentDate: "2024-03-05",
//     },
//     components: [
//       {
//         id: 16,
//         amount: 12000,
//         component: {
//           name: "HRA",
//           componentType: "EARNING",
//         },
//       },
//       {
//         id: 17,
//         amount: 5000,
//         component: {
//           name: "Medical Allowance",
//           componentType: "EARNING",
//         },
//       },
//       {
//         id: 18,
//         amount: 4500,
//         component: {
//           name: "Employee PF",
//           componentType: "DEDUCTION",
//         },
//       },
//       {
//         id: 19,
//         amount: 1800,
//         component: {
//           name: "Income Tax",
//           componentType: "DEDUCTION",
//         },
//       },
//       {
//         id: 20,
//         amount: 500,
//         component: {
//           name: "Professional Tax",
//           componentType: "DEDUCTION",
//         },
//       },
//     ],
//     adjustments: [
//       {
//         id: 4,
//         payrollItemId: 4,
//         type: "penalty",
//         description: "Late Arrival Penalty",
//         amount: 1500,
//         isRecurring: false,
//         createdBy: 1,
//         notes: "Disciplinary action - 3 instances",
//         createdAt: "2024-02-26T14:00:00Z",
//         updatedAt: "2024-02-26T14:00:00Z",
//       },
//     ],
//   },
//   {
//     id: 5,
//     userId: 5,
//     payrollCycleId: 1,
//     basicSalary: 55000,
//     grossPay: 88000,
//     totalDeductions: 13500,
//     netPay: 74500,
//     status: "PAID",
//     paymentMethod: "BANK_TRANSFER",
//     transactionRef: "TXN202402005",
//     paidAt: "2024-02-28T10:30:00Z",
//     createdAt: "2024-02-28T10:00:00Z",
//     user: {
//       id: 5,
//       profile: {
//         fullName: "David Wilson",
//       },
//       employee: {
//         employeeId: "EMP005",
//         department: {
//           name: "Sales",
//         },
//         designation: {
//           name: "Sales Manager",
//         },
//       },
//     },
//     payrollCycle: {
//       periodStart: "2024-02-01",
//       periodEnd: "2024-02-28",
//       paymentDate: "2024-03-05",
//     },
//     components: [
//       {
//         id: 21,
//         amount: 22000,
//         component: {
//           name: "HRA",
//           componentType: "EARNING",
//         },
//       },
//       {
//         id: 22,
//         amount: 11000,
//         component: {
//           name: "Sales Commission",
//           componentType: "EARNING",
//         },
//       },
//       {
//         id: 23,
//         amount: 7500,
//         component: {
//           name: "Employee PF",
//           componentType: "DEDUCTION",
//         },
//       },
//       {
//         id: 24,
//         amount: 4000,
//         component: {
//           name: "Income Tax",
//           componentType: "DEDUCTION",
//         },
//       },
//       {
//         id: 25,
//         amount: 2000,
//         component: {
//           name: "Professional Tax",
//           componentType: "DEDUCTION",
//         },
//       },
//     ],
//   },
//   {
//     id: 6,
//     userId: 6,
//     payrollCycleId: 1,
//     basicSalary: 40000,
//     grossPay: 62000,
//     totalDeductions: 8200,
//     netPay: 53800,
//     status: "APPROVED",
//     paymentMethod: "BANK_TRANSFER",
//     transactionRef: null,
//     paidAt: null,
//     createdAt: "2024-02-28T10:00:00Z",
//     user: {
//       id: 6,
//       profile: {
//         fullName: "Lisa Anderson",
//       },
//       employee: {
//         employeeId: "EMP006",
//         department: {
//           name: "Finance",
//         },
//         designation: {
//           name: "Accountant",
//         },
//       },
//     },
//     payrollCycle: {
//       periodStart: "2024-02-01",
//       periodEnd: "2024-02-28",
//       paymentDate: "2024-03-05",
//     },
//     components: [
//       {
//         id: 26,
//         amount: 16000,
//         component: {
//           name: "HRA",
//           componentType: "EARNING",
//         },
//       },
//       {
//         id: 27,
//         amount: 6000,
//         component: {
//           name: "Special Allowance",
//           componentType: "EARNING",
//         },
//       },
//       {
//         id: 28,
//         amount: 5000,
//         component: {
//           name: "Employee PF",
//           componentType: "DEDUCTION",
//         },
//       },
//       {
//         id: 29,
//         amount: 2500,
//         component: {
//           name: "Income Tax",
//           componentType: "DEDUCTION",
//         },
//       },
//       {
//         id: 30,
//         amount: 700,
//         component: {
//           name: "Professional Tax",
//           componentType: "DEDUCTION",
//         },
//       },
//     ],
//   },
// ];

export default function AllPayslipsPage() {
  const { popupOption, setPopupOption } = usePopupOption();
  // const [filters, setFilters] = useState({
  //   status: "",
  //   month: "",
  //   year: moment().year(),
  // });

  const { data, loading } = useQuery<{
    payrollItems: {
      data: IPayrollItem[];
    };
  }>(GET_ALL_PAYSLIPS, {
    variables: {
      query: {},
    },
    // skip: true, // Skip API call to use dummy data
  });

  // Use dummy data instead of API data
  const payslips = data?.payrollItems?.data;
  // console.log({ payslips });

  // Calculate summary statistics
  const totalGrossPay = payslips?.reduce((sum, item) => sum + item.grossPay, 0);
  const totalDeductions = payslips?.reduce(
    (sum, item) => sum + item.totalDeductions,
    0,
  );
  const totalNetPay = payslips?.reduce((sum, item) => sum + item.netPay, 0);

  // Chart data for overview
  const summaryData = [
    {
      name: "Total Gross Pay",
      value: totalGrossPay,
      color: "#2563eb",
    },
    {
      name: "Total Deductions",
      value: totalDeductions,
      color: "#ef4444",
    },
    {
      name: "Total Net Pay",
      value: totalNetPay,
      color: "#22c55e",
    },
  ];

  const pieChartData = [
    { name: "Gross Pay", value: totalGrossPay },
    { name: "Deductions", value: totalDeductions },
  ];

  const COLORS = ["#2563eb", "#ef4444"];
  // console.log({
  //   summaryData,
  //   pieChartData,
  //   totalGrossPay,
  //   totalDeductions,
  //   percentage: ((totalDeductions / totalGrossPay) * 100).toFixed(2) + "%",
  // });

  const handleViewPayslip = (item: IPayrollItem) => {
    setPopupOption({
      open: true,
      form: "payslip" as any,
      actionType: "view",
      data: item,
      title: `Payslip - ${item.user?.profile?.fullName} - ${moment(
        item.payrollCycle?.periodEnd,
      ).format("MMMM YYYY")}`,
    });
  };

  if (loading) {
    return <CustomLoading />;
  }

  // const currentYear = moment().year();
  // const yearOptions = [
  //   currentYear,
  //   currentYear - 1,
  //   currentYear - 2,
  //   currentYear - 3,
  // ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <PiReceipt size={28} className="text-primary" />
              All Payslips
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              View and manage all employee payslips
            </p>
          </div>
        </div>

        {/* Filters */}
        {/* <div className="flex flex-wrap gap-4 mb-6">
          <select
            value={filters.year}
            onChange={(e) =>
              setFilters({ ...filters, year: Number(e.target.value) })
            }
            className="select select-bordered select-sm"
          >
            {yearOptions.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>

          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="select select-bordered select-sm"
          >
            <option value="">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="PAID">Paid</option>
          </select>

          <button
            onClick={() => refetch()}
            className="btn btn-sm btn-primary gap-2"
          >
            Apply Filters
          </button>

          <button
            onClick={() => {
              setFilters({
                status: "",
                month: "",
                year: moment().year(),
              });
              refetch();
            }}
            className="btn btn-sm btn-ghost"
          >
            Clear
          </button>
        </div> */}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Payslips</p>
                <p className="text-2xl font-bold text-gray-900">
                  {payslips?.length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <PiReceipt className="text-primary" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Gross Pay</p>
                <p className="text-2xl font-bold text-gray-900">
                  ৳{totalGrossPay?.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <PiTrendUp className="text-primary" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Deductions</p>
                <p className="text-2xl font-bold text-red-600">
                  ৳{totalDeductions?.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <PiTrendDown className="text-red-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Net Pay</p>
                <p className="text-2xl font-bold text-green-600">
                  ৳{totalNetPay?.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <PiCurrencyDollar className="text-green-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Bar Chart */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Payroll Summary
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={summaryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {summaryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Gross Pay vs Deductions
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={(entry: any) => {
                    const percent = (
                      (entry.value /
                        ((totalGrossPay || 0) + (totalDeductions || 0))) *
                      100
                    ).toFixed(1);
                    return `${entry.name}: ${percent}%`;
                  }}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieChartData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any) => `৳${value.toLocaleString()}`}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Payslips Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {payslips?.map((item) => (
          <PayslipCard
            key={item.id}
            item={item}
            onViewPayslip={handleViewPayslip}
          />
        ))}
      </div>

      {payslips?.length === 0 && !loading && (
        <div className="text-center py-12">
          <PiReceipt className="mx-auto text-gray-400 mb-4" size={64} />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Payslips Found
          </h3>
          <p className="text-gray-500">
            No payslips match your current filters
          </p>
        </div>
      )}

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
