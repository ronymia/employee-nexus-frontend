import useAppStore from "@/hooks/useAppStore";

export default function usePermissionGuard() {
  const { permissions } = useAppStore((state) => state);

  // AUTH GUARD - Single Resource with Multiple Actions
  const permissionGuard = (
    resource: string,
    action: string[],
    checkAllPermissions?: boolean
  ) => {
    // If no permissions available, deny access
    if (!permissions || permissions.length === 0) {
      return false;
    }

    // If no actions specified, deny access
    if (!action || action.length === 0) {
      return false;
    }

    // Check if all permissions are required (AND logic)
    if (checkAllPermissions) {
      return action.every((act) => permissions.includes(`${resource}:${act}`));
    }

    // Check if any permission is sufficient (OR logic)
    return action.some((act) => permissions.includes(`${resource}:${act}`));
  };

  // Check Multiple Resources and Actions
  const checkMultiplePermissions = (
    checks: Array<{ resource: string; actions: string[] }>,
    requireAll?: boolean
  ) => {
    // If no permissions available, deny access
    if (!permissions || permissions.length === 0) {
      return false;
    }

    // If no checks specified, deny access
    if (!checks || checks.length === 0) {
      return false;
    }

    // Check if ALL resource-action combinations are required (AND logic)
    if (requireAll) {
      return checks.every((check) =>
        check.actions.some((action) =>
          permissions.includes(`${check.resource}:${action}`)
        )
      );
    }

    // Check if ANY resource-action combination is sufficient (OR logic)
    return checks.some((check) =>
      check.actions.some((action) =>
        permissions.includes(`${check.resource}:${action}`)
      )
    );
  };

  // Check if user has exact permission string
  const hasPermission = (permissionString: string) => {
    if (!permissions || permissions.length === 0) {
      return false;
    }
    return permissions.includes(permissionString);
  };

  // Check if user has multiple exact permission strings
  const hasPermissions = (
    permissionStrings: string[],
    requireAll?: boolean
  ) => {
    if (!permissions || permissions.length === 0) {
      return false;
    }

    if (requireAll) {
      return permissionStrings.every((perm) => permissions.includes(perm));
    }

    return permissionStrings.some((perm) => permissions.includes(perm));
  };

  // RETURN
  return {
    permissionGuard,
    checkMultiplePermissions,
    hasPermission,
    hasPermissions,
  };
}
