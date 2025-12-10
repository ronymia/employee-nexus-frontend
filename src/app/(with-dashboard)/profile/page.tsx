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

// Force TypeScript to recognize components

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<string>("info");

  const { data, loading, refetch } = useQuery(GET_MY_PROFILE, {});

  const user = (data as any)?.getMyProfile?.data;

  if (loading && !user) {
    return <CustomLoading />;
  }

  const tabs = [
    { id: "info", label: "Personal Info", icon: FiUser },
    { id: "address", label: "Address", icon: FiMapPin },
    { id: "emergency", label: "Emergency Contact", icon: FiPhone },
    { id: "employment", label: "Employment Details", icon: FiBriefcase },
    { id: "social", label: "Social Links", icon: FiLink },
    { id: "password", label: "Change Password", icon: FiLock },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header with Profile Picture */}
        <div className="bg-primary text-white rounded-lg shadow-lg p-6 sm:p-8 mb-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="avatar">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full ring ring-white ring-offset-2">
                {user?.profile?.profilePicture ? (
                  <img
                    src={user.profile.profilePicture}
                    alt={user.profile.fullName}
                  />
                ) : (
                  <div className="bg-white text-primary flex items-center justify-center text-4xl font-bold">
                    {user?.profile?.fullName?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">
                {user?.profile?.fullName}
              </h1>
              <p className="text-white/90 mb-1">{user?.email}</p>
              {user?.role && (
                <span className="badge badge-lg bg-white/20 text-white border-white/30">
                  {user.role.name}
                </span>
              )}
              {user?.employee?.employeeId && (
                <p className="text-white/80 text-sm mt-2">
                  Employee ID: {user.employee.employeeId}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6 overflow-x-auto">
          <div className="flex border-b min-w-max">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-b-2 border-primary text-primary"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <tab.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.label.split(" ")[0]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
          {activeTab === "info" && (
            <ProfileInfoSection user={user} refetch={refetch} />
          )}
          {activeTab === "address" && (
            <ProfileInfoSection user={user} refetch={refetch} showAddress />
          )}
          {activeTab === "emergency" && (
            <EmergencyContactSection user={user} refetch={refetch} />
          )}
          {activeTab === "employment" && (
            <EmploymentDetailsSection user={user} refetch={refetch} />
          )}
          {activeTab === "social" && (
            <SocialLinksSection user={user} refetch={refetch} />
          )}
          {activeTab === "password" && <ChangePasswordSection />}
        </div>
      </div>
    </div>
  );
}
