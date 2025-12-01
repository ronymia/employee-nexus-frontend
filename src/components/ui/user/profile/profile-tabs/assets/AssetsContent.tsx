"use client";

import { useState } from "react";
import { IPopupOption } from "@/types";
import CustomPopup from "@/components/modal/CustomPopup";
import {
  PiPencilSimple,
  PiTrash,
  PiPackage,
  PiPlus,
  PiCalendar,
  PiUser,
  PiBarcode,
  PiCheckCircle,
  PiClock,
  PiXCircle,
} from "react-icons/pi";
import AssetAssignmentForm from "./components/AssetAssignmentForm";
import moment from "moment";

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

interface AssetsContentProps {
  userId: number;
  assetAssignments?: IAssetAssignment[];
}

export default function AssetsContent({
  userId,
  assetAssignments = [],
}: AssetsContentProps) {
  const [popupOption, setPopupOption] = useState<IPopupOption>({
    open: false,
    closeOnDocumentClick: true,
    actionType: "create",
    form: "",
    data: null,
    title: "",
  });

  const handleOpenForm = (
    actionType: "create" | "update",
    assignment?: IAssetAssignment
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

  const handleReturn = (id: number) => {
    // TODO: Implement return asset mutation
    console.log("Return asset:", id);
  };

  const handleDelete = (id: number) => {
    // TODO: Implement delete mutation
    console.log("Delete asset assignment:", id);
  };

  // Group assets by status
  const assignedAssets = assetAssignments.filter(
    (assignment) => assignment.status === "assigned" && !assignment.returnedAt
  );
  const returnedAssets = assetAssignments.filter(
    (assignment) => assignment.status === "returned" || assignment.returnedAt
  );

  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "assigned":
        return "badge-success";
      case "returned":
        return "badge-info";
      case "damaged":
        return "badge-warning";
      case "lost":
        return "badge-error";
      default:
        return "badge-ghost";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "assigned":
        return <PiCheckCircle size={16} />;
      case "returned":
        return <PiClock size={16} />;
      case "damaged":
      case "lost":
        return <PiXCircle size={16} />;
      default:
        return <PiPackage size={16} />;
    }
  };

  if (!assetAssignments || assetAssignments.length === 0) {
    return (
      <div className="bg-base-100 rounded-lg p-6 shadow-sm border border-primary/20">
        <div className="flex flex-col items-center justify-center py-12 gap-4">
          <PiPackage size={64} className="text-base-content/30" />
          <p className="text-base-content/60 text-center">
            No assets assigned yet
          </p>
          <button
            onClick={() => handleOpenForm("create")}
            className="btn btn-primary btn-sm gap-2"
          >
            <PiPlus size={18} />
            Assign Asset
          </button>
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

  const renderAssetCard = (assignment: IAssetAssignment) => {
    const asset = assignment.asset;
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
              src={asset.image}
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

        <div className="p-5 relative">
          {/* Action Buttons */}
          <div className="absolute top-3 right-3 flex gap-2">
            {isAssigned && (
              <button
                onClick={() => handleReturn(assignment.id)}
                className="btn btn-xs btn-ghost btn-circle text-info hover:bg-info/10"
                title="Return Asset"
              >
                <PiClock size={16} />
              </button>
            )}
            <button
              onClick={() => handleOpenForm("update", assignment)}
              className="btn btn-xs btn-ghost btn-circle text-primary hover:bg-primary/10"
              title="Edit Assignment"
            >
              <PiPencilSimple size={16} />
            </button>
            <button
              onClick={() => handleDelete(assignment.id)}
              className="btn btn-xs btn-ghost btn-circle text-error hover:bg-error/10"
              title="Remove Assignment"
            >
              <PiTrash size={16} />
            </button>
          </div>

          {/* Asset Details */}
          <div className="space-y-3 pr-24">
            {/* Asset Name and Status */}
            <div>
              <h4 className="text-lg font-semibold text-primary">
                {asset.name}
              </h4>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`badge badge-sm ${getStatusBadgeClass(
                    assignment.status
                  )} gap-1`}
                >
                  {getStatusIcon(assignment.status)}
                  {assignment.status.toUpperCase()}
                </span>
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
                {moment(assignment.assignedAt).format("MMM DD, YYYY")}
              </span>
            </div>

            {/* Returned Date */}
            {assignment.returnedAt && (
              <div className="flex items-center gap-2 text-sm text-base-content/60">
                <PiCalendar size={16} />
                <span>
                  Returned on:{" "}
                  {moment(assignment.returnedAt).format("MMM DD, YYYY")}
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
            {asset.note && (
              <div className="pt-2 border-t border-base-300">
                <p className="text-xs text-base-content/60 italic">
                  Note: {asset.note}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

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
        <button
          onClick={() => handleOpenForm("create")}
          className="btn btn-primary btn-sm gap-2"
        >
          <PiPlus size={18} />
          Assign Asset
        </button>
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
