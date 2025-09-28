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
  actionButtonClassName?: string;
  cancelHandler?: () => void;
  dataAuto?: string;
  showFormActionButton?: boolean;
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
    formState: { errors },
  } = methods;

  console.log({ errors });

  const onSubmit = async (data: any) => {
    //
    try {
      await Promise.resolve(submitHandler(data));

      // RESET FORM
      methods.reset();
    } catch (err) {
      methods.reset(undefined, { keepValues: true });

      //
      console.log(err);
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
