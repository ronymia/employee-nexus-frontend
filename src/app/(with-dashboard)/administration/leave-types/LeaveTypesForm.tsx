import React from "react";
import CustomForm from "@/components/form/CustomForm";
import FormActionButton from "@/components/form/FormActionButton";
import CustomInputField from "@/components/form/input/CustomInputField";
import CustomRadioButton from "@/components/form/input/CustomRadioButton";
import CustomSelect from "@/components/form/input/CustomSelect";
import {
  CREATE_LEAVE_TYPE,
  GET_LEAVE_TYPES,
  UPDATE_LEAVE_TYPE,
} from "@/graphql/leave-types.api";
import { GET_EMPLOYMENT_STATUSES } from "@/graphql/employment-status.api";
import { ILeaveTypeFormData, leaveTypeSchema } from "@/schemas";
import { ILeaveType, ILeaveTypeEmploymentStatus } from "@/types";
import { useMutation, useQuery } from "@apollo/client/react";
import { useFormContext, useWatch } from "react-hook-form";

export default function LeaveTypesForm({
  handleClosePopup,
  data,
}: {
  handleClosePopup: () => void;
  data: ILeaveType;
}) {
  // GET EMPLOYMENT STATUSES FOR DROPDOWN
  const { data: employmentStatusesData, loading: employmentStatusesLoading } =
    useQuery<{
      employmentStatuses: {
        data: ILeaveTypeEmploymentStatus[];
      };
    }>(GET_EMPLOYMENT_STATUSES, {});

  // MUTATION TO CREATE A NEW LEAVE TYPE
  const [createLeaveType, createResult] = useMutation(CREATE_LEAVE_TYPE, {
    awaitRefetchQueries: true,
    refetchQueries: [{ query: GET_LEAVE_TYPES }],
  });
  const [updateLeaveType, updateResult] = useMutation(UPDATE_LEAVE_TYPE, {
    awaitRefetchQueries: true,
    refetchQueries: [{ query: GET_LEAVE_TYPES }],
  });

  // EMPLOYMENT STATUSES OPTIONS FOR DROPDOWN
  const employmentStatusesOptions =
    employmentStatusesData?.employmentStatuses?.data?.map((status) => ({
      label: status.name,
      value: Number(status.id),
    })) || [];

  // HANDLER FOR FORM SUBMISSION
  const handleOnSubmit = async (formValues: ILeaveTypeFormData) => {
    const variables = {
      ...formValues,
      leaveMinutes: Number(formValues.leaveMinutes),
      carryOverLimit: formValues.carryOverLimit
        ? Number(formValues.carryOverLimit)
        : null,
      leaveRolloverType: formValues.leaveRolloverType || "NONE",
    };

    if (data?.id) {
      await updateLeaveType({
        variables: {
          id: Number(data.id),
          ...variables,
        },
      });
    } else {
      await createLeaveType({
        variables,
      });
    }
    handleClosePopup?.();
  };

  const defaultValues = {
    name: data?.name || "",
    leaveType: data?.leaveType || "PAID",
    leaveMinutes: data?.leaveMinutes || 0,
    leaveRolloverType: data?.leaveRolloverType || "NONE",
    carryOverLimit: data?.carryOverLimit || 0,
    employmentStatuses:
      data?.employmentStatuses?.map((status) => Number(status.id)) || [],
  };

  return (
    <CustomForm
      key={`leave_type-form-${data?.id}`}
      submitHandler={handleOnSubmit}
      resolver={leaveTypeSchema}
      defaultValues={defaultValues}
      className={`flex flex-col gap-y-3`}
    >
      {/* NAME */}
      <CustomInputField name="name" label="Name" required />

      {/* LEAVE TYPE - RADIO BUTTON */}
      <CustomRadioButton
        dataAuto="leaveType"
        required
        name="leaveType"
        label="Leave Type"
        radioGroupClassName="grid-cols-2"
        options={[
          {
            title: "Paid",
            value: "PAID",
          },
          {
            title: "Unpaid",
            value: "UNPAID",
          },
        ]}
      />

      {/* LEAVE MINUTES */}
      <CustomInputField
        name="leaveMinutes"
        label="Leave Minutes"
        type="number"
        required
      />

      {/* LEAVE ROLLOVER TYPE */}
      <CustomRadioButton
        dataAuto="leaveRolloverType"
        required
        name="leaveRolloverType"
        label="Leave Rollover Type"
        radioGroupClassName="grid-cols-3"
        options={[
          {
            title: "No Rollover",
            value: "NONE",
          },
          {
            title: "Partial Rollover",
            value: "PARTIAL_ROLLOVER",
          },
          {
            title: "Full Rollover",
            value: "FULL_ROLLOVER",
          },
        ]}
      />

      {/* CARRY OVER LIMIT - Only shown for Partial Rollover */}
      <CarryOverLimit />

      {/* EMPLOYMENT STATUSES - MULTI SELECT DROPDOWN */}
      <CustomSelect
        position="top"
        name="employmentStatuses"
        label="Employment Statuses"
        required={false}
        dataAuto="employmentStatuses"
        isLoading={employmentStatusesLoading}
        options={employmentStatusesOptions}
        multipleSelect={true}
      />

      {/* ACTION BUTTON */}
      <FormActionButton
        cancelHandler={handleClosePopup}
        isPending={createResult.loading || updateResult.loading}
      />
    </CustomForm>
  );
}

// Component to conditionally render Carry Over Limit field
function CarryOverLimit() {
  const { setValue } = useFormContext();
  const leaveRolloverType = useWatch({ name: "leaveRolloverType" });

  // Set carryOverLimit to null when not in PARTIAL_ROLLOVER mode
  React.useEffect(() => {
    if (leaveRolloverType !== "PARTIAL_ROLLOVER") {
      setValue("carryOverLimit", null);
    }
  }, [leaveRolloverType, setValue]);

  // Only show the field when Partial Rollover is selected
  if (leaveRolloverType !== "PARTIAL_ROLLOVER") {
    return null;
  }

  return (
    <CustomInputField
      name="carryOverLimit"
      label="Carry Over Limit"
      type="number"
      required
    />
  );
}
