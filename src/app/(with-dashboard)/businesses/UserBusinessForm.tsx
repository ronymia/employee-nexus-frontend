"use client";

import CustomForm from "@/components/form/CustomForm";
import FormActionButton from "@/components/form/FormActionButton";
import CustomDatePicker from "@/components/form/input/CustomDatePicker";
import CustomInputField from "@/components/form/input/CustomInputField";
import CustomRadioButton from "@/components/form/input/CustomRadioButton";
import CustomSelect from "@/components/form/input/CustomSelect";
import CustomLoading from "@/components/loader/CustomLoading";
import {
  GET_BUSINESS_BY_ID,
  GET_BUSINESSES,
  REGISTER_USER_WITH_BUSINESSES,
  UPDATE_BUSINESS,
} from "@/graphql/business.api";
import { GET_SUBSCRIPTION_PLANS } from "@/graphql/subscription-plans.api";
import {
  IUserRegisterWithBusiness,
  userRegisterWithBusinessSchema,
  IUpdateBusiness,
  updateBusinessSchema,
} from "@/schemas";
import { IBusiness, ISubscriptionPlan } from "@/types";
import { useMutation, useQuery } from "@apollo/client/react";
import { useRouter } from "next/navigation";

export default function UserBusinessForm({ id = undefined }: { id?: number }) {
  const router = useRouter();

  // GET ALL SUBSCRIPTION PLANS
  const { data, loading } = useQuery<{
    subscriptionPlans: {
      data: ISubscriptionPlan[];
    };
  }>(GET_SUBSCRIPTION_PLANS, {});

  // console.log({ data });
  const businessByIdQuery = useQuery<{
    businessById: {
      data: IBusiness;
    };
  }>(GET_BUSINESS_BY_ID, {
    variables: { id },
    skip: !id,
  });
  const singleBusinessData = businessByIdQuery.data?.businessById?.data;
  console.log({ id, singleBusinessData });
  // MUTATION
  const [userRegisterWithBusiness, userRegisterWithBusinessResult] =
    useMutation(REGISTER_USER_WITH_BUSINESSES, {
      awaitRefetchQueries: true,
      refetchQueries: [{ query: GET_BUSINESSES }],
    });

  const [updateBusiness, updateBusinessResult] = useMutation(UPDATE_BUSINESS, {
    awaitRefetchQueries: true,
    refetchQueries: [
      { query: GET_BUSINESS_BY_ID, variables: { id } },
      { query: GET_BUSINESSES },
    ],
  });

  // HANDLE SUBMIT
  const handleSubmit = async (
    formValues: IUserRegisterWithBusiness | IUpdateBusiness
  ) => {
    if (id) {
      // Update existing business
      const updateValues = formValues as IUpdateBusiness;
      await updateBusiness({
        variables: {
          updateBusinessInput: {
            id: Number(id),
            ...updateValues.business,
          },
        },
      }).then(() => {
        router.replace("/businesses");
      });
    } else {
      // Create new business with user
      const createValues = formValues as IUserRegisterWithBusiness;
      const { email, password, ...userInput } = createValues.user;

      await userRegisterWithBusiness({
        variables: {
          createUserInput: {
            email,
            password,
          },
          createProfileInput: userInput,
          createBusinessInput: createValues.business,
        },
      }).then(() => {
        router.replace("/businesses");
      });
    }
  };

  // console.log({ data });

  // ALL SUBSCRIPTION OPTION
  const subscriptionPlansOptions =
    data?.subscriptionPlans?.data?.map((plan) => ({
      label: plan.name,
      value: Number(plan.id),
    })) || [];

  const defaultValues = id
    ? ({
        // For updates, only business data is needed
        business: {
          name: singleBusinessData?.name || "",
          email: singleBusinessData?.email || "",
          phone: singleBusinessData?.phone || "",
          address: singleBusinessData?.address || "",
          city: singleBusinessData?.city || "",
          country: singleBusinessData?.country || "",
          postcode: singleBusinessData?.postcode || "",
        },
      } as IUpdateBusiness)
    : ({
        // For creation, both user and business data are needed
        user: {
          fullName: singleBusinessData?.owner?.profile?.fullName || "",
          email: singleBusinessData?.owner?.email || "",
          password: "",
          phone: singleBusinessData?.owner?.profile?.phone || "",
          dateOfBirth: singleBusinessData?.owner?.profile?.dateOfBirth || "",
          maritalStatus:
            singleBusinessData?.owner?.profile?.maritalStatus || "SINGLE",
          address: singleBusinessData?.owner?.profile?.address || "",
          city: singleBusinessData?.owner?.profile?.city || "",
          country: singleBusinessData?.owner?.profile?.country || "",
          postcode: singleBusinessData?.owner?.profile?.postcode || "",
          gender: singleBusinessData?.owner?.profile?.gender || "MALE",
        },
        business: {
          name: singleBusinessData?.name || "",
          email: singleBusinessData?.email || "",
          phone: singleBusinessData?.phone || "",
          subscriptionPlanId: singleBusinessData?.subscriptionPlanId || 1,
          address: singleBusinessData?.address || "",
          city: singleBusinessData?.city || "",
          country: singleBusinessData?.country || "",
          postcode: singleBusinessData?.postcode || "",
          registrationDate: singleBusinessData?.registrationDate || "",
          numberOfEmployeesAllowed:
            Number(singleBusinessData?.numberOfEmployeesAllowed) || 100,
        },
      } as IUserRegisterWithBusiness);

  // LOADING
  if (loading || businessByIdQuery.loading) {
    return <CustomLoading />;
  }

  //
  return (
    <CustomForm
      submitHandler={handleSubmit}
      resolver={id ? updateBusinessSchema : userRegisterWithBusinessSchema}
      defaultValues={defaultValues}
      className={`flex flex-col gap-3 p-3`}
    >
      {/* USER INFORMATION - Only show when creating new business */}
      {!id && (
        <section
          className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3`}
        >
          <div className="col-span-1 md:col-span-2 xl:col-span-3">
            <h1>User Information</h1>
          </div>

          {/* FULL NAME */}
          <CustomInputField name="user.fullName" label="Full Name" required />
          {/* EMAIL */}
          <CustomInputField
            type="email"
            inputMode="email"
            name="user.email"
            label="Email"
            required
          />
          {/* PASSWORD */}
          <CustomInputField
            type="password"
            name="user.password"
            label="Password"
            required
          />
          {/* PHONE */}
          <CustomInputField
            type="number"
            inputMode="tel"
            name="user.phone"
            label="Phone"
            required
            maxLength={11}
          />
          {/* DATE OF BIRTH */}
          <CustomDatePicker
            dataAuto="user.dateOfBirth"
            name="user.dateOfBirth"
            label="Date of birth"
            required
          />
          {/* MARITAL STATUS */}
          <CustomRadioButton
            dataAuto="user.maritalStatus"
            required
            name="user.maritalStatus"
            label="Marital Status"
            radioGroupClassName="grid-cols-2"
            options={[
              {
                title: "Single",
                value: "SINGLE",
              },
              {
                title: "Married",
                value: "MARRIED",
              },
            ]}
          />
          {/* ADDRESS */}
          <CustomInputField name="user.address" label="Address" required />

          {/* CITY */}
          <CustomInputField name="user.city" label="City" required />
          {/* COUNTRY */}
          <CustomInputField name="user.country" label="Country" required />
          {/* POSTCODE */}
          <CustomInputField name="user.postcode" label="Postcode" required />
          {/* GENDER */}
          <CustomRadioButton
            dataAuto="user.gender"
            required
            name="user.gender"
            label="Gender"
            radioGroupClassName="grid-cols-2"
            options={[
              {
                title: "Male",
                value: "MALE",
              },
              {
                title: "Female",
                value: "FEMALE",
              },
            ]}
          />
        </section>
      )}

      {/* BUSINESS INFORMATION */}
      <section
        className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3`}
      >
        <div className="col-span-1 md:col-span-2 xl:col-span-3">
          <h1>Business Information</h1>
        </div>

        {/* BUSINESS NAME */}
        <CustomInputField name="business.name" label="Business Name" required />
        {/* EMAIL */}
        <CustomInputField
          type="email"
          inputMode="email"
          name="business.email"
          label="Business Email"
          required
        />
        {/* PHONE */}
        <CustomInputField
          type="number"
          inputMode="tel"
          name="business.phone"
          label="Phone"
          required
          maxLength={11}
          pattern="[0-9]"
        />
        {/* NUMBER OF EMPLOYEE */}
        {!id && (
          <CustomInputField
            type="number"
            inputMode="numeric"
            name="business.numberOfEmployeesAllowed"
            label="Number of Employees Allowed"
            required
            maxLength={3}
          />
        )}
        {/* ADDRESS */}
        <CustomInputField
          name="business.address"
          label="Business Address"
          required
        />

        {/* CITY */}
        <CustomInputField name="business.city" label="City" required />
        {/* COUNTRY */}
        <CustomInputField name="business.country" label="Country" required />
        {/* POSTCODE */}
        <CustomInputField name="business.postcode" label="Postcode" required />
        {/* Registration DATE - Only show when creating */}
        {!id && (
          <CustomDatePicker
            dataAuto="business.registrationDate"
            name="business.registrationDate"
            label="Registration Date"
            required
          />
        )}
        {/* SUBSCRIPTION PLAN - Only show when creating */}
        {!id && (
          <CustomSelect
            position="top"
            name="business.subscriptionPlanId"
            label="Subscription Plan"
            required
            dataAuto="business.subscriptionPlanId"
            isLoading={false}
            options={subscriptionPlansOptions}
          />
        )}
      </section>

      {/* FORM ACTION */}
      <FormActionButton
        isPending={
          userRegisterWithBusinessResult.loading || updateBusinessResult.loading
        }
        cancelHandler={() => {
          router.replace("/businesses");
        }}
      />
    </CustomForm>
  );
}
