import CustomForm from "@/components/form/CustomForm";
import FormActionButton from "@/components/form/FormActionButton";
import CustomInputField from "@/components/form/input/CustomInputField";
import CustomTextareaField from "@/components/form/input/CustomTextareaField";
import CustomSelect from "@/components/form/input/CustomSelect";
import CustomDatePicker from "@/components/form/input/CustomDatePicker";
import CustomFileUploader from "@/components/form/input/CustomFileUploader";
import { CREATE_ASSET, GET_ASSETS, UPDATE_ASSET } from "@/graphql/asset.api";
import { GET_ASSET_TYPES } from "@/graphql/asset-type.api";
import { AssetFormData } from "@/schemas";
import { Asset } from "@/types";
import { useMutation, useQuery } from "@apollo/client/react";

export default function AssetsForm({
  handleClosePopup,
  data,
}: {
  handleClosePopup: () => void;
  data: Asset;
}) {
  // QUERY TO GET ASSET TYPES FOR DROPDOWN
  const { data: assetTypesData } = useQuery<{
    assetTypes: { data: { id: number; name: string }[] };
  }>(GET_ASSET_TYPES);

  // MUTATION TO CREATE A NEW ASSET
  const [createAsset, createResult] = useMutation(CREATE_ASSET, {
    awaitRefetchQueries: true,
    refetchQueries: [{ query: GET_ASSETS }],
  });
  const [updateAsset, updateResult] = useMutation(UPDATE_ASSET, {
    awaitRefetchQueries: true,
    refetchQueries: [{ query: GET_ASSETS }],
  });

  // HANDLER FOR FORM SUBMISSION
  const handleOnSubmit = async (formValues: AssetFormData) => {
    // Convert File to base64 string if image is a File
    if (formValues.image && formValues.image instanceof File) {
      const base64 = await fileToBase64(formValues.image);
      formValues.image = base64;
    }

    formValues["assetTypeId"] = Number(formValues.assetTypeId);

    if (data?.id) {
      (formValues as any)["id"] = Number(data.id);
      await updateAsset({
        variables: formValues,
      });
    } else {
      await createAsset({
        variables: formValues,
      });
    }
    handleClosePopup?.();
  };

  // Helper function to convert File to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  // OPTIONS FOR ASSET TYPE DROPDOWN
  const assetTypeOptions =
    assetTypesData?.assetTypes?.data?.map((type) => ({
      value: type.id,
      label: type.name,
    })) || [];

  return (
    <CustomForm
      submitHandler={handleOnSubmit}
      defaultValues={data || {}}
      className={`flex flex-col gap-y-3`}
    >
      {/* NAME */}
      <CustomInputField name="name" label="Name" required />
      {/* CODE */}
      <CustomInputField name="code" label="Code" required />
      {/* DATE */}
      <CustomDatePicker
        name="date"
        label="Date"
        required
        dataAuto="asset-date"
      />
      {/* ASSET TYPE */}
      <CustomSelect
        name="assetTypeId"
        label="Asset Type"
        options={assetTypeOptions}
        placeholder="Select Asset Type"
        dataAuto="asset-type"
        required={false}
        isLoading={false}
      />
      {/* IMAGE */}
      <CustomFileUploader
        name="image"
        label="Image"
        accept=".png,.jpg,.jpeg,.gif,.webp"
        dataAuto="asset-image"
      />
      {/* NOTE */}
      <CustomTextareaField name="note" label="Note" />

      {/* ACTION BUTTON */}
      <FormActionButton
        cancelHandler={handleClosePopup}
        isPending={createResult.loading || updateResult.loading}
      />
    </CustomForm>
  );
}
