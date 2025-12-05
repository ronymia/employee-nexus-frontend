"use client";

import { useQuery } from "@apollo/client/react";
import { useParams } from "next/navigation";
import { GET_PAYROLL_ITEM_BY_ID } from "@/graphql/payroll-item.api";
import CustomLoading from "@/components/loader/CustomLoading";
import PayslipWrapper from "@/components/payroll/PayslipWrapper";
import { IPayrollItem } from "@/types";

export default function PayslipPage() {
  const params = useParams();
  const itemId = params.id as string;

  const { data, loading } = useQuery<{
    payrollItemById: {
      data: IPayrollItem;
    };
  }>(GET_PAYROLL_ITEM_BY_ID, {
    variables: { id: Number(itemId) },
  });

  const item = data?.payrollItemById?.data;

  if (loading) {
    return <CustomLoading />;
  }

  if (!item) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Payslip Not Found
          </h2>
          <p className="text-gray-600">
            The requested payslip could not be found.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <PayslipWrapper item={item} showActions={true} />
      </div>
    </div>
  );
}
