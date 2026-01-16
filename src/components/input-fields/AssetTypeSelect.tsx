import { GET_ASSET_TYPES } from "@/graphql/asset-type.api";
import CustomSelect from "@/components/form/input/CustomSelect";
import { useQuery } from "@apollo/client/react";
import { IAssetType } from "@/types";

// ==================== INTERFACE ====================
interface IAssetTypeSelectProps {
  name: string;
  label?: string;
  required?: boolean;
  placeholder?: string;
  dataAuto?: string;
}

// ==================== ASSET TYPE SELECT COMPONENT ====================
export default function AssetTypeSelect({
  name,
  label = "Asset Type",
  required = false,
  placeholder = "Select Asset Type",
  dataAuto = "asset-type",
}: IAssetTypeSelectProps) {
  // FETCH ASSET TYPES
  const { data, loading } = useQuery<{
    assetTypes: { data: IAssetType[] };
  }>(GET_ASSET_TYPES, {});

  // MAP TO SELECT OPTIONS
  const options =
    data?.assetTypes?.data?.map((type: IAssetType) => ({
      label: type.name,
      value: Number(type.id),
    })) || [];

  return (
    <CustomSelect
      name={name}
      label={label}
      options={options}
      placeholder={placeholder}
      dataAuto={dataAuto}
      required={required}
      isLoading={loading}
    />
  );
}
