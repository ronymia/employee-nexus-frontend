"use client";
import ImageUploader from "@/components/ui/uploader/ImageUploader";
import { IBusiness } from "@/types";
import dayjs from "dayjs";
import { HiOutlineMail } from "react-icons/hi";
import { HiOutlineCalendar, HiOutlinePhone } from "react-icons/hi2";
import { PiPencilSimple } from "react-icons/pi";
import CustomPopup from "@/components/modal/CustomPopup";
import usePopupOption from "@/hooks/usePopupOption";
import CustomForm from "@/components/form/CustomForm";
import CustomInputField from "@/components/form/input/CustomInputField";
import FormActionButton from "@/components/form/FormActionButton";
import { UPDATE_BUSINESS } from "@/graphql/business.api";
import { useMutation } from "@apollo/client/react";
import { GET_BUSINESS_BY_ID } from "@/graphql/business.api";
import useAppStore from "@/stores/appStore";
import * as z from "zod";
import { useState } from "react";
import usePermissionGuard from "@/guards/usePermissionGuard";
import { Permissions } from "@/constants/permissions.constant";

dayjs.extend(require("dayjs/plugin/advancedFormat"));

interface IBusinessSettingsViewHeaderProps {
  businessData: IBusiness;
}

const businessSchema = z.object({
  name: z.string().nonempty("Business name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().nonempty("Phone is required"),
  address: z.string().nonempty("Address is required"),
  city: z.string().nonempty("City is required"),
  country: z.string().nonempty("Country is required"),
  postcode: z.string().nonempty("Postcode is required"),
  website: z.string().optional(),
});

export default function BusinessSettingsCard({
  businessData,
}: IBusinessSettingsViewHeaderProps) {
  const { popupOption, setPopupOption } = usePopupOption();
  const { user } = useAppStore((state) => state);
  const { hasPermission } = usePermissionGuard();
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  const [updateBusiness, updateResult] = useMutation(UPDATE_BUSINESS, {
    awaitRefetchQueries: true,
    refetchQueries: [
      { query: GET_BUSINESS_BY_ID, variables: { id: user.businessId } },
    ],
  });

  const handleLogoUpload = async (file: File) => {
    if (!file) return;

    // TODO: Upload file to storage and get URL
    // For now, you need to implement file upload to your backend or storage service
    // const imageUrl = await uploadFileToStorage(file);

    // Temporary: Create object URL for preview (this won't persist)
    const imageUrl = URL.createObjectURL(file);

    await updateBusiness({
      variables: {
        updateBusinessInput: {
          id: Number(businessData.id),
          logo: imageUrl,
        },
      },
    });
  };

  const handleSubmit = async (formValues: any) => {
    await updateBusiness({
      variables: {
        updateBusinessInput: {
          id: Number(businessData.id),
          ...formValues,
        },
      },
    }).then(() => {
      setPopupOption((prev) => ({ ...prev, open: false }));
    });
  };

  return (
    <section
      className={`max-w-5xl flex flex-col items-center justify-center overflow-hidden`}
    >
      {/* BUSINESS CARD */}
      <div className="w-full border shadow-md rounded-xl text-base-300 py-6 px-4 md:py-8 md:px-8 bg-linear-to-tr from-primary to-primary/50">
        <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
          {/* LOGO */}
          <div className="flex-shrink-0">
            <ImageUploader
              name="Logo"
              type="circular"
              defaultImage={businessData?.logo}
              handleGetImage={handleLogoUpload}
              isLoading={updateResult.loading}
            />
          </div>

          {/* BUSINESS INFO */}
          <div className="flex-1 w-full space-y-4">
            {/* Header: Name & Edit Button */}
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-2xl font-bold drop-shadow text-green-950">
                {businessData?.name}
              </h2>
              {hasPermission(Permissions.BusinessUpdate) && (
                <button
                  onClick={() =>
                    setPopupOption({
                      open: true,
                      closeOnDocumentClick: true,
                      actionType: "update",
                      form: "",
                      data: businessData,
                      title: "Edit Business Information",
                    })
                  }
                  className="btn btn-circle btn-sm btn-ghost text-green-950 hover:bg-green-950/10"
                  title="Edit Business"
                >
                  <PiPencilSimple className="text-lg" />
                </button>
              )}
            </div>

            {/* Status Badge */}
            <div>
              <span
                className={`badge badge-lg ${
                  businessData?.status === "ACTIVE"
                    ? "badge-success"
                    : "badge-error"
                }`}
              >
                {businessData?.status}
              </span>
            </div>

            {/* Contact Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-white font-medium">
              {/* Registration Date */}
              <div className="flex items-center gap-2">
                <HiOutlineCalendar className="text-lg flex-shrink-0" />
                <div>
                  <div className="text-xs text-white opacity-80">
                    Registered
                  </div>
                  <div className="font-semibold">
                    {dayjs(businessData?.registrationDate, "DD-MM-YYYY").format(
                      "DD MMMM YYYY"
                    )}
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center gap-2">
                <HiOutlineMail className="text-lg flex-shrink-0" />
                <div className="truncate">
                  <div className="text-xs  opacity-80">Email</div>
                  <div className="font-semibold truncate">
                    {businessData?.email}
                  </div>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-2">
                <HiOutlinePhone className="text-lg flex-shrink-0" />
                <div>
                  <div className="text-xs text-white opacity-80">Phone</div>
                  <div className="font-semibold">{businessData?.phone}</div>
                </div>
              </div>

              {/* Website */}
              {businessData?.website && (
                <div className="flex items-center gap-2">
                  <span className="text-lg flex-shrink-0">🌐</span>
                  <div className="truncate">
                    <div className="text-xs text-green-800 opacity-80">
                      Website
                    </div>
                    <a
                      href={businessData.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold hover:underline truncate block"
                    >
                      {businessData.website}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <CustomPopup popupOption={popupOption} setPopupOption={setPopupOption}>
        <CustomForm
          submitHandler={handleSubmit}
          resolver={businessSchema}
          defaultValues={{
            name: businessData?.name || "",
            email: businessData?.email || "",
            phone: businessData?.phone || "",
            website: businessData?.website || "",
            address: businessData?.address || "",
            city: businessData?.city || "",
            country: businessData?.country || "",
            postcode: businessData?.postcode || "",
          }}
          className={`flex flex-col gap-4 p-4`}
        >
          {/* Basic Information */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-base-content border-b pb-2">
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="md:col-span-2">
                <CustomInputField
                  name="name"
                  label="Business Name"
                  required
                  placeholder="Enter business name"
                />
              </div>
              <CustomInputField
                name="email"
                label="Email Address"
                type="email"
                required
                placeholder="business@example.com"
              />
              <CustomInputField
                name="phone"
                label="Phone Number"
                required
                placeholder="+1 (555) 000-0000"
              />
              <div className="md:col-span-2">
                <CustomInputField
                  name="website"
                  label="Website URL"
                  placeholder="https://www.example.com"
                />
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-base-content border-b pb-2">
              Address Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="md:col-span-2">
                <CustomInputField
                  name="address"
                  label="Street Address"
                  required
                  placeholder="123 Business Street"
                />
              </div>
              <CustomInputField
                name="city"
                label="City"
                required
                placeholder="Enter city"
              />
              <CustomInputField
                name="postcode"
                label="Postal Code"
                required
                placeholder="12345"
              />
              <div className="md:col-span-2">
                <CustomInputField
                  name="country"
                  label="Country"
                  required
                  placeholder="Enter country"
                />
              </div>
            </div>
          </div>

          <FormActionButton
            isPending={updateResult.loading}
            cancelHandler={() =>
              setPopupOption((prev) => ({ ...prev, open: false }))
            }
          />
        </CustomForm>
      </CustomPopup>
    </section>
  );
}
