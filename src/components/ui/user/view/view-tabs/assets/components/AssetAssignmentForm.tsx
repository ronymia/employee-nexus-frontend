"use client";

import { showToast } from "@/components/ui/CustomToast";
import CustomForm from "@/components/form/CustomForm";
import FormActionButton from "@/components/form/FormActionButton";
import CustomSelect from "@/components/form/input/CustomSelect";
import CustomDatePicker from "@/components/form/input/CustomDatePicker";
import CustomTextareaField from "@/components/form/input/CustomTextareaField";
import { useFormContext, useWatch } from "react-hook-form";
import ToggleSwitch from "@/components/form/input/ToggleSwitch";
import AssetStatusSelect from "@/components/input-fields/AssetStatusSelect";
import {
  GET_ASSETS,
  ASSIGN_ASSET,
  GET_USER_ASSET_ASSIGNMENTS,
} from "@/graphql/asset.api";
import { IAsset, IAssetAssignment } from "@/types/assets.type";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { PiInfo } from "react-icons/pi";
import { useMutation, useQuery } from "@apollo/client/react";

dayjs.extend(utc);
dayjs.extend(customParseFormat);

// ==================== INTERFACES ====================
interface IAssetAssignmentFormProps {
  userId: number;
  assetAssignment?: IAssetAssignment;
  actionType: "create" | "update";
  onClose: () => void;
}

interface IAssetOption {
  label: string;
  value: string;
}

interface IAssetAssignmentFormFieldsProps {
  actionType: "create" | "update";
  assetOptions: IAssetOption[];
  loadingAssets: boolean;
}

// ==================== MAIN COMPONENT ====================
export default function AssetAssignmentForm({
  userId,
  assetAssignment,
  actionType,
  onClose,
}: IAssetAssignmentFormProps) {
  // ==================== API QUERIES ====================
  const { data: assetsData, loading: loadingAssets } = useQuery(GET_ASSETS, {
    variables: {
      query: { status: "unassigned" },
    },
  });

  const [assignAsset] = useMutation(ASSIGN_ASSET, {
    awaitRefetchQueries: true,
    refetchQueries: [
      { query: GET_USER_ASSET_ASSIGNMENTS, variables: { userId } },
    ],
  });

  // ==================== HANDLERS ====================
  const handleSubmit = async (data: any) => {
    try {
      const assignedAt = data.assignedAt
        ? dayjs.utc(data.assignedAt, "DD-MM-YYYY").toISOString()
        : dayjs.utc().toISOString();

      const res = await assignAsset({
        variables: {
          assignAssetInput: {
            assetId: parseInt(data.assetId),
            assignedTo: userId,
            assignedAt,
            note: data.note || "",
          },
        },
      });

      if (res?.data) {
        showToast.success(
          "Asset Assigned!",
          "Asset has been assigned successfully",
        );
        onClose();
      }
    } catch (error: any) {
      console.error("Asset assignment error:", error);
      showToast.error(
        "Assignment Failed",
        error?.message || "Failed to assign asset. Please try again.",
      );
    }
  };

  // ==================== DEFAULT VALUES ====================
  const defaultValues = {
    assetId: Number(assetAssignment?.asset?.id) || "",
    assignedAt: assetAssignment?.assignedAt
      ? dayjs(assetAssignment.assignedAt).format("DD-MM-YYYY")
      : dayjs().format("DD-MM-YYYY"),
    returnedAt: assetAssignment?.returnedAt
      ? dayjs(assetAssignment.returnedAt).format("DD-MM-YYYY")
      : "",
    status: assetAssignment?.status || "assigned",
    isCurrentlyAssigned: !assetAssignment?.returnedAt,
    note: assetAssignment?.note || assetAssignment?.asset?.note || "",
  };

  // ==================== ASSET OPTIONS ====================
  const assetOptions: IAssetOption[] =
    (assetsData as any)?.assets?.data?.map((asset: IAsset) => ({
      label: `${asset.name} - ${asset.code}`,
      value: asset.id.toString(),
    })) || [];

  // ==================== RENDER ====================
  return (
    <CustomForm
      submitHandler={handleSubmit}
      defaultValues={defaultValues}
      className="flex flex-col gap-y-4"
    >
      <AssetAssignmentFormFields
        actionType={actionType}
        assetOptions={assetOptions}
        loadingAssets={loadingAssets}
      />
      <FormActionButton isPending={loadingAssets} cancelHandler={onClose} />
    </CustomForm>
  );
}

// ==================== FORM FIELDS COMPONENT ====================
function AssetAssignmentFormFields({
  actionType,
  assetOptions,
  loadingAssets,
}: IAssetAssignmentFormFieldsProps) {
  const { control } = useFormContext();
  const isCurrentlyAssigned = useWatch({
    control,
    name: "isCurrentlyAssigned",
    defaultValue: true,
  });

  return (
    <div className="space-y-4">
      {/* Asset Selection */}
      <div className="border border-primary/20 rounded-lg p-4">
        <h4 className="text-base font-semibold mb-3 text-primary">
          Asset Information
        </h4>

        <CustomSelect
          dataAuto="assetId"
          name="assetId"
          label="Select Asset"
          placeholder="Choose an asset to assign"
          required={true}
          isLoading={loadingAssets}
          options={assetOptions}
          disabled={actionType === "update"}
        />

        {actionType === "update" && (
          <p className="text-xs text-base-content/60 mt-2">
            Asset cannot be changed. Create a new assignment if needed.
          </p>
        )}
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

          <div className="flex items-center justify-between p-3 bg-base-200/50 rounded-lg">
            <label className="text-sm font-medium text-base-content">
              Currently Assigned
            </label>
            <ToggleSwitch name="isCurrentlyAssigned" />
          </div>

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

        <div className="space-y-3">
          <AssetStatusSelect name="status" dataAuto="status" />

          <div className="alert alert-info text-sm">
            <PiInfo size={20} className="shrink-0" />
            <span>
              Mark as &quot;Returned&quot; when the employee returns the asset.
            </span>
          </div>
        </div>
      </div>

      {/* Additional Notes */}
      <div className="border border-primary/20 rounded-lg p-4">
        <h4 className="text-base font-semibold mb-3 text-primary">
          Additional Information
        </h4>

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
  );
}
