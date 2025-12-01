"use client";

import CustomForm from "@/components/form/CustomForm";
import FormActionButton from "@/components/form/FormActionButton";
import CustomSelect from "@/components/form/input/CustomSelect";
import CustomDatePicker from "@/components/form/input/CustomDatePicker";
import CustomTextareaField from "@/components/form/input/CustomTextareaField";
import { useFormContext, useWatch } from "react-hook-form";
import ToggleSwitch from "@/components/form/input/ToggleSwitch";

interface IAssetType {
  id: number;
  name: string;
}

interface IAsset {
  id: number;
  name: string;
  code: string;
  date: string;
  note?: string;
  assetTypeId?: number;
  assetType?: IAssetType;
  image?: string;
  status: string;
  businessId?: number;
  createdBy?: number;
  createdAt: string;
  updatedAt: string;
}

interface IUser {
  id: number;
  email: string;
  profile?: {
    fullName: string;
  };
}

interface IAssetAssignment {
  id: number;
  assetId: number;
  asset: IAsset;
  assignedTo: number;
  assignedToUser?: IUser;
  assignedBy: number;
  assignedByUser?: IUser;
  assignedAt: string;
  returnedAt?: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface AssetAssignmentFormProps {
  userId: number;
  assetAssignment?: IAssetAssignment;
  actionType: "create" | "update";
  onClose: () => void;
}

export default function AssetAssignmentForm({
  userId,
  assetAssignment,
  actionType,
  onClose,
}: AssetAssignmentFormProps) {
  const handleSubmit = async (data: any) => {
    console.log("Asset Assignment Form Submit:", {
      ...data,
      userId,
      actionType,
    });
    // TODO: Implement GraphQL mutation
    onClose();
  };

  const defaultValues = {
    assetId: assetAssignment?.assetId.toString() || "",
    assignedAt: assetAssignment?.assignedAt || new Date().toISOString(),
    returnedAt: assetAssignment?.returnedAt || "",
    status: assetAssignment?.status || "assigned",
    isCurrentlyAssigned: !assetAssignment?.returnedAt,
    note: assetAssignment?.asset.note || "",
  };

  // TODO: Fetch available assets from GraphQL (status: unassigned or available)
  const assetOptions = [
    { label: "Dell Laptop - LPT001", value: "1" },
    { label: "iPhone 13 Pro - PH001", value: "2" },
    { label: 'MacBook Pro 16" - LPT002', value: "3" },
    { label: 'Samsung Monitor 27" - MON001', value: "4" },
    { label: "Wireless Mouse - ACC001", value: "5" },
    { label: "Mechanical Keyboard - ACC002", value: "6" },
    { label: "Desk Chair - FUR001", value: "7" },
    { label: "Standing Desk - FUR002", value: "8" },
  ];

  const statusOptions = [
    { label: "Assigned", value: "assigned" },
    { label: "Returned", value: "returned" },
    { label: "Damaged", value: "damaged" },
    { label: "Lost", value: "lost" },
  ];

  return (
    <CustomForm submitHandler={handleSubmit} defaultValues={defaultValues}>
      <AssetAssignmentFormFields
        actionType={actionType}
        assetOptions={assetOptions}
        statusOptions={statusOptions}
      />
      <FormActionButton isPending={false} cancelHandler={onClose} />
    </CustomForm>
  );
}

function AssetAssignmentFormFields({
  actionType,
  assetOptions,
  statusOptions,
}: {
  actionType: "create" | "update";
  assetOptions: { label: string; value: string }[];
  statusOptions: { label: string; value: string }[];
}) {
  const { control } = useFormContext();
  const isCurrentlyAssigned = useWatch({
    control,
    name: "isCurrentlyAssigned",
  });

  return (
    <div className="space-y-4">
      {/* Asset Selection */}
      <div className="border border-primary/20 rounded-lg p-4">
        <h4 className="text-base font-semibold mb-3 text-primary">
          Asset Information
        </h4>
        <div className="space-y-4">
          <CustomSelect
            dataAuto="assetId"
            name="assetId"
            label="Select Asset"
            placeholder="Choose an asset to assign"
            required={true}
            isLoading={false}
            options={assetOptions}
            disabled={actionType === "update"}
          />
          {actionType === "update" && (
            <p className="text-xs text-base-content/60">
              Asset cannot be changed. Create a new assignment if needed.
            </p>
          )}
        </div>
      </div>

      {/* Assignment Period */}
      <div className="border border-primary/20 rounded-lg p-4">
        <h4 className="text-base font-semibold mb-3 text-primary">
          Assignment Period
        </h4>
        <div className="space-y-4">
          <CustomDatePicker
            dataAuto="assignedAt"
            name="assignedAt"
            label="Assigned Date"
            placeholder="Select assignment date"
            required={true}
            disabled={false}
          />

          {/* Currently Assigned Toggle */}
          <div className="flex items-center justify-between p-3 bg-base-200/50 rounded-lg">
            <label className="text-sm font-medium text-base-content">
              Currently Assigned
            </label>
            <ToggleSwitch name="isCurrentlyAssigned" />
          </div>

          {/* Return Date - Only show when not currently assigned */}
          {!isCurrentlyAssigned && (
            <CustomDatePicker
              dataAuto="returnedAt"
              name="returnedAt"
              label="Return Date"
              placeholder="Select return date"
              required={false}
              disabled={false}
            />
          )}
        </div>
      </div>

      {/* Status */}
      <div className="border border-primary/20 rounded-lg p-4">
        <h4 className="text-base font-semibold mb-3 text-primary">Status</h4>
        <div className="space-y-4">
          <CustomSelect
            dataAuto="status"
            name="status"
            label="Assignment Status"
            placeholder="Select status"
            required={true}
            isLoading={false}
            options={statusOptions}
          />
          <div className="alert alert-info text-sm">
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
            <span>Mark as "Returned" when the employee returns the asset.</span>
          </div>
        </div>
      </div>

      {/* Additional Notes */}
      <div className="border border-primary/20 rounded-lg p-4">
        <h4 className="text-base font-semibold mb-3 text-primary">
          Additional Information
        </h4>
        <div className="space-y-4">
          <CustomTextareaField
            dataAuto="note"
            name="note"
            label="Notes"
            placeholder="Add any notes about this asset assignment..."
            required={false}
            rows={3}
          />
        </div>
      </div>
    </div>
  );
}
