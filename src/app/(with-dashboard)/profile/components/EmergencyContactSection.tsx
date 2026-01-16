"use client";

import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { UPDATE_EMERGENCY_CONTACT } from "@/graphql/profile.api";
import CustomForm from "@/components/form/CustomForm";
import CustomInputField from "@/components/form/input/CustomInputField";
import FormActionButton from "@/components/form/FormActionButton";
import { emergencyContactSchema } from "@/schemas/profile.schema";
import {
  FiEdit2,
  FiUser,
  FiPhone,
  FiUsers,
  FiAlertCircle,
} from "react-icons/fi";
import { IUser } from "@/types";
import { RelationSelect } from "@/components/input-fields";

interface EmergencyContactSectionProps {
  user: IUser;
  refetch: () => void;
}

export default function EmergencyContactSection({
  user,
  refetch,
}: EmergencyContactSectionProps) {
  const [isEditing, setIsEditing] = useState(false);

  const [updateEmergencyContact, { loading }] = useMutation(
    UPDATE_EMERGENCY_CONTACT,
    {
      onCompleted: () => {
        setIsEditing(false);
        refetch();
      },
    }
  );

  // MUTATION TO UPDATE PROFILE
  const handleSubmit = async (data: any) => {
    try {
      await updateEmergencyContact({
        variables: {
          updateEmergencyContactInput: {
            ...data,
            userId: Number(user?.profile?.userId),
          },
        },
        fetchPolicy: "no-cache",
      });
    } catch (error) {
      console.log(error);
    }
  };

  const emergencyContact = user?.profile?.emergencyContact;
  const hasEmergencyContact = !!(
    emergencyContact?.name ||
    emergencyContact?.phone ||
    emergencyContact?.relation
  );

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
            <FiAlertCircle className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Emergency Contact
            </h2>
            <p className="text-sm text-gray-500">
              Person to contact in case of emergency
            </p>
          </div>
        </div>

        {hasEmergencyContact && !isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
          >
            <FiEdit2 className="w-4 h-4" />
            Edit
          </button>
        )}
      </div>

      {/* CONTENT */}
      {isEditing ? (
        // EDIT FORM
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <CustomForm
            submitHandler={handleSubmit}
            resolver={emergencyContactSchema}
            defaultValues={{
              name: emergencyContact?.name || "",
              phone: emergencyContact?.phone || "",
              relation: emergencyContact?.relation || "",
            }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CustomInputField
                name="name"
                label="Contact Name"
                placeholder="Enter emergency contact name"
                required
              />
              <CustomInputField
                name="phone"
                label="Phone Number"
                placeholder="Enter phone number"
                required
              />
              <div className="md:col-span-2">
                <RelationSelect name="relation" label="Relationship" required />
              </div>
            </div>

            <FormActionButton
              isPending={loading}
              cancelHandler={() => setIsEditing(false)}
            />
          </CustomForm>
        </div>
      ) : hasEmergencyContact ? (
        // DISPLAY MODE
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoCard
            icon={FiUser}
            label="Contact Name"
            value={emergencyContact?.name}
            iconBgColor="bg-blue-100"
            iconColor="text-blue-600"
          />
          <InfoCard
            icon={FiPhone}
            label="Phone Number"
            value={emergencyContact?.phone}
            iconBgColor="bg-green-100"
            iconColor="text-green-600"
          />
          <InfoCard
            icon={FiUsers}
            label="Relationship"
            value={emergencyContact?.relation}
            iconBgColor="bg-purple-100"
            iconColor="text-purple-600"
          />
        </div>
      ) : (
        // EMPTY STATE
        <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-200 rounded-full mb-4">
            <FiAlertCircle className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Emergency Contact
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Add emergency contact information for safety purposes. This person
            will be contacted in case of an emergency.
          </p>
          <button
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm hover:shadow-md"
          >
            <FiAlertCircle className="w-5 h-5" />
            Add Emergency Contact
          </button>
        </div>
      )}
    </div>
  );
}

// INFO CARD SUB-COMPONENT
function InfoCard({
  icon: Icon,
  label,
  value,
  iconBgColor,
  iconColor,
}: {
  icon: any;
  label: string;
  value?: string;
  iconBgColor: string;
  iconColor: string;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 hover:border-gray-300 hover:shadow-sm transition-all">
      <div className="flex items-start gap-4">
        <div
          className={`w-10 h-10 ${iconBgColor} rounded-lg flex items-center justify-center shrink-0`}
        >
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
          <p className="text-base font-semibold text-gray-900 truncate">
            {value || "Not provided"}
          </p>
        </div>
      </div>
    </div>
  );
}
