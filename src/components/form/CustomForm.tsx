import { setGraphQLFormErrors } from "@/utils/error.utils";
import type { ReactElement, ReactNode } from "react";
import { FormProvider, useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

type FormConfig = {
  defaultValues?: Record<string, any>;
  resolver?: any;
};

type FormProps = {
  children?: ReactElement | ReactNode;
  submitHandler: SubmitHandler<any>;
  className?: string;
  cancelHandler?: () => void;
  dataAuto?: string;
} & FormConfig;

export default function CustomForm({
  children,
  submitHandler,
  defaultValues,
  resolver,
  className,
}: FormProps) {
  const formConfig: FormConfig = {};

  if (defaultValues) formConfig["defaultValues"] = defaultValues;
  if (resolver) formConfig["resolver"] = zodResolver(resolver);
  const methods = useForm<FormConfig>(formConfig);

  const {
    handleSubmit,
    // formState: { errors },
  } = methods;

  // console.log({ errors });

  const onSubmit = async (data: any) => {
    //
    try {
      await Promise.resolve(submitHandler(data));

      // RESET FORM
      methods.reset();
    } catch (err: any) {
      methods.reset(undefined, { keepValues: true });

      console.log({ err });
      const errors = err?.errors?.at(0)?.extensions?.errors;

      errors.forEach((validationError: any) => {
        if (validationError.field && validationError.message) {
          methods.setError(validationError.field, {
            type: "manual",
            message: validationError.message,
          });
        }
      });
    }
  };

  // useEffect(() => {
  //   if (defaultValues) reset(defaultValues);
  // }, [defaultValues, reset]);

  return (
    <FormProvider {...methods}>
      <form noValidate onSubmit={handleSubmit(onSubmit)} className={className}>
        {children}
      </form>
    </FormProvider>
  );
}
