import CustomForm from "@/components/form/CustomForm";
import FormActionButton from "@/components/form/FormActionButton";
import CustomInputField from "@/components/form/input/CustomInputField";
import CustomRadioButton from "@/components/form/input/CustomRadioButton";
import CustomTextareaField from "@/components/form/input/CustomTextareaField";
import {
  CREATE_WORK_SITES,
  GET_WORK_SITES,
  UPDATE_WORK_SITES,
} from "@/graphql/work-sites.api";
import { IWorkSiteFormData } from "@/schemas";
import { IWorkSite } from "@/types";
import { useMutation } from "@apollo/client/react";

export default function WorkSiteForm({
  handleClosePopup,
  data,
}: {
  handleClosePopup: () => void;
  data: IWorkSite;
}) {
  // MUTATION TO CREATE A NEW WORK SITE
  const [createWorkSite, createResult] = useMutation(CREATE_WORK_SITES, {
    awaitRefetchQueries: true,
    refetchQueries: [{ query: GET_WORK_SITES }],
  });
  const [updateWorkSite, updateResult] = useMutation(UPDATE_WORK_SITES, {
    awaitRefetchQueries: true,
    refetchQueries: [{ query: GET_WORK_SITES }],
  });

  // HANDLER FOR FORM SUBMISSION
  const handleOnSubmit = async (formValues: IWorkSiteFormData) => {
    // Convert string values to appropriate types

    // Convert maxRadius to number if provided
    if (formValues.maxRadius && typeof formValues.maxRadius === "string") {
      formValues.maxRadius = Number(formValues.maxRadius);
    }

    // Convert boolean string values to actual booleans
    if (formValues.isLocationEnabled !== undefined) {
      formValues.isLocationEnabled =
        formValues.isLocationEnabled === "true" ||
        formValues.isLocationEnabled === true;
    }

    if (formValues.isGeoLocationEnabled !== undefined) {
      formValues.isGeoLocationEnabled =
        formValues.isGeoLocationEnabled === "true" ||
        formValues.isGeoLocationEnabled === true;
    }

    if (formValues.isIpEnabled !== undefined) {
      formValues.isIpEnabled =
        formValues.isIpEnabled === "true" || formValues.isIpEnabled === true;
    }

    // Handle IP address - clear it if IP validation is disabled
    if (formValues.isIpEnabled === false) {
      formValues.ipAddress = undefined;
    }

    if (data?.id) {
      formValues["id"] = Number(data.id);
      await updateWorkSite({
        variables: formValues,
      });
    } else {
      await createWorkSite({
        variables: formValues,
      });
    }
    handleClosePopup?.();
  };

  return (
    <CustomForm
      submitHandler={handleOnSubmit}
      defaultValues={{
        ...data,
        // Convert boolean values to strings for radio buttons
        isLocationEnabled:
          data?.isLocationEnabled !== undefined
            ? String(data.isLocationEnabled)
            : undefined,
        isGeoLocationEnabled:
          data?.isGeoLocationEnabled !== undefined
            ? String(data.isGeoLocationEnabled)
            : undefined,
        isIpEnabled:
          data?.isIpEnabled !== undefined
            ? String(data.isIpEnabled)
            : undefined,
      }}
      className={`flex flex-col gap-y-3`}
    >
      {/* NAME */}
      <CustomInputField name="name" label="Name" required />

      {/* DESCRIPTION */}
      <CustomTextareaField name="description" label="Description" required />

      {/* ADDRESS */}
      <CustomTextareaField name="address" label="Address" />

      {/* LOCATION ENABLED */}
      {/* <CustomRadioButton
        required={false}
        dataAuto="isLocationEnabled"
        name="isLocationEnabled"
        label="Location Tracking Enabled"
        radioGroupClassName="grid-cols-2"
        options={[
          {
            title: "Yes",
            value: "true",
          },
          {
            title: "No",
            value: "false",
          },
        ]}
      /> */}

      {/* GEO LOCATION ENABLED */}
      {/* <CustomRadioButton
        required={false}
        dataAuto="isGeoLocationEnabled"
        name="isGeoLocationEnabled"
        label="Geo Location Enabled"
        radioGroupClassName="grid-cols-2"
        options={[
          {
            title: "Yes",
            value: "true",
          },
          {
            title: "No",
            value: "false",
          },
        ]}
      /> */}

      {/* MAX RADIUS */}
      {/* <CustomInputField
        name="maxRadius"
        label="Max Radius (meters)"
        type="number"
      /> */}

      {/* IP ENABLED */}
      {/* <CustomRadioButton
        required={false}
        dataAuto="isIpEnabled"
        name="isIpEnabled"
        label="IP Address Validation Enabled"
        radioGroupClassName="grid-cols-2"
        options={[
          {
            title: "Yes",
            value: "true",
          },
          {
            title: "No",
            value: "false",
          },
        ]}
      /> */}

      {/* IP ADDRESS */}
      {/* <CustomInputField name="ipAddress" label="IP Address" /> */}

      {/* ACTION BUTTON */}
      <FormActionButton
        cancelHandler={handleClosePopup}
        isPending={createResult.loading || updateResult.loading}
      />
    </CustomForm>
  );
}
