"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { MdBusiness } from "react-icons/md";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useMutation, useQuery } from "@apollo/client/react";

import CustomForm from "@/components/form/CustomForm";
import FormActionButton from "@/components/form/FormActionButton";
import CustomInputField from "@/components/form/input/CustomInputField";
import CustomLoading from "@/components/loader/CustomLoading";
import {
  GET_BUSINESSES,
  GET_BUSINESS_BY_ID,
  UPDATE_BUSINESS,
} from "@/graphql/business.api";
import { updateBusinessSchema, type IUpdateBusiness } from "@/schemas";
import { IBusiness } from "@/types";

dayjs.extend(customParseFormat);

// ==================== ANIMATION VARIANTS ====================
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
    },
  },
};

// ==================== MAIN COMPONENT ====================
export default function BusinessUpdatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);
  const businessId = Number(id);

  // ==================== GRAPHQL QUERIES ====================
  // GET BUSINESS BY ID
  const { data, loading } = useQuery<{
    businessById: {
      data: IBusiness;
    };
  }>(GET_BUSINESS_BY_ID, {
    variables: { id: businessId },
    skip: !businessId,
  });

  // ==================== MUTATIONS ====================
  const [updateBusiness, { loading: updateLoading }] = useMutation(
    UPDATE_BUSINESS,
    {
      awaitRefetchQueries: true,
      refetchQueries: [{ query: GET_BUSINESSES }],
    }
  );

  // ==================== HANDLERS ====================
  const handleSubmit = async (formValues: IUpdateBusiness) => {
    try {
      console.log({ formValues });

      const { business } = formValues;

      const result = await updateBusiness({
        variables: {
          updateBusinessInput: {
            id: businessId,
            ...business,
          },
        },
      });

      if (result.data) {
        router.push("/businesses");
      }
    } catch (error) {
      console.error("Update business error:", error);
      throw error;
    }
  };

  // ==================== DEFAULT VALUES ====================
  const businessData = data?.businessById?.data;

  const defaultValues: IUpdateBusiness = {
    business: {
      name: businessData?.name || "",
      email: businessData?.email || "",
      phone: businessData?.phone || "",
      address: businessData?.address || "",
      city: businessData?.city || "",
      country: businessData?.country || "",
      postcode: businessData?.postcode || "",
    },
  };

  // ==================== LOADING STATE ====================
  if (loading) {
    return <CustomLoading />;
  }

  // ==================== NO DATA STATE ====================
  if (!businessData) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-error">Business Not Found</h2>
          <p className="mt-2 text-gray-600">
            The requested business could not be found.
          </p>
          <button
            className="btn btn-primary mt-4"
            onClick={() => router.push("/businesses")}
          >
            Back to Businesses
          </button>
        </div>
      </div>
    );
  }

  // ==================== RENDER ====================
  return (
    <div className="container mx-auto p-6">
      {/* PAGE HEADER */}
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-base-content">
          Update Business
        </h1>
        <p className="mt-2 text-sm text-base-content/60">
          Update business information for {businessData.name}
        </p>
      </header>

      <CustomForm
        submitHandler={handleSubmit}
        resolver={updateBusinessSchema}
        defaultValues={defaultValues}
        className="flex flex-col gap-6"
      >
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="space-y-6"
        >
          {/* BUSINESS INFORMATION SECTION */}
          <motion.section
            variants={sectionVariants}
            className="bg-linear-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-100 shadow-sm"
          >
            {/* SECTION HEADER */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
                <MdBusiness className="text-2xl text-success" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-base-content">
                  Business Information
                </h2>
                <p className="text-sm text-base-content/60">
                  Company details and contact information
                </p>
              </div>
            </div>

            {/* FIELDS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              <CustomInputField
                name="business.name"
                label="Business Name"
                required
              />
              <CustomInputField
                type="email"
                inputMode="email"
                name="business.email"
                label="Business Email"
                required
              />
              <CustomInputField
                type="number"
                inputMode="tel"
                name="business.phone"
                label="Phone"
                required
                maxLength={11}
                pattern="[0-9]"
              />
              <CustomInputField
                name="business.address"
                label="Business Address"
                required
              />
              <CustomInputField name="business.city" label="City" required />
              <CustomInputField
                name="business.country"
                label="Country"
                required
              />
              <CustomInputField
                name="business.postcode"
                label="Postcode"
                required
              />
            </div>
          </motion.section>
        </motion.div>

        {/* FORM ACTIONS */}
        <FormActionButton
          isPending={updateLoading}
          cancelHandler={() => {
            router.push("/businesses");
          }}
        />
      </CustomForm>
    </div>
  );
}
