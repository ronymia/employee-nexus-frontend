export const getErrorMessage = (error: any): string => {
  // Check for GraphQL errors with extensions
  if (error?.graphQLErrors?.length > 0) {
    const firstError = error.graphQLErrors[0];

    // Check for validation errors in extensions
    if (
      firstError?.extensions?.errors &&
      Array.isArray(firstError.extensions.errors) &&
      firstError.extensions.errors.length > 0
    ) {
      // Return the message from the first validation error
      return firstError.extensions.errors[0].message;
    }

    // Fallback to the main GraphQL error message
    return firstError.message;
  }

  // Fallback for network errors or other standard Error objects
  if (error?.message) {
    return error.message;
  }

  return "Something went wrong";
};

export const setGraphQLFormErrors = (error: any, setError: any) => {
  let gqlErrors = [];

  if (error?.graphQLErrors?.length > 0) {
    gqlErrors = error.graphQLErrors;
  } else if (error?.errors?.length > 0) {
    gqlErrors = error.errors;
  }

  if (gqlErrors.length > 0) {
    const firstError = gqlErrors[0];
    if (
      firstError?.extensions?.errors &&
      Array.isArray(firstError.extensions.errors)
    ) {
      firstError.extensions.errors.forEach((validationError: any) => {
        if (validationError.path && validationError.message) {
          setError(validationError.path, {
            type: "manual",
            message: validationError.message,
          });
        }
      });
    }
  }
};
