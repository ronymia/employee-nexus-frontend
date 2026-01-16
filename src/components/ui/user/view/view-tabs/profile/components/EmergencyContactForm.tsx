"use client";

import CustomForm from "@/components/form/CustomForm";
import FormActionButton from "@/components/form/FormActionButton";
import CustomInputField from "@/components/form/input/CustomInputField";
import { RelationSelect } from "@/components/input-fields";
import { GET_EMPLOYEE_BY_ID } from "@/graphql/employee.api";
import { UPDATE_EMERGENCY_CONTACT } from "@/graphql/profile.api";
import { IUser } from "@/types";
import { useMutation } from "@apollo/client/react";
import { showToast } from "@/components/ui/CustomToast";

interface IEmergencyContactFormProps {
  employee?: IUser;
  onClose: () => void;
}

export default function EmergencyContactForm({
  employee,
  onClose,
}: IEmergencyContactFormProps) {
  // MUTATION TO UPDATE PROFILE
  const [updateEmergencyContact, updateResult] = useMutation(
    UPDATE_EMERGENCY_CONTACT,
    {
      awaitRefetchQueries: true,
      refetchQueries: [
        {
          query: GET_EMPLOYEE_BY_ID,
          variables: { id: Number(employee?.id) },
        },
      ],
    }
  );
  const handleSubmit = async (data: any) => {
    try {
      const result = await updateEmergencyContact({
        variables: {
          updateEmergencyContactInput: {
            ...data,
            userId: Number(employee?.profile?.userId),
          },
        },
        fetchPolicy: "no-cache",
      });

      if (result.data) {
        showToast.success(
          "Updated!",
          "Emergency contact has been updated successfully"
        );
        onClose();
      }
    } catch (error: any) {
      console.error("Error updating emergency contact:", error);
      showToast.error(
        "Error",
        error.message || "Failed to update emergency contact"
      );
      throw error;
    }
  };

  const defaultValues = {
    name: employee?.profile?.emergencyContact?.name || "",
    phone: employee?.profile?.emergencyContact?.phone || "",
    relation: employee?.profile?.emergencyContact?.relation || "",
  };

  return (
    <CustomForm submitHandler={handleSubmit} defaultValues={defaultValues}>
      <div className="space-y-4">
        <div className="border border-primary/20 rounded-lg p-4">
          <h4 className="text-base font-semibold mb-3 text-primary">
            Emergency Contact Details
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CustomInputField
              dataAuto="contactName"
              name="name"
              type="text"
              label="Contact Name"
              placeholder="Enter contact name"
              required={false}
            />
            <CustomInputField
              dataAuto="contactPhone"
              name="phone"
              type="tel"
              label="Contact Phone"
              placeholder="Enter phone number"
              required={false}
            />
            <div className="md:col-span-2">
              <RelationSelect name="relation" label="Relation" required />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <FormActionButton
          isPending={updateResult.loading}
          cancelHandler={onClose}
        />
      </div>
    </CustomForm>
  );
}
