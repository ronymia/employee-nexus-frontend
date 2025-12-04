"use client";

import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { UPDATE_SOCIAL_LINKS } from "@/graphql/profile.api";
import CustomForm from "@/components/form/CustomForm";
import CustomInputField from "@/components/form/input/CustomInputField";
import FormActionButton from "@/components/form/FormActionButton";
import { socialLinksSchema } from "@/schemas/profile.schema";
import {
  FiEdit2,
  FiFacebook,
  FiTwitter,
  FiLinkedin,
  FiInstagram,
  FiGithub,
} from "react-icons/fi";
import { IUser } from "@/types";
import { CREATE_SOCIAL_LINKS } from "@/graphql/social-links.api";

interface SocialLinksSectionProps {
  user: IUser;
  refetch: () => void;
}

export default function SocialLinksSection({
  user,
  refetch,
}: SocialLinksSectionProps) {
  const [isEditing, setIsEditing] = useState(false);

  const [createSocialLinks, createResult] = useMutation(CREATE_SOCIAL_LINKS, {
    onCompleted: () => {
      setIsEditing(false);
      refetch();
    },
  });

  const [updateSocialLinks, updateResult] = useMutation(UPDATE_SOCIAL_LINKS, {
    onCompleted: () => {
      setIsEditing(false);
      refetch();
    },
  });

  const handleSubmit = async (formValues: any) => {
    const socialLinksData = {
      facebook: formValues.facebook || "",
      twitter: formValues.twitter || "",
      linkedin: formValues.linkedin || "",
      instagram: formValues.instagram || "",
      github: formValues.github || "",
    };

    try {
      if (isEditing) {
        await updateSocialLinks({
          variables: {
            updateSocialLinkInput: {
              ...socialLinksData,
              profileId: Number(user?.profile?.id),
            },
          },
        });
      } else {
        await createSocialLinks({
          variables: {
            createSocialLinkInput: {
              ...socialLinksData,
              profileId: Number(user?.profile?.id),
            },
          },
        });
      }
    } catch (error) {
      console.error("Error updating social links:", error);
    }
  };

  const socialLinks = user?.profile?.socialLinks || {};

  const socialPlatforms = [
    {
      name: "facebook",
      icon: FiFacebook,
      label: "Facebook",
      color: "text-blue-600",
    },
    {
      name: "twitter",
      icon: FiTwitter,
      label: "Twitter",
      color: "text-sky-500",
    },
    {
      name: "linkedin",
      icon: FiLinkedin,
      label: "LinkedIn",
      color: "text-blue-700",
    },
    {
      name: "instagram",
      icon: FiInstagram,
      label: "Instagram",
      color: "text-pink-600",
    },
    { name: "github", icon: FiGithub, label: "GitHub", color: "text-gray-800" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Social Links</h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="btn btn-sm btn-primary"
          >
            <FiEdit2 className="w-4 h-4" />
            Edit
          </button>
        )}
      </div>

      {isEditing ? (
        <CustomForm
          submitHandler={handleSubmit}
          resolver={socialLinksSchema}
          defaultValues={{
            facebook: socialLinks?.facebook || "",
            twitter: socialLinks?.twitter || "",
            linkedin: socialLinks?.linkedin || "",
            instagram: socialLinks?.instagram || "",
            github: socialLinks?.github || "",
          }}
          className="space-y-4"
        >
          {socialPlatforms.map((platform) => (
            <div key={platform.name} className="flex items-center gap-3">
              <platform.icon className={`w-6 h-6 ${platform.color} shrink-0`} />
              <CustomInputField
                name={platform.name}
                label={platform.label}
                placeholder={`https://${platform.name}.com/yourprofile`}
              />
            </div>
          ))}

          <FormActionButton
            isPending={createResult.loading || updateResult.loading}
            cancelHandler={() => setIsEditing(false)}
          />
        </CustomForm>
      ) : (
        <div className="space-y-4">
          {socialPlatforms.map((platform) => {
            const url = socialLinks[platform.name];
            return (
              <div
                key={platform.name}
                className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <platform.icon className={`w-6 h-6 ${platform.color}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-500 mb-1">{platform.label}</p>
                  {url ? (
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline truncate block"
                    >
                      {url}
                    </a>
                  ) : (
                    <p className="text-gray-400 text-sm">Not provided</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!Object.values(socialLinks).some((link) => link) && !isEditing && (
        <div className="text-center py-12 text-gray-500">
          <p className="mb-4">No social links added yet.</p>
          <button
            onClick={() => setIsEditing(true)}
            className="btn btn-primary btn-sm"
          >
            Add Social Links
          </button>
        </div>
      )}
    </div>
  );
}
