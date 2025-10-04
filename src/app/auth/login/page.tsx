"use client";

import { loginImage } from "@/assets";
import CustomButton from "@/components/button/CustomButton";
import CustomForm from "@/components/form/CustomForm";
import CustomInputField from "@/components/form/input/CustomInputField";
import { LOGIN_MUTATION } from "@/graphql/auth.api";
import {
  ILoginFormData,
  ILoginResponse,
  ILoginVariables,
  loginSchema,
} from "@/schemas/auth.schema";
import useAppStore from "@/stores/useAppStore";
import { useMutation } from "@apollo/client/react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  // STORE
  const { setUser, setToken } = useAppStore((state) => state);
  // NAVIGATE
  const router = useRouter();
  // LOGIN API
  const [login, loginResult] = useMutation<ILoginResponse, ILoginVariables>(
    LOGIN_MUTATION
  );

  // HANDLE SUBMIT
  const handleOnSubmit = async (formValues: ILoginFormData) => {
    // console.log(formValues);

    const { data } = await login({ variables: formValues });
    // console.log({ data });

    // REDIRECT TO DASHBOARD PAGE IF SUCCESS
    if (data?.login?.accessToken) {
      // window.localStorage.setItem("token", data?.login?.accessToken);
      // SET TOKEN AND USER
      // console.log(data?.login?.user);
      // console.log(data?.login?.accessToken);
      setToken(data?.login?.accessToken);
      setUser(data?.login?.user);
      router.push("/");
    }
  };
  return (
    <div
      className={`h-screen flex flex-col md:flex-row items-center justify-start md:justify-center bg-base-300`}
    >
      {/* IMAGE */}
      <div>
        <Image src={loginImage} width={500} alt="login image" />
      </div>

      {/* LOGIN FORM */}

      <div className={`flex flex-col items-center justify-center`}>
        <h1
          className={`text-2xl font-bold text-shadow-primary text-center mb-5`}
        >
          First login your account
        </h1>
        <CustomForm
          submitHandler={handleOnSubmit}
          resolver={loginSchema}
          defaultValues={{}}
          className={`flex flex-col gap-1 w-xs sm:w-md`}
        >
          {/* EMAIL */}
          <CustomInputField type="email" name="email" label="Email" required />
          {/* PASSWORD */}
          <CustomInputField
            type="password"
            name="password"
            label="Password"
            required
          />

          {/* SUBMIT */}
          <CustomButton
            htmlType={"submit"}
            // variant={"primary"}
            className={`mt-5 w-full`}
            disabled={loginResult.loading}
            isLoading={loginResult.loading}
          >
            Login
          </CustomButton>
        </CustomForm>
      </div>
    </div>
  );
}
