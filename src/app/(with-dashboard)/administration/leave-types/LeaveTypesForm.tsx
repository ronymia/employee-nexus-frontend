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
import { ILeaveTypeFormData } from "@/schemas";
import {
  ILeaveType,
  ILeaveTypeEmploymentStatus,
} from "@/types";
import { useMutation, useQuery } from "@apollo/client/react";

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
    // Ensure leaveHours is a number
    if (formValues.leaveHours !== undefined) {
      formValues.leaveHours = Number(formValues.leaveHours);
    }

    // Ensure carryOverLimit is a number if provided
    if (formValues.carryOverLimit !== undefined) {
      formValues.carryOverLimit = Number(formValues.carryOverLimit);
    }

    if (data?.id) {
      formValues["id"] = Number(data.id);
      await updateLeaveType({
        variables: formValues,
      });
    } else {
      await createLeaveType({
        variables: formValues,
      });
    }
    handleClosePopup?.();
  };

  console.log({ data });

  return (
    <CustomForm
      submitHandler={handleOnSubmit}
      defaultValues={
        data || {
          name: "",
          leaveType: "",
          leaveHours: 0,
          leaveRolloverType: "",
          leaveRolloverValue: 0,
          employmentStatuses: [],
        }
      }
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

      {/* LEAVE HOURS */}
      <CustomInputField
        name="leaveHours"
        label="Leave Hours"
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
            title: "None",
            value: "NONE",
          },
          {
            title: "Carry Over",
            value: "CARRY_OVER",
          },
          {
            title: "Carry Forward",
            value: "CARRY_FORWARD",
          },
        ]}
      />

      {/* CARRY OVER LIMIT */}
      <CustomInputField
        name="carryOverLimit"
        label="Carry Over Limit"
        type="number"
      />

      {/* EMPLOYMENT STATUSES - MULTI SELECT DROPDOWN */}
      <CustomSelect
        position="top"
        name="employmentStatuses"
        label="Employment Statuses"
        required
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
