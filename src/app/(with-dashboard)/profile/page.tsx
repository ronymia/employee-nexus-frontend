"use client";

import { useState } from "react";
import { useQuery } from "@apollo/client/react";
import { GET_MY_PROFILE } from "@/graphql/profile.api";
import CustomLoading from "@/components/loader/CustomLoading";
import {
  FiUser,
  FiMapPin,
  FiPhone,
  FiBriefcase,
  FiLink,
  FiLock,
} from "react-icons/fi";
import ProfileInfoSection from "./components/ProfileInfoSection";
import EmergencyContactSection from "./components/EmergencyContactSection";
import EmploymentDetailsSection from "./components/EmploymentDetailsSection";
import SocialLinksSection from "./components/SocialLinksSection";
import ChangePasswordSection from "./components/ChangePasswordSection";
import { IUser } from "@/types";
import { motion, AnimatePresence } from "motion/react";

// ==================== COMPONENT ====================
export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<string>("info");

  const { data, loading, refetch } = useQuery<{
    getMyProfile: {
      data: IUser;
    };
  }>(GET_MY_PROFILE, {});

  const user = data?.getMyProfile?.data;

  if (loading && !user) {
    return <CustomLoading />;
  }

  const tabs = [
    { id: "info", label: "Personal Info", icon: FiUser, color: "blue" },
    { id: "address", label: "Address", icon: FiMapPin, color: "green" },
    {
      id: "emergency",
      label: "Emergency Contact",
      icon: FiPhone,
      color: "red",
    },
    {
      id: "employment",
      label: "Employment Details",
      icon: FiBriefcase,
      color: "purple",
    },
    { id: "social", label: "Social Links", icon: FiLink, color: "indigo" },
    { id: "password", label: "Change Password", icon: FiLock, color: "gray" },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-blue-50/30 to-indigo-50/50 p-3 sm:p-6">
      <div className="max-w-6xl mx-auto">
        {/* HEADER WITH PROFILE PICTURE */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative bg-linear-to-br from-blue-600 via-indigo-600 to-purple-600 text-white rounded-2xl shadow-2xl p-6 sm:p-8 mb-6 overflow-hidden"
        >
          {/* BACKGROUND PATTERN */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 -left-4 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
            <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000" />
          </div>

          {/* CONTENT */}
          <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6">
            {/* AVATAR */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="relative"
            >
              <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full ring-4 ring-white/30 ring-offset-4 ring-offset-transparent shadow-2xl overflow-hidden bg-white/10 backdrop-blur-sm">
                {user?.profile?.profilePicture ? (
                  <img
                    src={user.profile.profilePicture}
                    alt={user.profile.fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-linear-to-br from-white/20 to-white/5 flex items-center justify-center text-5xl sm:text-6xl font-bold text-white">
                    {user?.profile?.fullName?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              {/* ONLINE INDICATOR */}
              <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-400 rounded-full border-4 border-white shadow-lg" />
            </motion.div>

            {/* USER INFO */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center sm:text-left flex-1"
            >
              <h1 className="text-3xl sm:text-4xl font-bold mb-2 bg-clip-text text-transparent bg-linear-to-r from-white to-blue-100">
                {user?.profile?.fullName}
              </h1>
              <p className="text-white/90 mb-3 text-base sm:text-lg flex items-center gap-2 justify-center sm:justify-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                {user?.email}
              </p>

              <div className="flex flex-wrap gap-3 justify-center sm:justify-start items-center">
                {user?.role && (
                  <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold bg-white/20 backdrop-blur-sm text-white border border-white/30 shadow-lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z"
                        clipRule="evenodd"
                      />
                      <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                    </svg>
                    {user.role.name}
                  </span>
                )}
                {user?.employee?.employeeId && (
                  <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-white/10 backdrop-blur-sm text-white border border-white/20">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zM4 4h3a3 3 0 006 0h3a2 2 0 012 2v9a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm2.5 7a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm2.45 4a2.5 2.5 0 10-4.9 0h4.9zM12 9a1 1 0 100 2h3a1 1 0 100-2h-3zm-1 4a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    ID: {user.employee.employeeId}
                  </span>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* TABS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-lg mb-6 overflow-hidden border border-gray-100"
        >
          <div className="flex overflow-x-auto scrollbar-hide">
            {tabs.map((tab, index) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.05 }}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className={`relative flex items-center gap-2 px-4 sm:px-6 py-4 text-sm sm:text-base font-medium transition-all whitespace-nowrap shrink-0 ${
                  activeTab === tab.id
                    ? "text-blue-600"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.label.split(" ")[0]}</span>

                {/* ACTIVE INDICATOR */}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-blue-500 to-indigo-600 rounded-t-full"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* CONTENT */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100"
          >
            {activeTab === "info" && (
              <ProfileInfoSection
                key={`info-${user?.id}`}
                user={user as IUser}
                refetch={refetch}
              />
            )}
            {activeTab === "address" && (
              <ProfileInfoSection
                key={`address-${user?.id}`}
                user={user as IUser}
                refetch={refetch}
                showAddress
              />
            )}
            {activeTab === "emergency" && (
              <EmergencyContactSection
                key={`emergency-${user?.id}`}
                user={user as IUser}
                refetch={refetch}
              />
            )}
            {activeTab === "employment" && (
              <EmploymentDetailsSection
                key={`employment-${user?.id}`}
                user={user as IUser}
                refetch={refetch}
              />
            )}
            {activeTab === "social" && (
              <SocialLinksSection
                key={`social-${user?.id}`}
                user={user as IUser}
                refetch={refetch}
              />
            )}
            {activeTab === "password" && (
              <ChangePasswordSection key={`password-${user?.id}`} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* CUSTOM ANIMATIONS */}
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
