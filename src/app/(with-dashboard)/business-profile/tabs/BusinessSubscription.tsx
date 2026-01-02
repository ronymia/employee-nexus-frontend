"use client";

import { useQuery } from "@apollo/client/react";
import { motion } from "motion/react";
import dayjs from "dayjs";
import { ACTIVE_BUSINESS_SUBSCRIPTION } from "@/graphql/business-subscription.api";
import { GET_SUBSCRIPTION_PLANS } from "@/graphql/subscription-plans.api";
import { IBusinessSubscription, ISubscriptionPlan } from "@/types";
import useAppStore from "@/stores/appStore";
import usePermissionGuard from "@/guards/usePermissionGuard";
import { Permissions } from "@/constants/permissions.constant";
import {
  MdCheckCircle,
  MdAccessTime,
  MdTrendingUp,
  MdInfo,
} from "react-icons/md";

// ==================== ANIMATION VARIANTS ====================
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
  },
};

// ==================== LOADING SKELETON SUB-COMPONENT ====================
function BusinessSubscriptionSkeleton() {
  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6 animate-pulse">
      {/* CURRENT SUBSCRIPTION SKELETON */}
      <div className="bg-gray-200 p-6 rounded-xl h-64"></div>

      {/* AVAILABLE PLANS SKELETON */}
      <div className="space-y-4">
        <div className="h-8 w-48 bg-gray-200 rounded"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-200 rounded-xl h-64"></div>
          ))}
        </div>
      </div>

      {/* HISTORY SKELETON */}
      <div className="space-y-4">
        <div className="h-8 w-56 bg-gray-200 rounded"></div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-200 rounded-lg h-32"></div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ==================== BUSINESS SUBSCRIPTION COMPONENT ====================
export default function BusinessSubscription() {
  // ==================== HOOKS ====================
  const { user } = useAppStore((state) => state);
  const { hasPermission } = usePermissionGuard();

  // FETCH ACTIVE SUBSCRIPTION
  const { data: subscriptionData, loading: subscriptionLoading } = useQuery<{
    activeBusinessSubscription: {
      data: IBusinessSubscription;
    };
  }>(ACTIVE_BUSINESS_SUBSCRIPTION, {
    variables: { businessId: user.businessId },
    skip: !user.businessId,
  });

  // FETCH ALL AVAILABLE PLANS
  const { data: plansData, loading: plansLoading } = useQuery<{
    subscriptionPlans: { data: ISubscriptionPlan[] };
  }>(GET_SUBSCRIPTION_PLANS, {
    skip: !hasPermission(Permissions.SubscriptionPlanRead),
  });

  // ==================== LOADING STATE ====================
  if (subscriptionLoading || plansLoading) {
    return <BusinessSubscriptionSkeleton />;
  }

  const activeSubscription = subscriptionData?.activeBusinessSubscription?.data;
  const currentPlan = activeSubscription?.subscriptionPlan;
  const allPlans = plansData?.subscriptionPlans?.data || [];

  const dummyHistoryData = {
    businessSubscriptions: {
      success: true,
      statusCode: 200,
      message: "Business subscriptions retrieved successfully",
      meta: {
        page: 1,
        limit: 5,
        skip: 0,
        total: 3,
        totalPages: 1,
      },
      data: [
        {
          id: 1,
          businessId: 1,
          subscriptionPlanId: 4,
          status: "COMPLETED",
          startDate: "2024-01-15T00:00:00.000Z",
          endDate: "2024-12-15T00:00:00.000Z",
          subscriptionPlan: {
            name: "Premium Plan",
            description: "Premium-level subscription with advanced features",
            price: 99,
            setupFee: 25,
          },
        },
        {
          id: 2,
          businessId: 1,
          subscriptionPlanId: 3,
          status: "COMPLETED",
          startDate: "2023-06-01T00:00:00.000Z",
          endDate: "2024-01-14T00:00:00.000Z",
          subscriptionPlan: {
            name: "Basic Plan",
            description: "Basic subscription for small businesses",
            price: 49,
            setupFee: 15,
          },
        },
        {
          id: 3,
          businessId: 1,
          subscriptionPlanId: 2,
          status: "COMPLETED",
          startDate: "2023-01-01T00:00:00.000Z",
          endDate: "2023-05-31T00:00:00.000Z",
          subscriptionPlan: {
            name: "Starter Plan",
            description: "Perfect for startups and new businesses",
            price: 29,
            setupFee: 10,
          },
        },
      ],
    },
  };
  const historyData = dummyHistoryData.businessSubscriptions.data;

  // ==================== RENDER ====================
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-6xl mx-auto p-4 md:p-6 space-y-6"
    >
      {/* CURRENT SUBSCRIPTION CARD */}
      <motion.div
        variants={itemVariants}
        className="bg-linear-to-br from-blue-50 to-indigo-50 p-6 rounded-xl shadow-lg border border-blue-100"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <MdCheckCircle className="text-2xl text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-base-content">
              Current Subscription
            </h2>
            <p className="text-sm text-base-content/60">
              Your active plan details
            </p>
          </div>
        </div>

        {currentPlan ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {/* PLAN NAME */}
            <div className="bg-white/60 backdrop-blur-sm p-4 rounded-lg">
              <label className="text-xs font-medium text-base-content/60 uppercase tracking-wide">
                Plan Name
              </label>
              <p className="text-lg font-bold text-base-content mt-1">
                {currentPlan.name}
              </p>
            </div>

            {/* PRICE */}
            <div className="bg-white/60 backdrop-blur-sm p-4 rounded-lg">
              <label className="text-xs font-medium text-base-content/60 uppercase tracking-wide">
                Price
              </label>
              <p className="text-lg font-bold text-success mt-1">
                ${currentPlan.price}/month
              </p>
            </div>

            {/* SETUP FEE */}
            <div className="bg-white/60 backdrop-blur-sm p-4 rounded-lg">
              <label className="text-xs font-medium text-base-content/60 uppercase tracking-wide">
                Setup Fee
              </label>
              <p className="text-lg font-bold text-base-content mt-1">
                ${currentPlan.setupFee}
              </p>
            </div>

            {/* START DATE */}
            {activeSubscription?.startDate && (
              <div className="bg-white/60 backdrop-blur-sm p-4 rounded-lg">
                <label className="text-xs font-medium text-base-content/60 uppercase tracking-wide flex items-center gap-1">
                  <MdAccessTime className="text-sm" />
                  Start Date
                </label>
                <p className="text-lg font-bold text-base-content mt-1">
                  {dayjs(activeSubscription.startDate).format("DD MMM YYYY")}
                </p>
              </div>
            )}

            {/* END DATE */}
            {activeSubscription?.endDate && (
              <div className="bg-white/60 backdrop-blur-sm p-4 rounded-lg">
                <label className="text-xs font-medium text-base-content/60 uppercase tracking-wide flex items-center gap-1">
                  <MdAccessTime className="text-sm" />
                  End Date
                </label>
                <p className="text-lg font-bold text-base-content mt-1">
                  {dayjs(activeSubscription.endDate).format("DD MMM YYYY")}
                </p>
              </div>
            )}

            {/* STATUS */}
            {activeSubscription?.status && (
              <div className="bg-white/60 backdrop-blur-sm p-4 rounded-lg">
                <label className="text-xs font-medium text-base-content/60 uppercase tracking-wide">
                  Status
                </label>
                <p className="text-lg font-bold mt-1">
                  <span
                    className={`badge ${
                      activeSubscription.status === "ACTIVE"
                        ? "badge-success"
                        : "badge-warning"
                    }`}
                  >
                    {activeSubscription.status}
                  </span>
                </p>
              </div>
            )}

            {/* DESCRIPTION */}
            <div className="md:col-span-2 lg:col-span-3 bg-white/60 backdrop-blur-sm p-4 rounded-lg">
              <label className="text-xs font-medium text-base-content/60 uppercase tracking-wide">
                Description
              </label>
              <p className="text-base text-base-content/80 mt-1">
                {currentPlan.description}
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white/60 backdrop-blur-sm p-6 rounded-lg text-center"
          >
            <MdInfo className="text-4xl text-warning mx-auto mb-3" />
            <p className="text-lg text-base-content/70">
              No active subscription found
            </p>
            <p className="text-sm text-base-content/50 mt-2">
              Choose a plan below to get started
            </p>
          </motion.div>
        )}
      </motion.div>

      {/* AVAILABLE PLANS */}
      {hasPermission(Permissions.SubscriptionPlanRead) && (
        <motion.div variants={itemVariants}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
              <MdTrendingUp className="text-2xl text-success" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-base-content">
                Available Plans
              </h2>
              <p className="text-sm text-base-content/60">
                Choose the perfect plan for your business
              </p>
            </div>
          </div>

          {allPlans.length > 0 ? (
            <motion.div
              variants={containerVariants}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {allPlans.map((plan) => {
                const isCurrentPlan = currentPlan?.id === plan.id;
                const isUpgrade = currentPlan && plan.price > currentPlan.price;

                return (
                  <motion.div
                    key={plan.id}
                    variants={itemVariants}
                    whileHover={{ scale: 1.02, y: -4 }}
                    className={`relative bg-linear-to-br from-white to-gray-50 rounded-xl shadow-md border-2 overflow-hidden transition-all ${
                      isCurrentPlan
                        ? "border-primary shadow-lg"
                        : "border-gray-200 hover:border-primary/50"
                    }`}
                  >
                    {/* CURRENT PLAN BADGE */}
                    {isCurrentPlan && (
                      <div className="absolute top-0 right-0">
                        <div className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                          Current
                        </div>
                      </div>
                    )}

                    <div className="p-6">
                      {/* PLAN NAME */}
                      <h3 className="text-xl font-bold text-base-content mb-2">
                        {plan.name}
                      </h3>

                      {/* DESCRIPTION */}
                      <p className="text-sm text-base-content/70 mb-4 line-clamp-2">
                        {plan.description}
                      </p>

                      {/* PRICE */}
                      <div className="mb-4">
                        <div className="flex items-baseline gap-1">
                          <span className="text-4xl font-bold text-base-content">
                            ${plan.price}
                          </span>
                          <span className="text-sm text-base-content/60">
                            /month
                          </span>
                        </div>
                        <div className="text-xs text-base-content/60 mt-1">
                          Setup fee: ${plan.setupFee}
                        </div>
                      </div>

                      {/* DIVIDER */}
                      <div className="h-px bg-gray-200 my-4" />

                      {/* ACTION BUTTON */}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={isCurrentPlan}
                        className={`btn btn-sm w-full ${
                          isCurrentPlan
                            ? "btn-disabled"
                            : isUpgrade
                            ? "btn-success"
                            : "btn-primary"
                        }`}
                      >
                        {isCurrentPlan
                          ? "Current Plan"
                          : isUpgrade
                          ? "Upgrade"
                          : "Switch Plan"}
                      </motion.button>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white p-8 rounded-xl text-center border border-gray-200"
            >
              <MdInfo className="text-4xl text-base-content/30 mx-auto mb-3" />
              <p className="text-base-content/70">
                No plans available at the moment
              </p>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* SUBSCRIPTION HISTORY */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-warning/10 flex items-center justify-center">
            <MdAccessTime className="text-2xl text-warning" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-base-content">
              Subscription History
            </h2>
            <p className="text-sm text-base-content/60">
              View your past subscriptions and renewals
            </p>
          </div>
        </div>

        {/* DUMMY DATA - MATCHING API RESPONSE STRUCTURE */}
        {historyData.length > 0 ? (
          <motion.div variants={containerVariants} className="space-y-4">
            {/* Timeline Items */}
            {historyData.map((subscription, index) => (
              <motion.div
                key={subscription.id}
                variants={itemVariants}
                whileHover={{ x: 4 }}
                className="relative bg-linear-to-br from-white to-gray-50 p-5 rounded-lg border border-gray-200 hover:border-gray-300 transition-all shadow-sm hover:shadow-md"
              >
                {/* Timeline connector */}
                {index !== historyData.length - 1 && (
                  <div className="absolute left-8 top-full w-0.5 h-4 bg-gray-300" />
                )}

                <div className="flex items-start gap-4">
                  {/* Timeline dot */}
                  <div className="shrink-0 mt-1">
                    <div className="w-6 h-6 rounded-full bg-success border-4 border-white shadow-md" />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                      <div>
                        <h3 className="text-lg font-bold text-base-content">
                          {subscription.subscriptionPlan.name}
                        </h3>
                        <p className="text-sm text-base-content/60">
                          {dayjs(subscription.startDate).format("DD MMM YYYY")}{" "}
                          - {dayjs(subscription.endDate).format("DD MMM YYYY")}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-lg font-bold text-success">
                          ${subscription.subscriptionPlan.price}/mo
                        </div>
                        <span className="badge badge-success badge-sm">
                          {subscription.status}
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-base-content/70 mb-2">
                      {subscription.subscriptionPlan.description}
                    </p>

                    {/* Additional Info */}
                    <div className="flex flex-wrap items-center gap-4 text-xs text-base-content/60">
                      <div className="flex items-center gap-1">
                        <MdAccessTime className="text-sm" />
                        <span>
                          Duration:{" "}
                          {dayjs(subscription.endDate).diff(
                            dayjs(subscription.startDate),
                            "month"
                          )}{" "}
                          months
                        </span>
                      </div>
                      <div>
                        Setup Fee: ${subscription.subscriptionPlan.setupFee}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white p-8 rounded-xl text-center border border-gray-200"
          >
            <MdInfo className="text-4xl text-base-content/30 mx-auto mb-3" />
            <p className="text-base-content/70">
              No subscription history available
            </p>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
