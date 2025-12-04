"use client";

import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { UPDATE_EMERGENCY_CONTACT } from "@/graphql/profile.api";
import CustomForm from "@/components/form/CustomForm";
import CustomInputField from "@/components/form/input/CustomInputField";
import FormActionButton from "@/components/form/FormActionButton";
import { emergencyContactSchema } from "@/schemas/profile.schema";
import { FiEdit2 } from "react-icons/fi";
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
            id: Number(user?.profile?.id),
          },
        },
        fetchPolicy: "no-cache",
      });
    } catch (error) {
      console.log(error);
    }
  };

  const emergencyContact = user?.profile?.emergencyContact;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Emergency Contact
        </h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="btn btn-sm btn-primary"
          >
            <FiEdit2 className="w-4 h-4" />
            Edit
          </button>
        )}
      </div>

      {isEditing ? (
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
            />
            <RelationSelect name="relation" label="Relation" required />
          </div>

          <FormActionButton
            isPending={loading}
            cancelHandler={() => setIsEditing(false)}
          />
        </CustomForm>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoItem label="Contact Name" value={emergencyContact?.name} />
          <InfoItem label="Phone Number" value={emergencyContact?.phone} />
          <InfoItem label="Relationship" value={emergencyContact?.relation} />
        </div>
      )}

      {!emergencyContact && !isEditing && (
        <div className="text-center py-12 text-gray-500">
          <p className="mb-4">No emergency contact information added yet.</p>
          <button
            onClick={() => setIsEditing(true)}
            className="btn btn-primary btn-sm"
          >
            Add Emergency Contact
          </button>
        </div>
      )}
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className="text-base font-medium text-gray-900">
        {value || "Not provided"}
      </p>
    </div>
  );
}
