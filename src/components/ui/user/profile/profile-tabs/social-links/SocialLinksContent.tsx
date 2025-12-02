"use client";

import { useState } from "react";
import { IPopupOption, ISocialLinks } from "@/types";
import CustomPopup from "@/components/modal/CustomPopup";
import {
  PiPencilSimple,
  PiShareNetwork,
  PiPlus,
  PiFacebookLogo,
  PiTwitterLogo,
  PiLinkedinLogo,
  PiInstagramLogo,
  PiGithubLogo,
  PiLink,
} from "react-icons/pi";
import SocialLinkForm from "./components/SocialLinkForm";
import { useQuery } from "@apollo/client/react";
import { GET_SOCIAL_LINKS_BY_PROFILE_ID } from "@/graphql/social-links.api";
import CustomLoading from "@/components/loader/CustomLoading";

interface SocialLinksContentProps {
  userId: number;
}

export default function SocialLinksContent({
  userId,
}: SocialLinksContentProps) {
  const [popupOption, setPopupOption] = useState<IPopupOption>({
    open: false,
    closeOnDocumentClick: true,
    actionType: "create",
    form: "",
    data: null,
    title: "",
  });

  // Fetch social links
  const { data, loading } = useQuery<{
    socialLinksByProfileId: {
      data: ISocialLinks;
    };
  }>(GET_SOCIAL_LINKS_BY_PROFILE_ID, {
    variables: { profileId: userId },
  });

  const socialLinks = data?.socialLinksByProfileId?.data;

  const handleOpenForm = () => {
    setPopupOption({
      open: true,
      closeOnDocumentClick: false,
      actionType: socialLinks ? "update" : "create",
      form: "socialLink",
      data: socialLinks || null,
      title: socialLinks ? "Update Social Links" : "Add Social Links",
    });
  };

  const handleCloseForm = () => {
    setPopupOption({
      open: false,
      closeOnDocumentClick: true,
      actionType: "create",
      form: "",
      data: null,
      title: "",
    });
  };

  const socialPlatforms = [
    {
      name: "Facebook",
      icon: PiFacebookLogo,
      color: "text-[#1877F2]",
      bg: "bg-[#1877F2]/10",
      url: socialLinks?.facebook,
      key: "facebook" as keyof ISocialLinks,
    },
    {
      name: "Twitter",
      icon: PiTwitterLogo,
      color: "text-[#1DA1F2]",
      bg: "bg-[#1DA1F2]/10",
      url: socialLinks?.twitter,
      key: "twitter" as keyof ISocialLinks,
    },
    {
      name: "LinkedIn",
      icon: PiLinkedinLogo,
      color: "text-[#0A66C2]",
      bg: "bg-[#0A66C2]/10",
      url: socialLinks?.linkedin,
      key: "linkedin" as keyof ISocialLinks,
    },
    {
      name: "Instagram",
      icon: PiInstagramLogo,
      color: "text-[#E4405F]",
      bg: "bg-[#E4405F]/10",
      url: socialLinks?.instagram,
      key: "instagram" as keyof ISocialLinks,
    },
    {
      name: "GitHub",
      icon: PiGithubLogo,
      color: "text-[#333333]",
      bg: "bg-[#333333]/10",
      url: socialLinks?.github,
      key: "github" as keyof ISocialLinks,
    },
  ];

  const hasAnySocialLink = socialPlatforms.some((platform) => platform.url);

  if (loading) {
    return <CustomLoading />;
  }

  if (!socialLinks || !hasAnySocialLink) {
    return (
      <div className="bg-base-100 rounded-lg p-6 shadow-sm border border-primary/20">
        <div className="flex flex-col items-center justify-center py-12 gap-4">
          <PiShareNetwork size={64} className="text-base-content/30" />
          <p className="text-base-content/60 text-center">
            No social links added yet
          </p>
          <button
            onClick={handleOpenForm}
            className="btn btn-primary btn-sm gap-2"
          >
            <PiPlus size={18} />
            Add Social Links
          </button>
        </div>

        {/* Popup Modal */}
        <CustomPopup
          popupOption={popupOption}
          setPopupOption={setPopupOption}
          customWidth="60%"
        >
          {popupOption.form === "socialLink" && (
            <SocialLinkForm
              profileId={userId}
              socialLinks={popupOption.data}
              actionType={popupOption.actionType as "create" | "update"}
              onClose={handleCloseForm}
            />
          )}
        </CustomPopup>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Edit Button */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-base-content">
            Social Links
          </h3>
          <p className="text-sm text-base-content/60">
            Connect and share social profiles
          </p>
        </div>
        <button
          onClick={handleOpenForm}
          className="btn btn-primary btn-sm gap-2"
        >
          <PiPencilSimple size={18} />
          Edit Links
        </button>
      </div>

      {/* Social Links Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {socialPlatforms.map((platform) => {
          const Icon = platform.icon;
          const url = platform.url;

          return (
            <div
              key={platform.name}
              className={`bg-base-100 rounded-lg shadow-sm border ${
                url ? "border-primary/20" : "border-base-300"
              } p-5 ${
                url
                  ? "hover:shadow-md transition-shadow cursor-pointer"
                  : "opacity-50"
              }`}
              onClick={() => {
                if (url) {
                  window.open(
                    url.startsWith("http") ? url : `https://${url}`,
                    "_blank"
                  );
                }
              }}
            >
              <div className="flex items-center gap-4">
                {/* Icon */}
                <div className={`p-3 rounded-lg ${platform.bg}`}>
                  <Icon size={32} className={platform.color} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-base font-semibold text-base-content">
                    {platform.name}
                  </h4>
                  {url ? (
                    <div className="flex items-center gap-1 mt-1">
                      <PiLink size={14} className="text-primary shrink-0" />
                      <p className="text-sm text-primary truncate">{url}</p>
                    </div>
                  ) : (
                    <p className="text-xs text-base-content/60 mt-1">
                      Not connected
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Info Alert */}
      <div className="alert alert-info text-sm">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          className="stroke-current shrink-0 w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        <span>Click on any connected social link to open it in a new tab.</span>
      </div>

      {/* Popup Modal */}
      <CustomPopup
        popupOption={popupOption}
        setPopupOption={setPopupOption}
        customWidth="60%"
      >
        {popupOption.form === "socialLink" && (
          <SocialLinkForm
            profileId={userId}
            socialLinks={popupOption.data}
            actionType={popupOption.actionType as "create" | "update"}
            onClose={handleCloseForm}
          />
        )}
      </CustomPopup>
    </div>
  );
}
