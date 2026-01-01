"use client";

import { IUser, IPopupOption } from "@/types";
import { useState } from "react";
import CustomPopup from "@/components/modal/CustomPopup";
import ProfileInfoForm from "./components/ProfileInfoForm";
import EmergencyContactForm from "./components/EmergencyContactForm";
import EmploymentDetailsForm from "./components/EmploymentDetailsForm";
import { PiPencilSimple } from "react-icons/pi";
import dayjs from "dayjs";
import usePermissionGuard from "@/guards/usePermissionGuard";
import { Permissions } from "@/constants/permissions.constant";

interface IProfileContentProps {
  employee?: IUser;
}

export default function ProfileContent({ employee }: IProfileContentProps) {
  const { hasPermission } = usePermissionGuard();
  // POPUP STATE MANAGEMENT
  const [popupOption, setPopupOption] = useState<IPopupOption>({
    open: false,
    closeOnDocumentClick: true,
    actionType: "create",
    form: "",
    data: null,
    title: "",
  });

  // CHECK IF EMPLOYEE DATA IS AVAILABLE
  if (!employee) {
    return (
      <div className="bg-base-100 rounded-lg p-6 shadow-sm">
        <p className="text-base-content/60 text-center py-8">
          No employee data available
        </p>
      </div>
    );
  }

  // HANDLERS FOR OPENING AND CLOSING FORMS
  const handleOpenForm = (formType: any, title: string) => {
    setPopupOption({
      open: true,
      closeOnDocumentClick: false,
      actionType: "update",
      form: formType,
      data: employee,
      title: title,
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

  return (
    <div className="space-y-6">
      {/* Personal Information */}
      <div className="bg-base-100 rounded-lg p-6 shadow-sm border border-primary/20 relative">
        {hasPermission(Permissions.ProfileUpdate) ? (
          <button
            onClick={() =>
              handleOpenForm("profileInfo", "Update Profile Information")
            }
            className="absolute top-4 right-4 btn btn-sm btn-ghost btn-circle text-primary hover:bg-primary/10"
            title="Edit Profile Info"
          >
            <PiPencilSimple size={18} />
          </button>
        ) : null}
        <h3 className="text-lg font-semibold mb-4 pb-2 border-b border-primary/30">
          Personal Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="text-sm text-base-content/60 font-medium">
              Full Name
            </label>
            <p className="text-base font-semibold text-base-content">
              {employee.profile?.fullName || "-"}
            </p>
          </div>
          <div>
            <label className="text-sm text-base-content/60 font-medium">
              Email
            </label>
            <p className="text-base font-semibold text-base-content">
              {employee.email || "-"}
            </p>
          </div>
          <div>
            <label className="text-sm text-base-content/60 font-medium">
              Phone
            </label>
            <p className="text-base font-semibold text-base-content">
              {employee.profile?.phone || "-"}
            </p>
          </div>
          <div>
            <label className="text-sm text-base-content/60 font-medium">
              Date of Birth
            </label>
            <p className="text-base font-semibold text-base-content">
              {employee.profile?.dateOfBirth
                ? dayjs(employee.profile.dateOfBirth).format("DD-MM-YYYY")
                : "-"}
            </p>
          </div>
          <div>
            <label className="text-sm text-base-content/60 font-medium">
              Gender
            </label>
            <p className="text-base font-semibold text-base-content">
              {employee.profile?.gender || "-"}
            </p>
          </div>
          <div>
            <label className="text-sm text-base-content/60 font-medium">
              Marital Status
            </label>
            <p className="text-base font-semibold text-base-content">
              {employee.profile?.maritalStatus || "-"}
            </p>
          </div>
        </div>
      </div>

      {/* Address Information */}
      <div className="bg-base-100 rounded-lg p-6 shadow-sm border border-primary/20">
        <h3 className="text-lg font-semibold mb-4 pb-2 border-b border-primary/30">
          Address
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="md:col-span-2 lg:col-span-3">
            <label className="text-sm text-base-content/60 font-medium">
              Street Address
            </label>
            <p className="text-base font-semibold text-base-content">
              {employee.profile?.address || "-"}
            </p>
          </div>
          <div>
            <label className="text-sm text-base-content/60 font-medium">
              City
            </label>
            <p className="text-base font-semibold text-base-content">
              {employee.profile?.city || "-"}
            </p>
          </div>
          <div>
            <label className="text-sm text-base-content/60 font-medium">
              Country
            </label>
            <p className="text-base font-semibold text-base-content">
              {employee.profile?.country || "-"}
            </p>
          </div>
          <div>
            <label className="text-sm text-base-content/60 font-medium">
              Postcode
            </label>
            <p className="text-base font-semibold text-base-content">
              {employee.profile?.postcode || "-"}
            </p>
          </div>
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="bg-base-100 rounded-lg p-6 shadow-sm border border-primary/20 relative">
        {hasPermission(Permissions.ProfileUpdate) ? (
          <button
            onClick={() =>
              handleOpenForm("emergencyContact", "Update Emergency Contact")
            }
            className="absolute top-4 right-4 btn btn-sm btn-ghost btn-circle text-primary hover:bg-primary/10"
            title="Edit Emergency Contact"
          >
            <PiPencilSimple size={18} />
          </button>
        ) : null}
        <h3 className="text-lg font-semibold mb-4 pb-2 border-b border-primary/30">
          Emergency Contact
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="text-sm text-base-content/60 font-medium">
              Contact Name
            </label>
            <p className="text-base font-semibold text-base-content">
              {employee.profile?.emergencyContact?.name || "-"}
            </p>
          </div>
          <div>
            <label className="text-sm text-base-content/60 font-medium">
              Contact Phone
            </label>
            <p className="text-base font-semibold text-base-content">
              {employee.profile?.emergencyContact?.phone || "-"}
            </p>
          </div>
          <div>
            <label className="text-sm text-base-content/60 font-medium">
              Relation
            </label>
            <p className="text-base font-semibold text-base-content">
              {employee.profile?.emergencyContact?.relation || "-"}
            </p>
          </div>
        </div>
      </div>

      {/* Employment Details */}
      <div className="bg-base-100 rounded-lg p-6 shadow-sm border border-primary/20 relative">
        {hasPermission(Permissions.ProfileUpdate) ? (
          <button
            onClick={() =>
              handleOpenForm("employmentDetails", "Update Employment Details")
            }
            className="absolute top-4 right-4 btn btn-sm btn-ghost btn-circle text-primary hover:bg-primary/10"
            title="Edit Employment Details"
          >
            <PiPencilSimple size={18} />
          </button>
        ) : null}
        <h3 className="text-lg font-semibold mb-4 pb-2 border-b border-primary/30">
          Employment Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="text-sm text-base-content/60 font-medium">
              Employee ID
            </label>
            <p className="text-base font-semibold text-base-content">
              {employee?.employee?.employeeId || "-"}
            </p>
          </div>
          {/* <div>
            <label className="text-sm text-base-content/60 font-medium">
              Role
            </label>
            <p className="text-base font-semibold text-base-content">
              {employee?.employee?.role?.name || "-"}
            </p>
          </div> */}
          <div>
            <label className="text-sm text-base-content/60 font-medium">
              Department
            </label>
            <p className="text-base font-semibold text-base-content">
              {employee?.employee?.department?.name || "-"}
            </p>
          </div>
          <div>
            <label className="text-sm text-base-content/60 font-medium">
              Designation
            </label>
            <p className="text-base font-semibold text-base-content">
              {employee?.employee?.designation?.name || "-"}
            </p>
          </div>
          <div>
            <label className="text-sm text-base-content/60 font-medium">
              Employment Status
            </label>
            <p className="text-base font-semibold text-base-content">
              {employee?.employee?.employmentStatus?.name || "-"}
            </p>
          </div>
          <div>
            <label className="text-sm text-base-content/60 font-medium">
              Joining Date
            </label>
            <p className="text-base font-semibold text-base-content">
              {employee?.employee?.joiningDate
                ? dayjs(employee?.employee.joiningDate).format("DD-MM-YYYY")
                : "-"}
            </p>
          </div>
          <div>
            <label className="text-sm text-base-content/60 font-medium">
              Work Site
            </label>
            <p className="text-base font-semibold text-base-content">
              {employee?.employee?.workSites
                ?.map((site) => site.workSite.name)
                .join(", ") || "-"}
            </p>
          </div>
          <div>
            <label className="text-sm text-base-content/60 font-medium">
              Work Schedule
            </label>
            <p className="text-base font-semibold text-base-content">
              {employee?.employee?.workSchedule?.name || "-"}
            </p>
          </div>
          <div>
            <label className="text-sm text-base-content/60 font-medium">
              NID Number
            </label>
            <p className="text-base font-semibold text-base-content">
              {employee?.employee?.nidNumber || "-"}
            </p>
          </div>
          <div>
            <label className="text-sm text-base-content/60 font-medium">
              Salary (Monthly)
            </label>
            <p className="text-base font-semibold text-base-content">
              {employee?.employee?.salaryPerMonth
                ? `${employee?.employee?.salaryPerMonth.toLocaleString()} BDT`
                : "-"}
            </p>
          </div>
          <div>
            <label className="text-sm text-base-content/60 font-medium">
              Working Days/Week
            </label>
            <p className="text-base font-semibold text-base-content">
              {employee?.employee?.workingDaysPerWeek || "-"}
            </p>
          </div>
          <div>
            <label className="text-sm text-base-content/60 font-medium">
              Working Hours/Week
            </label>
            <p className="text-base font-semibold text-base-content">
              {employee?.employee?.workingHoursPerWeek || "-"}
            </p>
          </div>
        </div>
      </div>

      {/* Popup Modals */}
      <CustomPopup
        popupOption={popupOption}
        setPopupOption={setPopupOption}
        customWidth="50%"
      >
        {popupOption.form === "profileInfo" && (
          <ProfileInfoForm
            key={`profileInfo-form`}
            employee={employee}
            onClose={handleCloseForm}
          />
        )}
        {popupOption.form === "emergencyContact" && (
          <EmergencyContactForm
            key={`emergencyContact-form`}
            employee={employee}
            onClose={handleCloseForm}
          />
        )}
        {popupOption.form === "employmentDetails" && (
          <EmploymentDetailsForm
            key={`employmentDetails-form`}
            employee={employee}
            onClose={handleCloseForm}
          />
        )}
      </CustomPopup>
    </div>
  );
}
