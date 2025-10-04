import CustomForm from "@/components/form/CustomForm";
import CustomInputField from "@/components/form/input/CustomInputField";
import CustomTextareaField from "@/components/form/input/CustomTextareaField";
import {
  CREATE_SUBSCRIPTION_PLAN,
  GET_SUBSCRIPTION_PLANS,
  UPDATE_SUBSCRIPTION_PLAN,
} from "@/graphql/subscription-plans.api";
import { ISubscriptionPlanFormData } from "@/schemas";
import { ISubscriptionPlan } from "@/types";
import { useMutation } from "@apollo/client/react";

export default function SubscriptionPlanForm({
  handleClosePopup,
  data,
}: {
  handleClosePopup: () => void;
  data: ISubscriptionPlan;
}) {
  // MUTATION TO CREATE A NEW SUBSCRIPTION PLAN
  const [createSubscriptionPlan, createResult] = useMutation(
    CREATE_SUBSCRIPTION_PLAN,
    {
      awaitRefetchQueries: true,
      refetchQueries: [{ query: GET_SUBSCRIPTION_PLANS }],
    }
  );
  const [updateSubscriptionPlan, updateResult] = useMutation(
    UPDATE_SUBSCRIPTION_PLAN,
    {
      awaitRefetchQueries: true,
      refetchQueries: [{ query: GET_SUBSCRIPTION_PLANS }],
    }
  );

  // HANDLER FOR FORM SUBMISSION
  const handleOnSubmit = async (formValues: ISubscriptionPlanFormData) => {
    // ADDED MODULE ID
    formValues["moduleIds"] = [1];
    formValues["price"] = Number(formValues["price"]);
    formValues["setupFee"] = Number(formValues["setupFee"]);

    console.log({ formValues });
    if (data?.id) {
      formValues["id"] = Number(data.id);
      await updateSubscriptionPlan({
        variables: formValues,
      });
    } else {
      await createSubscriptionPlan({
        variables: formValues,
      });
    }
    handleClosePopup?.();
  };

  // const defaultValues = d
  return (
    <CustomForm
      submitHandler={handleOnSubmit}
      defaultValues={data || {}}
      className={`flex flex-col gap-y-3`}
    >
      {/* NAME */}
      <CustomInputField name="name" label="Name" required />
      {/* PRICE */}
      <CustomInputField type="number" name="price" label="Price" required />
      {/* SETUP FEE */}
      <CustomInputField
        type="number"
        name="setupFee"
        label="Setup Fee"
        required
      />
      {/* DESCRIPTION */}
      <CustomTextareaField name="description" label="Description" required />

      {/* ACTION BUTTON */}
      <div
        className={`w-full md:w-1/2 self-end flex items-center justify-end gap-x-2 px-2`}
      >
        <button
          type="button"
          disabled={createResult.loading || updateResult.loading}
          className={`btn btn-outline btn-primary min-w-1/2 rounded-sm`}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={createResult.loading || updateResult.loading}
          className={`btn btn-primary min-w-1/2 rounded-sm flex items-center justify-center gap-2
    ${
      createResult.loading || updateResult.loading
        ? "opacity-50 cursor-not-allowed !bg-primary !text-base-300"
        : "hover:opacity-90"
    }`}
        >
          {createResult.loading ||
            (updateResult.loading && (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
            ))}
          {createResult.loading || updateResult.loading
            ? "Submitting..."
            : "Submit"}
        </button>
      </div>
    </CustomForm>
  );
}
