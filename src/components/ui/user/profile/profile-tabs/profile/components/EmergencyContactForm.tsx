"use client";

import CustomForm from "@/components/form/CustomForm";
import FormActionButton from "@/components/form/FormActionButton";
import CustomInputField from "@/components/form/input/CustomInputField";
import { IEmployee } from "@/types";

interface EmergencyContactFormProps {
  employee?: IEmployee;
  onClose: () => void;
}

export default function EmergencyContactForm({
  employee,
  onClose,
}: EmergencyContactFormProps) {
  const handleSubmit = async (data: any) => {
    console.log("Emergency Contact Update:", data);
    // TODO: Implement GraphQL mutation
    onClose();
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
              <CustomInputField
                dataAuto="relation"
                name="relation"
                type="text"
                label="Relation"
                placeholder="Enter relation (e.g., Spouse, Parent, Sibling)"
                required={false}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <FormActionButton isPending={false} cancelHandler={onClose} />
      </div>
    </CustomForm>
  );
}
