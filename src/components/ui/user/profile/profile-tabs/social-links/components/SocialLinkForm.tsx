"use client";

import CustomForm from "@/components/form/CustomForm";
import FormActionButton from "@/components/form/FormActionButton";
import CustomInputField from "@/components/form/input/CustomInputField";
import {
  PiFacebookLogo,
  PiTwitterLogo,
  PiLinkedinLogo,
  PiInstagramLogo,
  PiGithubLogo,
} from "react-icons/pi";

interface ISocialLink {
  profileId: number;
  facebook?: string;
  twitter?: string;
  linkedin?: string;
  instagram?: string;
  github?: string;
  createdAt: string;
  updatedAt: string;
}

interface SocialLinkFormProps {
  userId: number;
  socialLinks?: ISocialLink;
  actionType: "create" | "update";
  onClose: () => void;
}

export default function SocialLinkForm({
  userId,
  socialLinks,
  actionType,
  onClose,
}: SocialLinkFormProps) {
  const handleSubmit = async (data: any) => {
    console.log("Social Link Form Submit:", {
      ...data,
      userId,
      actionType,
    });
    // TODO: Implement GraphQL mutation
    onClose();
  };

  const defaultValues = {
    facebook: socialLinks?.facebook || "",
    twitter: socialLinks?.twitter || "",
    linkedin: socialLinks?.linkedin || "",
    instagram: socialLinks?.instagram || "",
    github: socialLinks?.github || "",
  };

  return (
    <CustomForm submitHandler={handleSubmit} defaultValues={defaultValues}>
      <div className="space-y-4">
        {/* Social Links Section */}
        <div className="border border-primary/20 rounded-lg p-4">
          <h4 className="text-base font-semibold mb-3 text-primary">
            Social Media Links
          </h4>
          <div className="space-y-4">
            {/* Facebook */}
            <div className="flex items-start gap-3">
              <div className="p-2 bg-[#1877F2]/10 rounded-lg mt-6">
                <PiFacebookLogo size={24} className="text-[#1877F2]" />
              </div>
              <div className="flex-1">
                <CustomInputField
                  dataAuto="facebook"
                  name="facebook"
                  label="Facebook"
                  placeholder="https://facebook.com/username or facebook.com/username"
                  type="text"
                  required={false}
                />
              </div>
            </div>

            {/* Twitter */}
            <div className="flex items-start gap-3">
              <div className="p-2 bg-[#1DA1F2]/10 rounded-lg mt-6">
                <PiTwitterLogo size={24} className="text-[#1DA1F2]" />
              </div>
              <div className="flex-1">
                <CustomInputField
                  dataAuto="twitter"
                  name="twitter"
                  label="Twitter"
                  placeholder="https://twitter.com/username or twitter.com/username"
                  type="text"
                  required={false}
                />
              </div>
            </div>

            {/* LinkedIn */}
            <div className="flex items-start gap-3">
              <div className="p-2 bg-[#0A66C2]/10 rounded-lg mt-6">
                <PiLinkedinLogo size={24} className="text-[#0A66C2]" />
              </div>
              <div className="flex-1">
                <CustomInputField
                  dataAuto="linkedin"
                  name="linkedin"
                  label="LinkedIn"
                  placeholder="https://linkedin.com/in/username or linkedin.com/in/username"
                  type="text"
                  required={false}
                />
              </div>
            </div>

            {/* Instagram */}
            <div className="flex items-start gap-3">
              <div className="p-2 bg-[#E4405F]/10 rounded-lg mt-6">
                <PiInstagramLogo size={24} className="text-[#E4405F]" />
              </div>
              <div className="flex-1">
                <CustomInputField
                  dataAuto="instagram"
                  name="instagram"
                  label="Instagram"
                  placeholder="https://instagram.com/username or instagram.com/username"
                  type="text"
                  required={false}
                />
              </div>
            </div>

            {/* GitHub */}
            <div className="flex items-start gap-3">
              <div className="p-2 bg-[#333333]/10 rounded-lg mt-6">
                <PiGithubLogo size={24} className="text-[#333333]" />
              </div>
              <div className="flex-1">
                <CustomInputField
                  dataAuto="github"
                  name="github"
                  label="GitHub"
                  placeholder="https://github.com/username or github.com/username"
                  type="text"
                  required={false}
                />
              </div>
            </div>
          </div>
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
          <span>
            Enter the full URL or just the username/profile path. All fields are
            optional.
          </span>
        </div>

        {/* Action Buttons */}
        <FormActionButton isPending={false} cancelHandler={onClose} />
      </div>
    </CustomForm>
  );
}
