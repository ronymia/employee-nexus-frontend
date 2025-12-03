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

  const handleLogoUpload = async (imageUrl: string) => {
    if (!imageUrl) return;

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
      <div
        className={`w-full border shadow-md rounded-xl text-base-300 gap-y-5 sm:gap-x-3 py-5 px-2 md:py-8 md:px-8 bg-linear-to-tr from-primary to-primary/50 flex flex-col  sm:flex-row justify-center sm:justify-start items-center sm:items-start relative`}
      >
        {/* IMAGE */}
        <ImageUploader
          name={`Logo`}
          type="circular"
          defaultImage={businessData?.logo}
          handleGetImage={handleLogoUpload}
          isLoading={updateResult.loading}
        />

        {/* BUSINESS INFO */}
        <div className="flex flex-col gap-6 text-center md:text-left flex-1">
          {/* Name */}
          <div className="flex items-center gap-2 justify-center md:justify-start">
            <h2 className="text-xl font-semibold drop-shadow text-green-950">
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
                className="btn btn-circle btn-sm btn-ghost text-green-950"
              >
                <PiPencilSimple className="text-lg" />
              </button>
            )}
          </div>

          {/* Business Info Grid */}
          <div className="flex  flex-wrap gap-y-3 gap-x-5 text-sm text-green-900 justify-center md:justify-start font-medium overflow-hidden">
            <div className="flex items-center gap-2 drop-shadow-sm">
              <HiOutlineCalendar className="text-lg" />
              <span>
                {dayjs(businessData?.registrationDate, "DD-MM-YYYY").format(
                  "DD MMMM YYYY"
                )}
              </span>
            </div>

            <div className="flex items-center gap-2 wrap-break-word drop-shadow-sm">
              <HiOutlineMail className="text-lg" />
              <span>{businessData?.email}</span>
            </div>

            <div className="flex items-center gap-2 drop-shadow-sm">
              <HiOutlinePhone className="text-lg" />
              <span>{businessData?.phone}</span>
            </div>

            {businessData?.website && (
              <div className="flex items-center gap-2 drop-shadow-sm">
                <span>🌐</span>
                <a
                  href={businessData.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {businessData.website}
                </a>
              </div>
            )}
          </div>

          {/* Status Badge */}
          <div className="flex justify-center md:justify-start">
            <span
              className={`badge ${
                businessData?.status === "ACTIVE"
                  ? "badge-success"
                  : "badge-error"
              }`}
            >
              {businessData?.status}
            </span>
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
            address: businessData?.address || "",
            city: businessData?.city || "",
            country: businessData?.country || "",
            postcode: businessData?.postcode || "",
            website: businessData?.website || "",
          }}
          className={`flex flex-col gap-3 p-3`}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <CustomInputField
              name="name"
              label="Business Name"
              required
              placeholder="Enter business name"
            />
            <CustomInputField
              name="email"
              label="Email"
              type="email"
              required
              placeholder="Enter email"
            />
            <CustomInputField
              name="phone"
              label="Phone"
              required
              placeholder="Enter phone number"
            />
            <CustomInputField
              name="website"
              label="Website"
              placeholder="Enter website URL"
            />
            <CustomInputField
              name="address"
              label="Address"
              required
              placeholder="Enter address"
            />
            <CustomInputField
              name="city"
              label="City"
              required
              placeholder="Enter city"
            />
            <CustomInputField
              name="country"
              label="Country"
              required
              placeholder="Enter country"
            />
            <CustomInputField
              name="postcode"
              label="Postcode"
              required
              placeholder="Enter postcode"
            />
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
