import { gql } from "@apollo/client";

export const GET_SOCIAL_LINKS_BY_PROFILE_ID = gql`
  query GetSocialLinksByProfileId($userId: Int!) {
    socialLinksByProfileId(userId: $userId) {
      success
      statusCode
      message
      data {
        userId
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
        userId
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
        userId
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
