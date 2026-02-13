"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import useAppStore from "@/hooks/useAppStore";

export default function ProfileWelcomeCard() {
  const router = useRouter();
  const user = useAppStore((state) => state.user);
  // Mock data to remove unused state complexity for now
  const currentAddressShortFromBrowser = "New York, USA";
  const myIP = "192.168.1.1";
  const isLoadingLocationAndIp = false;

  // Helpers
  const getFullImageLink = (img: string) => img;

  console.log({ user });

  return (
    <div
      className={`border shadow-md rounded-xl text-base-300 gap-y-5 sm:gap-x-3 py-5 px-2 md:py-8 md:px-8 bg-linear-to-tr to-primary from-primary flex flex-col  sm:flex-row justify-center sm:justify-start items-center sm:items-start mb-6`}
    >
      <div className={`flex flex-col justify-center items-center gap-4`}>
        {/* PROFILE  */}
        <div
          className={`h-[120px] w-[120px] border-2 border-base-300 p-1  rounded-full relative`}
        >
          <Image
            className={`w-full h-full rounded-full object-cover shadow-xl`}
            width={120}
            height={120}
            src={
              user?.profile?.profilePicture
                ? getFullImageLink(user?.profile?.profilePicture)
                : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
            }
            alt=""
            unoptimized
          />

          <span
            className={`absolute -bottom-2 left-1/2 -translate-x-1/2 text-center bg-linear-to-tr from-primary to-primary border-2 text-base-300 text-xs rounded-full font-bold inline-block px-2 py-1`}
          >
            {user?.role?.name ? user?.role?.name : ""}
          </span>
        </div>

        {/* VIEW PROFILE  */}

        <button
          data-auto={`welcome-component-view-profile-dashboard`}
          onClick={() => router.push("/profile")}
          className={`btn btn-xs rounded-md m-0 glass text-base-300 hover:text-white`}
        >
          View Profile
        </button>
      </div>

      <div className={`w-[calc(100%-120px)]`}>
        <h2 className={`text-sm block text-center sm:text-left`}>
          Welcome Back,{" "}
        </h2>

        <p className={`font-bold mb-1 text-center sm:text-left`}>
          {user?.profile?.fullName}
        </p>

        {isLoadingLocationAndIp ? (
          <div
            className={`w-full flex justify-center sm:justify-start items-center `}
          >
            <span>Loading...</span>
          </div>
        ) : (
          <>
            <div className={`font-light flex flex-col`}>
              <h2 className={`text-sm block text-center sm:text-left`}>
                You are currently logged in from:
              </h2>
              <p
                className={`font-semibold inline-block text-center sm:text-left`}
              >
                {currentAddressShortFromBrowser || (
                  <span className={`text-red-200`}>
                    Unable to access your location.
                  </span>
                )}
              </p>
            </div>
            <div
              className={`font-light flex flex-col sm:flex-row items-center gap-x-2 w-full`}
            >
              <span className={`text-sm block text-center sm:text-left`}>
                Your current IP:
              </span>
              <span
                className={`font-semibold inline-block text-center sm:text-left`}
              >
                {myIP}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
