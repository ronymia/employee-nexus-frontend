"use client";

import { loginImage } from "@/assets";
import CustomForm from "@/components/form/CustomForm";
import CustomEmailField from "@/components/form/input/CustomEmailField";
import CustomPasswordField from "@/components/form/input/CustomPasswordField";
import { LOGIN_MUTATION } from "@/graphql/auth.api";
import useAppStore from "@/hooks/useAppStore";
import {
  ILoginFormData,
  ILoginResponse,
  ILoginVariables,
  loginSchema,
} from "@/schemas/auth.schema";
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
      router.push("/dashboard");
    }
  };
  return (
    <div
      className={`h-screen flex flex-col md:flex-row items-center justify-start md:justify-center bg-base-300`}
    >
      {/* IMAGE */}
      <div>
        <Image loading="eager" src={loginImage} width={500} alt="login image" />
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
          className={`flex flex-col gap-2 w-xs sm:w-md`}
        >
          {/* EMAIL */}
          <CustomEmailField name="email" label="Email" required />
          {/* PASSWORD */}
          <CustomPasswordField name="password" label="Password" required />

          {/* SUBMIT */}
          <button
            type={"submit"}
            disabled={loginResult.loading}
            className={`btn btn-primary bg-primary flex items-center justify-center border-none rounded-field mt-3 transition-all duration-200
                disabled:bg-primary disabled:opacity-70 disabled:cursor-not-allowed  text-green-950 ${
                  loginResult.loading ? "cursor-not-allowed" : "cursor-grab"
                }`}
          >
            Login
          </button>
        </CustomForm>
      </div>
    </div>
  );
}
