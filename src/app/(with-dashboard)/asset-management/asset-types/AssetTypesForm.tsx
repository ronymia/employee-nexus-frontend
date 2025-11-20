import CustomForm from "@/components/form/CustomForm";
import FormActionButton from "@/components/form/FormActionButton";
import CustomInputField from "@/components/form/input/CustomInputField";
import CustomTextareaField from "@/components/form/input/CustomTextareaField";
import {
  CREATE_ASSET_TYPE,
  GET_ASSET_TYPES,
  UPDATE_ASSET_TYPE,
} from "@/graphql/asset-type.api";
import { IAssetTypeFormData } from "@/schemas";
import { IAssetType } from "@/types";
import { useMutation } from "@apollo/client/react";

export default function AssetTypeForm({
  handleClosePopup,
  data,
}: {
  handleClosePopup: () => void;
  data: IAssetType;
}) {
  // MUTATION TO CREATE A NEW ASSET TYPE
  const [createAssetType, createResult] = useMutation(CREATE_ASSET_TYPE, {
    awaitRefetchQueries: true,
    refetchQueries: [{ query: GET_ASSET_TYPES }],
  });
  const [updateAssetType, updateResult] = useMutation(UPDATE_ASSET_TYPE, {
    awaitRefetchQueries: true,
    refetchQueries: [{ query: GET_ASSET_TYPES }],
  });

  // HANDLER FOR FORM SUBMISSION
  const handleOnSubmit = async (formValues: IAssetTypeFormData) => {
    if (data?.id) {
      formValues["id"] = Number(data.id);
      await updateAssetType({
        variables: formValues,
      });
    } else {
      await createAssetType({
        variables: formValues,
      });
    }
    handleClosePopup?.();
  };

  return (
    <CustomForm
      submitHandler={handleOnSubmit}
      defaultValues={data || {}}
      className={`flex flex-col gap-y-3`}
    >
      {/* NAME */}
      <CustomInputField name="name" label="Name" required />
      {/* DESCRIPTION */}
      <CustomTextareaField name="description" label="Description" />

      {/* ACTION BUTTON */}
      <FormActionButton
        cancelHandler={handleClosePopup}
        isPending={createResult.loading || updateResult.loading}
      />
    </CustomForm>
  );
}
