"use client";

import CustomForm from "@/components/form/CustomForm";
import FormActionButton from "@/components/form/FormActionButton";
import CustomDatePicker from "@/components/form/input/CustomDatePicker";
import CustomInputField from "@/components/form/input/CustomInputField";
import CustomRadioButton from "@/components/form/input/CustomRadioButton";
import CustomSelect from "@/components/form/input/CustomSelect";
import CustomLoading from "@/components/loader/CustomLoading";
import {
  GET_BUSINESSES,
  REGISTER_USER_WITH_BUSINESSES,
} from "@/graphql/business.api";
import { GET_SUBSCRIPTION_PLANS } from "@/graphql/subscription-plans.api";
import {
  IUserRegisterWithBusiness,
  userRegisterWithBusinessSchema,
} from "@/schemas";
import { ISubscriptionPlan } from "@/types";
import { useMutation, useQuery } from "@apollo/client/react";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { MdPerson, MdBusiness, MdCardMembership } from "react-icons/md";
import customParseFormat from "dayjs/plugin/customParseFormat";

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
export default function UserBusinessForm({ id = undefined }: { id?: number }) {
  const router = useRouter();

  // ==================== GRAPHQL QUERIES ====================
  // GET ALL SUBSCRIPTION PLANS
  const { data, loading } = useQuery<{
    subscriptionPlans: {
      data: ISubscriptionPlan[];
    };
  }>(GET_SUBSCRIPTION_PLANS, {});

  // ==================== MUTATIONS ====================
  const [userRegisterWithBusiness, userRegisterWithBusinessResult] =
    useMutation(REGISTER_USER_WITH_BUSINESSES, {
      awaitRefetchQueries: true,
      refetchQueries: [{ query: GET_BUSINESSES }],
    });

  // ==================== HANDLERS ====================
  const handleSubmit = async (formValues: IUserRegisterWithBusiness) => {
    try {
      console.log({ formValues });

      // Create new business with user
      const { email, password, ...userInput } = formValues.user;
      const { subscription, ...businessInput } = formValues.business;

      // Format business registration date
      if (businessInput.registrationDate) {
        businessInput.registrationDate = dayjs(
          businessInput.registrationDate,
          "DD-MM-YYYY"
        ).toDate() as any;
      }

      // Format user date of birth
      if (userInput.dateOfBirth) {
        userInput.dateOfBirth = dayjs(
          userInput.dateOfBirth,
          "DD-MM-YYYY"
        ).toDate() as any;
      }

      // Format subscription dates
      subscription.startDate = dayjs().toDate() as any;

      // Format subscription dates
      if (subscription.endDate) {
        subscription.endDate = dayjs(
          subscription.endDate,
          "DD-MM-YYYY"
        ).toDate() as any;
      }

      console.log({ subscription, businessInput, userInput });

      const result = await userRegisterWithBusiness({
        variables: {
          createUserInput: {
            email,
            password,
          },
          createProfileInput: userInput,
          createBusinessInput: {
            ...businessInput,
            subscription,
          },
        },
      });
      if (result.data) {
        router.replace("/businesses");
        // console.log({ result });
      }
    } catch (error) {
      // console.log({ error });
      throw error;
    }
  };

  // ==================== OPTIONS ====================
  const subscriptionPlansOptions =
    data?.subscriptionPlans?.data?.map((plan) => ({
      label: plan.name,
      value: Number(plan.id),
    })) || [];

  // ==================== DEFAULT VALUES ====================
  const defaultValues: IUserRegisterWithBusiness = {
    user: {
      fullName: "",
      email: "",
      password: "",
      phone: "",
      dateOfBirth: "",
      maritalStatus: "SINGLE",
      address: "",
      city: "",
      country: "",
      postcode: "",
      gender: "MALE",
    },
    business: {
      name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      country: "",
      postcode: "",
      registrationDate: dayjs().format("DD-MM-YYYY"),
      subscription: {
        subscriptionPlanId: 1,
        startDate: undefined,
        endDate: undefined,
        trialEndDate: undefined,
        numberOfEmployeesAllowed: 100,
      },
    },
  };

  // ==================== LOADING STATE ====================
  if (loading) {
    return <CustomLoading />;
  }

  // ==================== RENDER ====================
  return (
    <CustomForm
      submitHandler={handleSubmit}
      resolver={userRegisterWithBusinessSchema}
      // defaultValues={defaultValues}
      className="flex flex-col gap-6 p-6"
    >
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="space-y-6"
      >
        {/* USER INFORMATION SECTION */}
        <motion.section
          variants={sectionVariants}
          className="bg-linear-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100 shadow-sm"
        >
          {/* SECTION HEADER */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <MdPerson className="text-2xl text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-base-content">
                Owner Information
              </h2>
              <p className="text-sm text-base-content/60">
                Personal details of the business owner
              </p>
            </div>
          </div>

          {/* FIELDS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            <CustomInputField name="user.fullName" label="Full Name" required />
            <CustomInputField
              type="email"
              inputMode="email"
              name="user.email"
              label="Email"
              required
            />
            <CustomInputField
              type="password"
              name="user.password"
              label="Password"
              required
            />
            <CustomInputField
              type="number"
              inputMode="tel"
              name="user.phone"
              label="Phone"
              required
              maxLength={11}
            />
            <CustomDatePicker
              dataAuto="user.dateOfBirth"
              name="user.dateOfBirth"
              label="Date of Birth"
              required
            />
            <CustomRadioButton
              dataAuto="user.gender"
              required
              name="user.gender"
              label="Gender"
              radioGroupClassName="grid-cols-2"
              options={[
                { title: "Male", value: "MALE" },
                { title: "Female", value: "FEMALE" },
              ]}
            />
            <CustomInputField name="user.address" label="Address" required />
            <CustomInputField name="user.city" label="City" required />
            <CustomInputField name="user.country" label="Country" required />
            <CustomInputField name="user.postcode" label="Postcode" required />
            <CustomRadioButton
              dataAuto="user.maritalStatus"
              required
              name="user.maritalStatus"
              label="Marital Status"
              radioGroupClassName="grid-cols-2"
              options={[
                { title: "Single", value: "SINGLE" },
                { title: "Married", value: "MARRIED" },
              ]}
            />
          </div>
        </motion.section>

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
            <CustomDatePicker
              dataAuto="business.registrationDate"
              name="business.registrationDate"
              label="Registration Date"
              required
            />
          </div>
        </motion.section>

        {/* SUBSCRIPTION INFORMATION SECTION */}
        <motion.section
          variants={sectionVariants}
          className="bg-linear-to-br from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-100 shadow-sm"
        >
          {/* SECTION HEADER */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
              <MdCardMembership className="text-2xl text-secondary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-base-content">
                Subscription Details
              </h2>
              <p className="text-sm text-base-content/60">
                Select plan and configure subscription dates
              </p>
            </div>
          </div>

          {/* FIELDS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            <CustomSelect
              position="top"
              name="business.subscription.subscriptionPlanId"
              label="Subscription Plan"
              required
              dataAuto="business.subscriptionPlanId"
              isLoading={false}
              options={subscriptionPlansOptions}
            />

            {/* <CustomDatePicker
              dataAuto="business.subscriptionStartDate"
              name="business.subscription.startDate"
              label="Subscription Start Date"
              required={false}
            /> */}
            <CustomDatePicker
              dataAuto="business.subscription.endDate"
              name="business.subscription.endDate"
              label="Subscription End Date"
              required={false}
              disableBeforeDate={dayjs().format("DD-MM-YYYY")}
            />
            {/* <CustomDatePicker
              dataAuto="business.subscriptionTrialEndDate"
              name="business.subscriptionTrialEndDate"
              label="Trial End Date"
              required={false}
            /> */}
            <CustomInputField
              type="number"
              inputMode="numeric"
              name="business.subscription.numberOfEmployeesAllowed"
              label="Number of Employees Allowed"
              required
              maxLength={3}
            />
          </div>
        </motion.section>
      </motion.div>

      {/* FORM ACTIONS */}
      <FormActionButton
        isPending={userRegisterWithBusinessResult.loading}
        cancelHandler={() => {
          router.replace("/businesses");
        }}
      />
    </CustomForm>
  );
}
