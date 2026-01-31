"use client";

import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { IPayrollItem } from "@/types";
import moment from "moment";

interface PayslipPDFProps {
  item: IPayrollItem;
  pageSize?: "A4" | "A5" | "LETTER"; // Configurable page size, defaults to A5
}

// Create styles for A5 size (extra compact)
const styles = StyleSheet.create({
  page: {
    padding: 0,
    fontSize: 8,
    fontFamily: "Helvetica",
  },
  header: {
    backgroundColor: "#667eea",
    padding: 12,
    textAlign: "center",
    color: "white",
  },
  companyName: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 2,
  },
  documentTitle: {
    fontSize: 10,
    letterSpacing: 1,
    marginTop: 4,
  },
  infoSection: {
    flexDirection: "row",
    backgroundColor: "#f8f9fa",
    padding: 10,
    borderBottom: "1.5px solid #dee2e6",
  },
  infoBlock: {
    flex: 1,
    paddingHorizontal: 5,
  },
  infoBlockTitle: {
    fontSize: 7.5,
    color: "#6c757d",
    textTransform: "uppercase",
    marginBottom: 5,
    letterSpacing: 0.5,
    fontWeight: "bold",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 3,
    borderBottom: "0.5px solid #e9ecef",
  },
  infoLabel: {
    fontWeight: "bold",
    color: "#495057",
  },
  infoValue: {
    color: "#212529",
  },
  earningsDeductionsSection: {
    flexDirection: "row",
  },
  column: {
    flex: 1,
    padding: 10,
  },
  columnBorder: {
    borderRight: "1.5px solid #dee2e6",
  },
  columnTitle: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#495057",
    marginBottom: 6,
    paddingBottom: 4,
    borderBottom: "1.5px solid #667eea",
  },
  lineItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 3,
    borderBottom: "0.5px solid #e9ecef",
  },
  lineItemLabel: {
    color: "#495057",
  },
  lineItemAmount: {
    fontWeight: "bold",
    color: "#212529",
  },
  lineItemTotal: {
    marginTop: 8,
    fontWeight: "bold",
  },
  totalsSection: {
    backgroundColor: "#f8f9fa",
    padding: 10,
    borderTop: "1.5px solid #dee2e6",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
    fontSize: 8.5,
  },
  grandTotal: {
    backgroundColor: "#667eea",
    color: "white",
    padding: 8,
    marginTop: 6,
    fontSize: 11,
    fontWeight: "bold",
  },
  signatureSection: {
    flexDirection: "row",
    padding: 10,
    marginTop: 12,
  },
  signatureBox: {
    flex: 1,
    textAlign: "center",
    paddingTop: 15,
    borderTop: "1px solid #000",
    marginHorizontal: 10,
  },
  signatureLabel: {
    fontSize: 7,
    color: "#495057",
    marginTop: 4,
  },
  footer: {
    padding: 8,
    backgroundColor: "#fff",
    borderTop: "1.5px solid #dee2e6",
    textAlign: "center",
    color: "#6c757d",
    fontSize: 6,
  },
  statusBadge: {
    padding: "4 8",
    borderRadius: 8,
    fontSize: 7,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  statusPaid: {
    backgroundColor: "#d4edda",
    color: "#155724",
  },
  statusApproved: {
    backgroundColor: "#d1ecf1",
    color: "#0c5460",
  },
  statusPending: {
    backgroundColor: "#fff3cd",
    color: "#856404",
  },
});

export const PayslipPDF = ({ item, pageSize = "A5" }: PayslipPDFProps) => {
  const comps = (item as any).payrollComponents || item.components || [];
  const adjs = (item as any).payrollAdjustments || item.adjustments || [];

  // Calculate earnings breakdown
  const earningsBreakdown =
    comps
      ?.filter(
        (c: any) =>
          (c.payrollComponent || c.component)?.componentType === "EARNING",
      )
      .map((c: any) => ({
        label: (c.payrollComponent || c.component)?.name || "Unknown",
        amount: c.value || c.amount,
      })) || [];

  // Calculate deductions breakdown
  const deductionsBreakdown =
    comps
      ?.filter(
        (c: any) =>
          (c.payrollComponent || c.component)?.componentType === "DEDUCTION",
      )
      .map((c: any) => ({
        label: (c.payrollComponent || c.component)?.name || "Unknown",
        amount: c.value || c.amount,
      })) || [];

  const totalEarnings = earningsBreakdown.reduce(
    (sum: number, e: any) => sum + e.amount,
    item.basicSalary,
  );
  const totalDeductions = deductionsBreakdown.reduce(
    (sum: number, d: any) => sum + d.amount,
    0,
  );

  // Calculate adjustments
  const adjustmentsEarnings = adjs
    .filter(
      (adj: any) =>
        adj.payrollComponent?.componentType === "EARNING" ||
        adj.type === "bonus" ||
        adj.type === "reimbursement",
    )
    .map((adj: any) => ({
      label:
        adj.payrollComponent?.name ||
        adj.remarks ||
        adj.description ||
        adj.type?.replace("_", " ").toUpperCase(),
      amount: adj.value || adj.amount,
    }));

  const adjustmentsDeductions = adjs
    .filter(
      (adj: any) =>
        adj.payrollComponent?.componentType === "DEDUCTION" ||
        adj.type === "penalty" ||
        adj.type === "advance_deduction",
    )
    .map((adj: any) => ({
      label:
        adj.payrollComponent?.name ||
        adj.remarks ||
        adj.description ||
        adj.type?.replace("_", " ").toUpperCase(),
      amount: adj.value || adj.amount,
    }));

  const totalAdjustmentsEarnings = adjustmentsEarnings.reduce(
    (sum: number, adj: any) => sum + adj.amount,
    0,
  );

  const totalAdjustmentsDeductions = adjustmentsDeductions.reduce(
    (sum: number, adj: any) => sum + adj.amount,
    0,
  );

  const getStatusStyle = () => {
    switch (item.status) {
      case "PAID":
        return [styles.statusBadge, styles.statusPaid];
      case "APPROVED":
        return [styles.statusBadge, styles.statusApproved];
      case "PENDING":
        return [styles.statusBadge, styles.statusPending];
      default:
        return [styles.statusBadge, styles.statusPending];
    }
  };

  return (
    <Document>
      <Page size={pageSize} orientation="portrait" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.companyName}>
            {item.user?.business?.name || "Your Company Name"}
          </Text>
          <Text style={{ fontSize: 6.5, marginTop: 1 }}>
            {item.user?.business?.address || "123 Business Street"},{" "}
            {item.user?.business?.city || "City"},{" "}
            {item.user?.business?.country || "Country"}
          </Text>
          <Text style={styles.documentTitle}>PAYSLIP</Text>
        </View>

        {/* Employee & Payment Info */}
        <View style={styles.infoSection}>
          <View style={styles.infoBlock}>
            <Text style={styles.infoBlockTitle}>Employee Information</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Name:</Text>
              <Text style={styles.infoValue}>
                {item.user?.profile?.fullName || "N/A"}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Employee ID:</Text>
              <Text style={styles.infoValue}>
                {(item.user as any)?.employee?.employeeId || "N/A"}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Department:</Text>
              <Text style={styles.infoValue}>
                {(item.user as any)?.employee?.department?.name || "N/A"}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Designation:</Text>
              <Text style={styles.infoValue}>
                {(item.user as any)?.employee?.designation?.name || "N/A"}
              </Text>
            </View>
          </View>

          <View style={styles.infoBlock}>
            <Text style={styles.infoBlockTitle}>Payment Information</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Pay Period:</Text>
              <Text style={styles.infoValue}>
                {moment(item.payrollCycle?.periodStart).format("MMM DD")} -{" "}
                {moment(item.payrollCycle?.periodEnd).format("MMM DD, YYYY")}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Payment Date:</Text>
              <Text style={styles.infoValue}>
                {moment(
                  (item as any).paymentDate || item.payrollCycle?.paymentDate,
                ).format("MMM DD, YYYY")}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Payment Method:</Text>
              <Text style={styles.infoValue}>
                {item.paymentMethod?.replace("_", " ").toUpperCase() ||
                  "Bank Transfer"}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Status:</Text>
              <Text style={getStatusStyle()}>{item.status}</Text>
            </View>
          </View>
        </View>

        {/* Earnings and Deductions */}
        <View style={styles.earningsDeductionsSection}>
          {/* Earnings Column */}
          <View style={[styles.column, styles.columnBorder]}>
            <Text style={styles.columnTitle}>Earnings</Text>
            <View style={styles.lineItem}>
              <Text style={styles.lineItemLabel}>Basic Salary</Text>
              <Text style={styles.lineItemAmount}>
                ${item.basicSalary.toFixed(2)}
              </Text>
            </View>
            {earningsBreakdown.map((earning: any, index: number) => (
              <View key={index} style={styles.lineItem}>
                <Text style={styles.lineItemLabel}>{earning.label}</Text>
                <Text style={styles.lineItemAmount}>
                  ${earning.amount.toFixed(2)}
                </Text>
              </View>
            ))}

            {adjustmentsEarnings.length > 0 && (
              <>
                <View style={{ paddingVertical: 4, marginTop: 4 }}>
                  <Text
                    style={{
                      fontSize: 7.5,
                      fontWeight: "bold",
                      color: "#22c55e",
                    }}
                  >
                    Adjustments (Additions)
                  </Text>
                </View>
                {adjustmentsEarnings.map((adj: any, index: number) => (
                  <View key={`adj-earn-${index}`} style={styles.lineItem}>
                    <Text style={[styles.lineItemLabel, { color: "#22c55e" }]}>
                      {adj.label}
                    </Text>
                    <Text style={[styles.lineItemAmount, { color: "#22c55e" }]}>
                      ${adj.amount.toFixed(2)}
                    </Text>
                  </View>
                ))}
              </>
            )}

            <View style={[styles.lineItem, styles.lineItemTotal]}>
              <Text style={styles.lineItemLabel}>Total Earnings</Text>
              <Text style={styles.lineItemAmount}>
                ${(totalEarnings + totalAdjustmentsEarnings).toFixed(2)}
              </Text>
            </View>
          </View>

          {/* Deductions Column */}
          <View style={styles.column}>
            <Text style={styles.columnTitle}>Deductions</Text>
            {deductionsBreakdown.length > 0 ? (
              <>
                {deductionsBreakdown.map((deduction: any, index: number) => (
                  <View key={index} style={styles.lineItem}>
                    <Text style={styles.lineItemLabel}>{deduction.label}</Text>
                    <Text style={styles.lineItemAmount}>
                      ${deduction.amount.toFixed(2)}
                    </Text>
                  </View>
                ))}
              </>
            ) : (
              <View style={styles.lineItem}>
                <Text style={styles.lineItemLabel}>No Deductions</Text>
                <Text style={styles.lineItemAmount}>$0.00</Text>
              </View>
            )}

            {adjustmentsDeductions.length > 0 && (
              <>
                <View style={{ paddingVertical: 4, marginTop: 4 }}>
                  <Text
                    style={{
                      fontSize: 7.5,
                      fontWeight: "bold",
                      color: "#ef4444",
                    }}
                  >
                    Adjustments (Deductions)
                  </Text>
                </View>
                {adjustmentsDeductions.map((adj: any, index: number) => (
                  <View key={`adj-ded-${index}`} style={styles.lineItem}>
                    <Text style={[styles.lineItemLabel, { color: "#ef4444" }]}>
                      {adj.label}
                    </Text>
                    <Text style={[styles.lineItemAmount, { color: "#ef4444" }]}>
                      ${adj.amount.toFixed(2)}
                    </Text>
                  </View>
                ))}
              </>
            )}

            <View style={[styles.lineItem, styles.lineItemTotal]}>
              <Text style={styles.lineItemLabel}>Total Deductions</Text>
              <Text style={styles.lineItemAmount}>
                ${(totalDeductions + totalAdjustmentsDeductions).toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        {/* Totals Section */}
        <View style={styles.totalsSection}>
          <View style={styles.totalRow}>
            <Text>Gross Pay:</Text>
            <Text>${item.grossPay.toFixed(2)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text>Total Deductions:</Text>
            <Text>${item.totalDeductions.toFixed(2)}</Text>
          </View>
          <View style={[styles.totalRow, styles.grandTotal]}>
            <Text>Net Pay:</Text>
            <Text>${item.netPay.toFixed(2)}</Text>
          </View>
        </View>

        {/* Payment Details */}
        {item.transactionRef && (
          <View style={{ padding: 10, backgroundColor: "#f8f9fa" }}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Transaction Reference:</Text>
              <Text style={styles.infoValue}>{item.transactionRef}</Text>
            </View>
            {item.paidAt && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Paid On:</Text>
                <Text style={styles.infoValue}>
                  {moment(item.paidAt).format("MMM DD, YYYY HH:mm")}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Signature Section */}
        <View style={styles.signatureSection}>
          <View style={styles.signatureBox}>
            <Text style={styles.signatureLabel}>Employee Signature</Text>
          </View>
          <View style={styles.signatureBox}>
            <Text style={styles.signatureLabel}>Authorized Signature</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>
            This is a computer-generated payslip and does not require a
            signature.
          </Text>
          <Text style={{ marginTop: 8 }}>
            For any queries, please contact HR Department at hr@company.com
          </Text>
        </View>
      </Page>
    </Document>
  );
};
