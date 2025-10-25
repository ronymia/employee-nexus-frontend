import CustomForm from "@/components/form/CustomForm";
import FormActionButton from "@/components/form/FormActionButton";
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
      <FormActionButton
        cancelHandler={handleClosePopup}
        isPending={createResult.loading || updateResult.loading}
      />
    </CustomForm>
  );
}
