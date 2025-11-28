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
import { useState } from "react";
import useAppStore from "@/hooks/useAppStore";

export default function AssetsForm({
  handleClosePopup,
  data,
}: {
  handleClosePopup: () => void;
  data: Asset;
}) {
  const [isUploading, setIsUploading] = useState(false);
  const token = useAppStore((state) => state.token);

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

  // UPLOAD IMAGE TO BACKEND
  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
        }/assets/upload-file`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const result = await response.json();
      return result?.imagePath || null;
    } catch (error) {
      console.error("Image upload error:", error);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  // HANDLER FOR FORM SUBMISSION
  const handleOnSubmit = async (formValues: AssetFormData) => {
    // Upload image only if a new File is provided (not a string path)
    if (formValues.image && formValues.image instanceof File) {
      const imagePath = await uploadImage(formValues.image);
      formValues.image = imagePath || "";
    } else if (
      typeof formValues.image === "string" &&
      !formValues.image.startsWith("/")
    ) {
      // If it's a string but not a path, clear it
      formValues.image = "";
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
        isPending={createResult.loading || updateResult.loading || isUploading}
      />
    </CustomForm>
  );
}
