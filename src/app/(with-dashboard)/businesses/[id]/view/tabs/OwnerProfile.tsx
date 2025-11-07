// components/OwnerProfile.tsx
import Image from "next/image";
import { IUser } from "@/types/user.type";
import FieldView from "@/components/form/FieldView";

interface OwnerProfileProps {
  ownerData: IUser;
  onEdit?: () => void;
}

export default function OwnerProfile({ ownerData, onEdit }: OwnerProfileProps) {
  // const { profile, email, status, roleId } = ownerData;

  return (
    <div className={`max-w-3xl mx-auto p-6 space-y-6`}>
      {/* Header */}
      <div
        className={`flex items-center justify-between bg-base-300 p-6 rounded-lg shadow`}
      >
        <div className={`flex items-center space-x-4`}>
          {/* Avatar */}
          <div
            className={`w-16 h-16 rounded-full bg-base-100 flex items-center justify-center text-xl font-semibold text-green-950`}
          >
            {ownerData?.profile?.fullName?.charAt(0)}
          </div>
          <div>
            <h2 className={`text-2xl font-bold mb-1 text-green-950`}>
              {ownerData?.profile?.fullName}
            </h2>
            <span className={`text-sm text-green-900 font-medium`}>
              {ownerData?.email}
            </span>
            <small className={`text-sm text-green-900 block font-medium`}>
              {ownerData?.status}
            </small>
          </div>
        </div>
        <button
          type={`button`}
          onClick={onEdit}
          className={`bg-linear-to-tl to-primary shadow-md from-primary hover:bg-green-700 text-base-300 font-semibold px-4 py-2 rounded-md`}
        >
          Edit Profile
        </button>
      </div>

      {/* Contact Information */}
      <div
        className={`bg-base-300 p-6 rounded-lg shadow grid grid-cols-1 md:grid-cols-2 gap-4`}
      >
        <FieldView label={`Address`} value={ownerData?.profile?.address} />
        <FieldView label={`City`} value={ownerData?.profile?.city} />
        <FieldView label={`Country`} value={ownerData?.profile?.country} />
        <FieldView label={`Postcode`} value={ownerData?.profile?.postcode} />
        <FieldView label={`Phone`} value={ownerData?.profile?.phone} />
        <FieldView
          label={`Date of Birth`}
          value={ownerData?.profile?.dateOfBirth}
        />
        <FieldView label={`Gender`} value={ownerData?.profile?.gender} />
        <FieldView
          label={`Marital Status`}
          value={ownerData?.profile?.maritalStatus}
        />
      </div>
    </div>
  );
}
