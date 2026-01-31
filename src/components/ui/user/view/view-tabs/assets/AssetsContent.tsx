"use client";

import { useState } from "react";

import { IPopupOption } from "@/types";
import { IAssetAssignment } from "@/types/assets.type";
import CustomPopup from "@/components/modal/CustomPopup";
import CustomLoading from "@/components/loader/CustomLoading";
import {
  PiPackage,
  PiPlus,
  PiCalendar,
  PiUser,
  PiBarcode,
  PiArrowBendUpLeft,
} from "react-icons/pi";
import AssetStatusBadge from "@/components/ui/AssetStatusBadge";
import AssetAssignmentForm from "./components/AssetAssignmentForm";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(utc);
dayjs.extend(customParseFormat);
import { useQuery, useMutation } from "@apollo/client/react";
import { GET_USER_ASSET_ASSIGNMENTS, RETURN_ASSET } from "@/graphql/asset.api";
import { Permissions } from "@/constants/permissions.constant";
import usePermissionGuard from "@/guards/usePermissionGuard";
import useConfirmation from "@/hooks/useConfirmation";

// ==================== INTERFACES ====================
interface IAssetsContentProps {
  userId: number;
}

// ==================== MAIN COMPONENT ====================
export default function AssetsContent({ userId }: IAssetsContentProps) {
  const { hasPermission } = usePermissionGuard();

  // ==================== STATE ====================
  const [popupOption, setPopupOption] = useState<IPopupOption>({
    open: false,
    closeOnDocumentClick: true,
    actionType: "create",
    form: "",
    data: null,
    title: "",
  });

  // ==================== API QUERIES ====================
  const { data, loading } = useQuery(GET_USER_ASSET_ASSIGNMENTS, {
    variables: { userId },
  });

  const [returnAsset, { loading: returningAsset }] = useMutation(RETURN_ASSET, {
    awaitRefetchQueries: true,
    refetchQueries: [
      { query: GET_USER_ASSET_ASSIGNMENTS, variables: { userId } },
    ],
  });

  // ==================== DELETE CONFIRMATION ====================
  const { confirm } = useConfirmation();

  // ==================== DATA ====================
  const assetAssignments: IAssetAssignment[] =
    (data as any)?.userAssetAssignments?.data || [];

  const assignedAssets = assetAssignments.filter(
    (assignment) => assignment.status === "assigned" && !assignment.returnedAt,
  );

  const returnedAssets = assetAssignments.filter(
    (assignment) => assignment.status === "returned" || assignment.returnedAt,
  );

  // ==================== HANDLERS ====================
  const handleOpenForm = (
    actionType: "create" | "update",
    assignment?: IAssetAssignment,
  ) => {
    setPopupOption({
      open: true,
      closeOnDocumentClick: false,
      actionType: actionType,
      form: "assetAssignment",
      data: assignment || null,
      title:
        actionType === "create" ? "Assign Asset" : "Update Asset Assignment",
    });
  };

  const handleCloseForm = () => {
    setPopupOption({
      open: false,
      closeOnDocumentClick: true,
      actionType: "create",
      form: "",
      data: null,
      title: "",
    });
  };

  const handleReturn = async (assignment: IAssetAssignment) => {
    const asset = assignment.asset;
    if (!asset) return;

    await confirm({
      title: "Return Asset",
      itemName: asset.name,
      itemDescription: `Code: ${asset.code} | Assigned: ${dayjs(assignment.assignedAt).format("MMM DD, YYYY")}`,
      icon: "info",
      confirmButtonColor: "#3b82f6",
      confirmButtonText: "Yes, return it!",
      successTitle: "Asset Returned!",
      successMessage: "Asset has been returned successfully",
      onConfirm: async () => {
        const res = await returnAsset({
          variables: {
            returnAssetInput: {
              assetId: asset.id,
            },
          },
        });

        if (!res?.data) {
          throw new Error("Failed to return asset");
        }
      },
    });
  };

  // ==================== RENDER FUNCTIONS ====================
  const renderAssetCard = (assignment: IAssetAssignment) => {
    const asset = assignment.asset;
    if (!asset) return null;

    const isAssigned =
      assignment.status === "assigned" && !assignment.returnedAt;

    return (
      <div
        key={assignment.id}
        className="bg-base-100 rounded-lg shadow-sm border border-primary/20 overflow-hidden"
      >
        {/* Asset Image */}
        {asset.image ? (
          <div className="h-40 overflow-hidden bg-base-200">
            <img
              src={`${process.env.NEXT_PUBLIC_API_URL}${asset.image}`}
              alt={asset.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none";
                e.currentTarget.parentElement!.innerHTML = `
                  <div class="flex items-center justify-center h-full">
                    <svg class="w-16 h-16 text-base-content/30" fill="currentColor" viewBox="0 0 256 256">
                      <path d="M224,48H32a16,16,0,0,0-16,16V192a16,16,0,0,0,16,16H224a16,16,0,0,0,16-16V64A16,16,0,0,0,224,48Zm0,16V163.58L196.42,136a16,16,0,0,0-22.62,0L132.69,177.1,113.37,157.78a16,16,0,0,0-22.62,0L32,216.4V64Z"></path>
                    </svg>
                  </div>
                `;
              }}
            />
          </div>
        ) : (
          <div className="h-40 bg-base-200 flex items-center justify-center">
            <PiPackage size={64} className="text-base-content/30" />
          </div>
        )}

        <div className="p-5">
          {/* Asset Details */}
          <div className="space-y-3">
            {/* Asset Name and Status */}
            <div>
              <h4 className="text-lg font-semibold text-primary">
                {asset.name}
              </h4>
              <div className="flex items-center gap-2 mt-1">
                <AssetStatusBadge status={assignment.status} />
              </div>
            </div>

            {/* Asset Type */}
            {asset.assetType && (
              <div className="text-sm text-base-content/80">
                <span className="font-medium">Type:</span>{" "}
                {asset.assetType.name}
              </div>
            )}

            {/* Asset Code */}
            <div className="flex items-center gap-2 text-sm text-base-content/80">
              <PiBarcode size={16} className="text-base-content/60" />
              <span>
                <span className="font-medium">Code:</span> {asset.code}
              </span>
            </div>

            {/* Assigned Date */}
            <div className="flex items-center gap-2 text-sm text-base-content/60">
              <PiCalendar size={16} />
              <span>
                Assigned on:{" "}
                {dayjs(assignment.assignedAt).format("MMM DD, YYYY")}
              </span>
            </div>

            {/* Returned Date */}
            {assignment.returnedAt && (
              <div className="flex items-center gap-2 text-sm text-base-content/60">
                <PiCalendar size={16} />
                <span>
                  Returned on:{" "}
                  {dayjs(assignment.returnedAt).format("MMM DD, YYYY")}
                </span>
              </div>
            )}

            {/* Assigned By */}
            {assignment.assignedByUser && (
              <div className="flex items-center gap-2 text-sm text-base-content/60">
                <PiUser size={16} />
                <span>
                  Assigned by:{" "}
                  {assignment.assignedByUser.profile?.fullName ||
                    assignment.assignedByUser.email}
                </span>
              </div>
            )}

            {/* Note */}
            {assignment.note && (
              <div className="pt-2 border-t border-base-300">
                <p className="text-xs text-base-content/60 italic">
                  Note: {assignment.note}
                </p>
              </div>
            )}
          </div>

          {/* Action Button - Footer */}
          {hasPermission(Permissions.AssetUpdate) && isAssigned && (
            <div className="mt-4 pt-4 border-t border-base-300">
              <button
                onClick={() => handleReturn(assignment)}
                disabled={returningAsset}
                className="btn btn-sm btn-info w-full gap-2"
              >
                <PiArrowBendUpLeft size={18} />
                Return Asset
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  // ==================== COMPONENT STATES ====================
  if (loading) {
    return <CustomLoading />;
  }

  if (!assetAssignments || assetAssignments.length === 0) {
    return (
      <div className="bg-base-100 rounded-lg p-6 shadow-sm border border-primary/20">
        <div className="flex flex-col items-center justify-center py-12 gap-4">
          <PiPackage size={64} className="text-base-content/30" />
          <p className="text-base-content/60 text-center">
            No assets assigned yet
          </p>
          {hasPermission(Permissions.AssetUpdate) && (
            <button
              onClick={() => handleOpenForm("create")}
              className="btn btn-primary btn-sm gap-2"
            >
              <PiPlus size={18} />
              Assign Asset
            </button>
          )}
        </div>

        {/* Popup Modal */}
        <CustomPopup
          popupOption={popupOption}
          setPopupOption={setPopupOption}
          customWidth="60%"
        >
          {popupOption.form === "assetAssignment" && (
            <AssetAssignmentForm
              userId={userId}
              assetAssignment={popupOption.data}
              actionType={popupOption.actionType as "create" | "update"}
              onClose={handleCloseForm}
            />
          )}
        </CustomPopup>
      </div>
    );
  }

  // ==================== RENDER ====================
  return (
    <div className="space-y-6">
      {/* Header with Assign Button */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-base-content">
            Asset Assignments
          </h3>
          <p className="text-sm text-base-content/60">
            Total: {assetAssignments.length} | Assigned: {assignedAssets.length}{" "}
            | Returned: {returnedAssets.length}
          </p>
        </div>
        {hasPermission(Permissions.AssetUpdate) && (
          <button
            onClick={() => handleOpenForm("create")}
            className="btn btn-primary btn-sm gap-2"
          >
            <PiPlus size={18} />
            Assign Asset
          </button>
        )}
      </div>

      {/* Currently Assigned Assets */}
      {assignedAssets.length > 0 && (
        <div>
          <h4 className="text-base font-semibold text-base-content mb-3">
            Currently Assigned ({assignedAssets.length})
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {assignedAssets.map((assignment) => renderAssetCard(assignment))}
          </div>
        </div>
      )}

      {/* Returned Assets */}
      {returnedAssets.length > 0 && (
        <div>
          <h4 className="text-base font-semibold text-base-content mb-3">
            Returned Assets ({returnedAssets.length})
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {returnedAssets.map((assignment) => renderAssetCard(assignment))}
          </div>
        </div>
      )}

      {/* Popup Modal */}
      <CustomPopup
        popupOption={popupOption}
        setPopupOption={setPopupOption}
        customWidth="60%"
      >
        {popupOption.form === "assetAssignment" && (
          <AssetAssignmentForm
            userId={userId}
            assetAssignment={popupOption.data}
            actionType={popupOption.actionType as "create" | "update"}
            onClose={handleCloseForm}
          />
        )}
      </CustomPopup>
    </div>
  );
}
