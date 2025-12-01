import { gql } from "@apollo/client";

export const GET_SOCIAL_LINKS_BY_PROFILE_ID = gql`
  query GetSocialLinksByProfileId($profileId: Int!) {
    socialLinksByProfileId(profileId: $profileId) {
      success
      statusCode
      message
      data {
        profileId
        facebook
        twitter
        linkedin
        instagram
        github
        createdAt
        updatedAt
      }
    }
  }
`;

export const CREATE_SOCIAL_LINKS = gql`
  mutation CreateSocialLinkInput(
    $createSocialLinkInput: CreateSocialLinkInput!
  ) {
    createSocialLink(createSocialLinkInput: $createSocialLinkInput) {
      success
      statusCode
      message
      data {
        profileId
        facebook
        twitter
        linkedin
        instagram
        github
        createdAt
        updatedAt
      }
    }
  }
`;

export const UPDATE_SOCIAL_LINKS = gql`
  mutation UpdateSocialLinks($updateSocialLinkInput: UpdateSocialLinkInput!) {
    updateSocialLink(updateSocialLinkInput: $updateSocialLinkInput) {
      success
      statusCode
      message
      data {
        profileId
        facebook
        twitter
        linkedin
        instagram
        github
        createdAt
        updatedAt
      }
    }
  }
`;
