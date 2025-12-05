# Payroll Components

## Payslip PDF Generation

This directory contains components for generating professional PDF payslips using @react-pdf/renderer.

### Components

#### `PayslipPDF.tsx`

The core PDF document component that defines the payslip layout and styling using @react-pdf/renderer primitives (Document, Page, View, Text, StyleSheet).

**Features:**

- Industry-standard payslip layout
- Automatic pagination handling
- Professional styling with gradients and borders
- Earnings and deductions breakdown
- Employee and payment information
- Signature section
- Company branding

**Usage:**

```tsx
import { PayslipPDF } from "@/components/payroll/PayslipPDF";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";

// For download
<PDFDownloadLink document={<PayslipPDF item={payrollItem} />} fileName="payslip.pdf">
  Download PDF
</PDFDownloadLink>

// For preview
<PDFViewer>
  <PayslipPDF item={payrollItem} />
</PDFViewer>
```

#### `PayslipWrapper.tsx` (Default Export)

A React component that wraps the PDF generation with UI controls.

**Features:**

- Preview/Hide PDF toggle button
- Download PDF button with loading state
- In-browser PDF viewer (800px height)
- Optional close button
- Informational alert when not in preview mode

**Props:**

```typescript
interface PayslipProps {
  item: IPayrollItem; // The payroll item data
  onClose?: () => void; // Optional close handler
  showActions?: boolean; // Show/hide action buttons (default: true)
}
```

**Usage:**

```tsx
import PayslipWrapper from "@/components/payroll/PayslipWrapper";

<PayslipWrapper
  item={payrollItem}
  onClose={() => console.log("Closed")}
  showActions={true}
/>;
```

### Migration from Old Payslip

The old HTML-based `Payslip.tsx` (backed up as `Payslip.tsx.backup`) has been replaced with the new PDF-based system to resolve pagination issues.

**Benefits of @react-pdf/renderer:**

- ✅ Automatic page break handling
- ✅ Consistent cross-browser output
- ✅ Professional PDF quality
- ✅ In-browser preview before download
- ✅ React component syntax (familiar)
- ✅ CSS-like styling with StyleSheet

### Integration Points

1. **Payroll Cycle View** (`payroll-cycles/[id]/view/page.tsx`)

   - Opens payslip in CustomPopup modal
   - Form type: "payslip"

2. **Standalone Payslip Page** (`payroll-items/[id]/payslip/page.tsx`)
   - Full-page payslip view
   - Shareable link for employees

### Customization

To customize the payslip design, edit `PayslipPDF.tsx`:

1. **Company Branding**: Update header section (company name, address)
2. **Colors**: Modify gradient colors in styles (currently purple/blue)
3. **Layout**: Adjust StyleSheet objects for spacing, fonts, borders
4. **Fields**: Add/remove employee or payment information fields
5. **Footer**: Customize footer text or contact information

Example - Change header gradient:

```tsx
header: {
  backgroundColor: "#667eea",  // Change to your brand color
  // or use gradient in separate elements
}
```

### Dependencies

- `@react-pdf/renderer`: ^4.3.1
- `moment`: Date formatting
- `next/dynamic`: SSR-safe dynamic imports

### Notes

- PDFDownloadLink and PDFViewer are dynamically imported to avoid SSR issues
- Preview mode uses 800px height PDFViewer
- Download generates filename: `payslip-{employeeName}-{month-year}.pdf`
- All monetary values formatted to 2 decimal places
