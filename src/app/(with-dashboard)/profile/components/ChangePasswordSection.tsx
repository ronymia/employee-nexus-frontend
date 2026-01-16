"use client";

import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { CHANGE_MY_PASSWORD } from "@/graphql/profile.api";
import CustomForm from "@/components/form/CustomForm";
import CustomInputField from "@/components/form/input/CustomInputField";
import { changePasswordSchema } from "@/schemas/user.schema";
import { FiLock, FiCheckCircle } from "react-icons/fi";

export default function ChangePasswordSection() {
  const [success, setSuccess] = useState(false);

  const [changePassword, { loading }] = useMutation(CHANGE_MY_PASSWORD, {
    onCompleted: () => {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 5000);
    },
  });

  const handleSubmit = async (formValues: any) => {
    try {
      await changePassword({
        variables: {
          changeMyPasswordInput: {
            currentPassword: formValues.currentPassword,
            newPassword: formValues.newPassword,
          },
        },
      });
    } catch (error) {
      console.error("Error changing password:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {success && (
        <div className="alert alert-success mb-6">
          <FiCheckCircle className="w-5 h-5" />
          <span>Password changed successfully!</span>
        </div>
      )}

      {/* FORM CONTAINER */}
      <div className="bg-gray-50 rounded-lg p-6 sm:p-8">
        {/* HEADER */}
        <div className="max-w-md mx-auto flex items-center justify-start gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
            <FiLock className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">
            Change Password
          </h2>
        </div>

        <div className="max-w-md mx-auto">
          <CustomForm
            submitHandler={handleSubmit}
            resolver={changePasswordSchema}
            defaultValues={{
              currentPassword: "",
              newPassword: "",
              confirmPassword: "",
            }}
            className="space-y-4"
          >
            <CustomInputField
              name="currentPassword"
              label="Current Password"
              type="password"
              placeholder="Enter current password"
              required
            />

            <div className="divider">New Password</div>

            <CustomInputField
              name="newPassword"
              label="New Password"
              type="password"
              placeholder="Enter new password"
              required
            />

            <CustomInputField
              name="confirmPassword"
              label="Confirm New Password"
              type="password"
              placeholder="Re-enter new password"
              required
            />

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm">
              <div className="flex items-start gap-2">
                <FiLock className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
                <div className="text-yellow-800">
                  <p className="font-medium mb-2">Password Requirements:</p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>Must be at least 6 characters long</li>
                    <li>Should include uppercase and lowercase letters</li>
                    <li>Should include numbers and special characters</li>
                    <li>Must not match your current password</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full"
              >
                {loading ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  "Change Password"
                )}
              </button>
            </div>
          </CustomForm>
        </div>
      </div>
    </div>
  );
}
