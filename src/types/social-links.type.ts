export interface ISocialLinks {
  profileId: number;
  facebook?: string;
  twitter?: string;
  linkedin?: string;
  instagram?: string;
  github?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISocialLinksFormData {
  facebook?: string;
  twitter?: string;
  linkedin?: string;
  instagram?: string;
  github?: string;
}

export enum SocialPlatform {
  FACEBOOK = "facebook",
  TWITTER = "twitter",
  LINKEDIN = "linkedin",
  INSTAGRAM = "instagram",
  GITHUB = "github",
}
