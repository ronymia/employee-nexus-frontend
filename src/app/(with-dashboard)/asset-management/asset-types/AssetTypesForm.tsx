import CustomForm from "@/components/form/CustomForm";
import FormActionButton from "@/components/form/FormActionButton";
import CustomInputField from "@/components/form/input/CustomInputField";
import CustomTextareaField from "@/components/form/input/CustomTextareaField";
import {
  CREATE_ASSET_TYPE,
  GET_ASSET_TYPES,
  UPDATE_ASSET_TYPE,
} from "@/graphql/asset-type.api";
import { assetTypeSchema, IAssetTypeFormData } from "@/schemas";
import { IAssetType } from "@/types";
import { useMutation } from "@apollo/client/react";
import { showToast } from "@/components/ui/CustomToast";

// ==================== ASSET TYPE FORM COMPONENT ====================
export default function AssetTypeForm({
  handleClosePopup,
  data,
}: {
  handleClosePopup: () => void;
  data: IAssetType;
}) {
  // ==================== GRAPHQL MUTATIONS ====================
  // CREATE ASSET TYPE MUTATION
  const [createAssetType, createResult] = useMutation(CREATE_ASSET_TYPE, {
    awaitRefetchQueries: true,
    refetchQueries: [{ query: GET_ASSET_TYPES }],
  });

  // UPDATE ASSET TYPE MUTATION
  const [updateAssetType, updateResult] = useMutation(UPDATE_ASSET_TYPE, {
    awaitRefetchQueries: true,
    refetchQueries: [{ query: GET_ASSET_TYPES }],
  });

  // ==================== FORM SUBMISSION HANDLER ====================
  const handleOnSubmit = async (formValues: IAssetTypeFormData) => {
    // UPDATE EXISTING ASSET TYPE
    if (data?.id) {
      formValues["id"] = Number(data.id);
      const res = await updateAssetType({
        variables: formValues,
      });
      if (res?.data) {
        showToast.success("Updated!", "Asset type updated successfully");
        handleClosePopup?.();
      }
    }
    // CREATE NEW ASSET TYPE
    else {
      const res = await createAssetType({
        variables: formValues,
      });
      if (res?.data) {
        showToast.success("Created!", "Asset type created successfully");
        handleClosePopup?.();
      }
    }
  };

  // ==================== DEFAULT FORM VALUES ====================
  const defaultValues = {
    name: data?.name || "",
    description: data?.description || "",
  };

  return (
    <CustomForm
      submitHandler={handleOnSubmit}
      resolver={assetTypeSchema}
      defaultValues={defaultValues}
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
