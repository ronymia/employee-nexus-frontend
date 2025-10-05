"use client";

import CustomForm from "@/components/form/CustomForm";
import FormActionButton from "@/components/form/FormActionButton";
import CustomInputField from "@/components/form/input/CustomInputField";
import {
  GET_BUSINESSES,
  REGISTER_USER_WITH_BUSINESSES,
} from "@/graphql/business.api";
import {
  IUserRegisterWithBusiness,
  userRegisterWithBusinessSchema,
} from "@/schemas";
import { useMutation } from "@apollo/client/react";
import React from "react";

export default function BusinessForm() {
  const [userRegisterWithBusiness, userRegisterWithBusinessResult] =
    useMutation(REGISTER_USER_WITH_BUSINESSES, {
      awaitRefetchQueries: true,
      refetchQueries: [{ query: GET_BUSINESSES }],
    });

  const handleSubmit = async (formValues: IUserRegisterWithBusiness) => {
    console.log({ formValues });
    const { email, password, ...userInput } = formValues.user;

    await userRegisterWithBusiness({
      variables: {
        createUserInput: userInput,
        createProfileInput: {
          email,
          password,
        },
        createBusinessInput: formValues.business,
      },
    });
  };
  return (
    <CustomForm
      submitHandler={handleSubmit}
      resolver={userRegisterWithBusinessSchema}
      className={`flex flex-col gap-3 p-3`}
    >
      {/* USER INFORMATION */}
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
        <CustomInputField
          type="text"
          name="user.dateOfBirth"
          label="Date of birth"
          required
        />
        {/* MARITAL STATUS */}
        <CustomInputField
          name="user.maritalStatus"
          label="Marital Status"
          required
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
        <CustomInputField name="user.gender" label="Gender" required />
      </section>

      {/* BUSINESS INFORMATION */}
      <section
        className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3`}
      >
        <div className="col-span-1 md:col-span-2 xl:col-span-3">
          <h1>Business Information</h1>
        </div>

        {/* FULL NAME */}
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
        <CustomInputField
          type="number"
          inputMode="numeric"
          name="business.numberOfEmployeesAllowed"
          label="Number of Employees Allowed"
          required
          maxLength={3}
        />
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
        {/* Registration DATE */}
        <CustomInputField
          type="text"
          name="business.registrationDate"
          label="Registration Date"
          required
        />
        {/* SUBSCRIPTION PLAN */}
        <CustomInputField
          name="business.subscriptionPlanId"
          label="Subscription Plan"
          required
        />
      </section>

      {/* FORM ACTION */}
      <FormActionButton isPending={userRegisterWithBusinessResult.loading} />
    </CustomForm>
  );
}
