import CustomForm from "@/components/form/CustomForm";
import FormActionButton from "@/components/form/FormActionButton";
import CustomInputField from "@/components/form/input/CustomInputField";
import CustomTextareaField from "@/components/form/input/CustomTextareaField";
import CustomDatePicker from "@/components/form/input/CustomDatePicker";
import CustomFileUploader from "@/components/form/input/CustomFileUploader";
import AssetTypeSelect from "@/components/input-fields/AssetTypeSelect";
import { CREATE_ASSET, GET_ASSETS, UPDATE_ASSET } from "@/graphql/asset.api";
import { assetSchema, IAssetFormData } from "@/schemas";
import { IAsset } from "@/types";
import { useMutation } from "@apollo/client/react";
import { useState } from "react";
import useAppStore from "@/hooks/useAppStore";
import { showToast } from "@/components/ui/CustomToast";

// ==================== ASSETS FORM COMPONENT ====================
export default function AssetsForm({
  handleClosePopup,
  data,
}: {
  handleClosePopup: () => void;
  data: IAsset;
}) {
  // ==================== STATE ====================
  const [isUploading, setIsUploading] = useState(false);
  const token = useAppStore((state) => state.token);

  // ==================== GRAPHQL MUTATIONS ====================
  // CREATE ASSET MUTATION
  const [createAsset, createResult] = useMutation(CREATE_ASSET, {
    awaitRefetchQueries: true,
    refetchQueries: [{ query: GET_ASSETS }],
  });

  // UPDATE ASSET MUTATION
  const [updateAsset, updateResult] = useMutation(UPDATE_ASSET, {
    awaitRefetchQueries: true,
    refetchQueries: [{ query: GET_ASSETS }],
  });

  // ==================== IMAGE UPLOAD HANDLER ====================
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

  // ==================== FORM SUBMISSION HANDLER ====================
  const handleOnSubmit = async (formValues: IAssetFormData) => {
    // UPLOAD IMAGE IF PROVIDED
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

    // UPDATE EXISTING ASSET
    if (data?.id) {
      (formValues as any)["id"] = Number(data.id);
      const res = await updateAsset({
        variables: { updateAssetInput: formValues },
      });
      if (res?.data) {
        showToast.success("Updated!", "Asset updated successfully");
        handleClosePopup?.();
      }
    }
    // CREATE NEW ASSET
    else {
      const res = await createAsset({
        variables: { createAssetInput: formValues },
      });
      if (res?.data) {
        showToast.success("Created!", "Asset created successfully");
        handleClosePopup?.();
      }
    }
  };

  // ==================== DEFAULT FORM VALUES ====================
  const defaultValues = {
    name: data?.name || "",
    code: data?.code || "",
    date: data?.date || "",
    assetTypeId: data?.assetTypeId || "",
    image: data?.image || "",
    note: data?.note || "",
  };

  return (
    <CustomForm
      submitHandler={handleOnSubmit}
      resolver={assetSchema}
      defaultValues={defaultValues}
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
      <AssetTypeSelect
        name="assetTypeId"
        label="Asset Type"
        required={true}
        dataAuto="asset-type"
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
