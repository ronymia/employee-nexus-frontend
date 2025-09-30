"use client";

import CustomForm from "@/components/form/CustomForm";
import CustomInputField from "@/components/form/input/CustomInputField";
import React from "react";

export default function BusinessForm() {
  const handleSubmit = async (formValues: any) => {
    console.log({ formValues });
  };
  return (
    <CustomForm submitHandler={handleSubmit}>
      {/* USER INFORMATION */}
      <section
        className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3`}
      >
        <div className="col-span-1 md:col-span-2 xl:col-span-3">
          <h1>User Information</h1>
        </div>

        {/* FULL NAME */}
        <CustomInputField name="fullName" label="Full Name" required />
        {/* EMAIL */}
        <CustomInputField
          type="email"
          inputMode="email"
          name="email"
          label="Email"
          required
        />
        {/* PASSWORD */}
        <CustomInputField
          type="password"
          name="password"
          label="Password"
          required
        />
        {/* PHONE */}
        <CustomInputField
          type="number"
          inputMode="tel"
          name="phone"
          label="Phone"
          required
          maxLength={11}
        />
        {/* PHONE */}
        <CustomInputField
          type="number"
          inputMode="tel"
          name="phone"
          label="Phone"
          required
          maxLength={11}
        />
        {/* DATE OF BIRTH */}
        <CustomInputField
          type="text"
          name="dateOfBirth"
          label="dateOfBirth"
          required
        />
        {/* MARITAL STATUS */}
        <CustomInputField name="maritalStatus" label="maritalStatus" required />
        {/* ADDRESS */}
        <CustomInputField name="address" label="Address" required />

        {/* CITY */}
        <CustomInputField name="city" label="City" required />
        {/* COUNTRY */}
        <CustomInputField name="country" label="Country" required />
        {/* POSTCODE */}
        <CustomInputField name="postcode" label="Postcode" required />
        {/* GENDER */}
        <CustomInputField name="gender" label="Gender" required />
      </section>

      {/* BUSINESS INFORMATION */}
      <section
        className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3`}
      >
        <div className="col-span-1 md:col-span-2 xl:col-span-3">
          <h1>Business Information</h1>
        </div>

        {/* FULL NAME */}
        <CustomInputField name="fullName" label="Full Name" required />
        {/* EMAIL */}
        <CustomInputField
          type="email"
          inputMode="email"
          name="email"
          label="Email"
          required
        />
        {/* PASSWORD */}
        <CustomInputField
          type="password"
          name="password"
          label="Password"
          required
        />
        {/* PHONE */}
        <CustomInputField
          type="number"
          inputMode="tel"
          name="phone"
          label="Phone"
          required
          maxLength={11}
        />
        {/* PHONE */}
        <CustomInputField
          type="number"
          inputMode="tel"
          name="phone"
          label="Phone"
          required
          maxLength={11}
        />
        {/* DATE OF BIRTH */}
        <CustomInputField
          type="text"
          name="dateOfBirth"
          label="dateOfBirth"
          required
        />
        {/* MARITAL STATUS */}
        <CustomInputField name="maritalStatus" label="maritalStatus" required />
        {/* ADDRESS */}
        <CustomInputField name="address" label="Address" required />

        {/* CITY */}
        <CustomInputField name="city" label="City" required />
        {/* COUNTRY */}
        <CustomInputField name="country" label="Country" required />
        {/* POSTCODE */}
        <CustomInputField name="postcode" label="Postcode" required />
      </section>
    </CustomForm>
  );
}
