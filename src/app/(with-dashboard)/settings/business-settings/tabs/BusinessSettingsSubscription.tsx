"use client";
import { GET_BUSINESS_BY_ID } from "@/graphql/business.api";
import { GET_SUBSCRIPTION_PLANS } from "@/graphql/subscription-plans.api";
import useAppStore from "@/stores/appStore";
import { IBusiness, ISubscriptionPlan } from "@/types";
import { useQuery } from "@apollo/client/react";
import CustomLoading from "@/components/loader/CustomLoading";
import dayjs from "dayjs";
import usePermissionGuard from "@/guards/usePermissionGuard";
import { Permissions } from "@/constants/permissions.constant";

export default function BusinessSettingsSubscription({
  subscriptionPlan,
}: {
  subscriptionPlan: ISubscriptionPlan;
}) {
  const { user } = useAppStore((state) => state);
  const { hasPermission } = usePermissionGuard();

  const { data: businessData, loading: businessLoading } = useQuery<{
    businessById: IBusiness;
  }>(GET_BUSINESS_BY_ID, {
    variables: { id: user.businessId },
    skip: !user.businessId,
  });

  const { data: plansData, loading: plansLoading } = useQuery<{
    subscriptionPlans: { data: ISubscriptionPlan[] };
  }>(GET_SUBSCRIPTION_PLANS);

  if (businessLoading || plansLoading) {
    return <CustomLoading />;
  }

  const currentPlan = subscriptionPlan;
  const allPlans = plansData?.subscriptionPlans?.data || [];

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Current Subscription */}
      <div className="bg-base-300 p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold text-green-950 mb-4">
          Current Subscription
        </h2>
        {currentPlan ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-base-content/70">
                Plan Name
              </label>
              <p className="text-lg font-semibold">{currentPlan.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-base-content/70">
                Price
              </label>
              <p className="text-lg font-semibold">${currentPlan.price}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-base-content/70">
                Status
              </label>
              <p className="text-lg font-semibold">
                <span
                  className={`badge ${
                    currentPlan.status === "ACTIVE"
                      ? "badge-success"
                      : "badge-error"
                  }`}
                >
                  {currentPlan.status}
                </span>
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-base-content/70">
                Setup Fee
              </label>
              <p className="text-lg font-semibold">${currentPlan.setupFee}</p>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-base-content/70">
                Description
              </label>
              <p className="text-base">{currentPlan.description}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-base-content/70">
                Subscribed Since
              </label>
              <p className="text-base">
                {dayjs(businessData?.businessById?.createdAt).format(
                  "DD MMM YYYY"
                )}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-base-content/70">No active subscription found.</p>
        )}
      </div>

      {/* Available Plans */}
      {hasPermission(Permissions.SubscriptionPlanRead) && (
        <div>
          <h2 className="text-2xl font-bold text-green-950 mb-4">
            Available Plans
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allPlans.map((plan) => (
              <div
                key={plan.id}
                className={`card bg-base-200 shadow-lg border-2 ${
                  currentPlan?.id === plan.id
                    ? "border-primary"
                    : "border-transparent"
                }`}
              >
                <div className="card-body">
                  <h3 className="card-title">
                    {plan.name}
                    {currentPlan?.id === plan.id && (
                      <span className="badge badge-primary badge-sm">
                        Current
                      </span>
                    )}
                  </h3>
                  <p className="text-base-content/70 text-sm">
                    {plan.description}
                  </p>
                  <div className="mt-4">
                    <div className="text-3xl font-bold">
                      ${plan.price}
                      {/* <span className="text-sm font-normal text-base-content/70">
                        /{plan.billingCycle}
                      </span> */}
                    </div>
                    <div className="text-sm text-base-content/70 mt-1">
                      Setup fee: ${plan.setupFee}
                    </div>
                  </div>

                  {/* Features */}
                  {/* {plan.features && plan.features.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {plan.features
                        .slice(0, 5)
                        .map((feature: any, idx: number) => (
                          <div
                            key={idx}
                            className="flex items-start gap-2 text-sm"
                          >
                            <PiCheckCircle className="text-success mt-0.5 flex-shrink-0" />
                            <span>{feature.name || feature}</span>
                          </div>
                        ))}
                    </div>
                  )} */}

                  <div className="card-actions justify-end mt-4">
                    {currentPlan?.id === plan.id ? (
                      <button className="btn btn-sm btn-disabled">
                        Current Plan
                      </button>
                    ) : (
                      <button className="btn btn-sm btn-primary">
                        {currentPlan && plan.price > currentPlan.price
                          ? "Upgrade"
                          : "Switch"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
