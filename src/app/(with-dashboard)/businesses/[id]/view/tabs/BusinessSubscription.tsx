"use client";

import { motion } from "motion/react";
import { useQuery } from "@apollo/client/react";
import dayjs from "dayjs";
import {
  MdCheckCircle,
  MdHistory,
  MdAttachMoney,
  MdCalendarToday,
  MdTrendingUp,
} from "react-icons/md";
import { BsCheckCircleFill, BsClock } from "react-icons/bs";

import { GET_BUSINESS_SUBSCRIPTIONS } from "@/graphql/business-subscription.api";
import { BusinessSubscriptionStatus } from "@/types/enums/subscription-status.enum";
import SubscriptionStatusBadge from "@/components/ui/SubscriptionStatusBadge";
import { IBusinessSubscription } from "@/types";

dayjs.extend(require("dayjs/plugin/relativeTime"));
dayjs.extend(require("dayjs/plugin/advancedFormat"));

// ==================== INTERFACES ====================
interface IBusinessSubscriptionProps {
  businessId: number;
}

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

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
  },
};

// ==================== LOADING SKELETON SUB-COMPONENT ====================
function SubscriptionSkeleton() {
  return (
    <div className="max-w-6xl mx-auto md:p-4 space-y-6">
      {/* ACTIVE SUBSCRIPTION SKELETON */}
      <div className="bg-linear-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
        <div className="h-6 w-48 bg-gray-300 rounded animate-pulse mb-4" />
        <div className="h-32 bg-white/60 rounded-lg animate-pulse" />
      </div>

      {/* HISTORY SKELETON */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <div className="h-6 w-40 bg-gray-300 rounded animate-pulse mb-4" />
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-20 bg-gray-100 rounded-lg animate-pulse"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ==================== MAIN COMPONENT ====================
export default function BusinessSubscription({
  businessId,
}: IBusinessSubscriptionProps) {
  // ==================== QUERIES ====================
  const { data, loading } = useQuery<{
    businessSubscriptions: {
      data: IBusinessSubscription[];
    };
  }>(GET_BUSINESS_SUBSCRIPTIONS, {
    variables: {
      query: {
        businessId,
      },
    },
    skip: !businessId,
  });

  // ==================== COMPUTED VALUES ====================
  const subscriptions = data?.businessSubscriptions?.data || [];
  const activeSubscription = subscriptions.find(
    (sub: any) => sub.status === "ACTIVE" || sub.status === "TRIAL"
  );
  const subscriptionHistory = subscriptions.filter(
    (sub: any) => sub.status !== "ACTIVE" && sub.status !== "TRIAL"
  );

  // ==================== LOADING STATE ====================
  if (loading) {
    return <SubscriptionSkeleton />;
  }

  // ==================== RENDER ====================
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-6xl mx-auto md:p-4 space-y-6"
    >
      {/* ACTIVE SUBSCRIPTION SECTION */}
      <motion.section
        variants={cardVariants}
        className="bg-linear-to-br from-blue-50 to-indigo-50 p-6 rounded-xl shadow-lg border border-blue-100"
      >
        {/* HEADER */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <BsCheckCircleFill className="text-2xl text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-base-content">
              Active Subscription
            </h2>
            <p className="text-sm text-base-content/60">
              Current subscription plan and details
            </p>
          </div>
        </div>

        {activeSubscription ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 border border-blue-200 shadow-md"
          >
            {/* PLAN HEADER */}
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-2xl font-bold text-base-content">
                    {activeSubscription.subscriptionPlan.name} Plan
                  </h3>
                  <SubscriptionStatusBadge
                    status={
                      activeSubscription.status as BusinessSubscriptionStatus
                    }
                  />
                </div>
                <p className="text-base-content/70">
                  {activeSubscription.subscriptionPlan.description}
                </p>
              </div>
              <div className="text-right">
                <div className="flex items-baseline gap-1 justify-end">
                  <span className="text-3xl font-bold text-primary">
                    ${activeSubscription.subscriptionPlan.price}
                  </span>
                  <span className="text-base-content/60">/month</span>
                </div>
                {activeSubscription.subscriptionPlan.setupFee > 0 && (
                  <p className="text-sm text-base-content/60 mt-1">
                    + ${activeSubscription.subscriptionPlan.setupFee} setup fee
                  </p>
                )}
              </div>
            </div>

            <div className="divider my-4" />

            {/* SUBSCRIPTION DETAILS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* START DATE */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-linear-to-br from-green-50 to-emerald-50 p-4 rounded-lg border border-green-100"
              >
                <div className="flex items-center gap-2 mb-2">
                  <MdCheckCircle className="text-lg text-success" />
                  <span className="text-sm font-medium text-base-content/60">
                    Started
                  </span>
                </div>
                <p className="text-lg font-bold text-base-content">
                  {dayjs(activeSubscription.startDate).format("MMM DD, YYYY")}
                </p>
                <p className="text-xs text-base-content/60 mt-1">
                  {dayjs(activeSubscription.startDate).fromNow()}
                </p>
              </motion.div>

              {/* END DATE */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-linear-to-br from-orange-50 to-amber-50 p-4 rounded-lg border border-orange-100"
              >
                <div className="flex items-center gap-2 mb-2">
                  <MdCalendarToday className="text-lg text-warning" />
                  <span className="text-sm font-medium text-base-content/60">
                    Expires
                  </span>
                </div>
                <p className="text-lg font-bold text-base-content">
                  {dayjs(activeSubscription.endDate).format("MMM DD, YYYY")}
                </p>
                <p className="text-xs text-base-content/60 mt-1">
                  {dayjs(activeSubscription.endDate).fromNow()}
                </p>
              </motion.div>

              {/* TRIAL END DATE (if exists) */}
              {activeSubscription.trialEndDate ? (
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-linear-to-br from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-100"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <BsClock className="text-lg text-secondary" />
                    <span className="text-sm font-medium text-base-content/60">
                      Trial Ends
                    </span>
                  </div>
                  <p className="text-lg font-bold text-base-content">
                    {dayjs(activeSubscription.trialEndDate).format(
                      "MMM DD, YYYY"
                    )}
                  </p>
                  <p className="text-xs text-base-content/60 mt-1">
                    {dayjs(activeSubscription.trialEndDate).fromNow()}
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-linear-to-br from-blue-50 to-cyan-50 p-4 rounded-lg border border-blue-100"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <MdAttachMoney className="text-lg text-info" />
                    <span className="text-sm font-medium text-base-content/60">
                      Total Cost
                    </span>
                  </div>
                  <p className="text-lg font-bold text-base-content">
                    $
                    {activeSubscription.subscriptionPlan.price +
                      activeSubscription.subscriptionPlan.setupFee}
                  </p>
                  <p className="text-xs text-base-content/60 mt-1">
                    First month total
                  </p>
                </motion.div>
              )}
            </div>

            {/* SUBSCRIPTION ID & DATES */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-base-content/60">Subscription ID:</span>
                  <span className="ml-2 font-mono font-semibold">
                    #{activeSubscription.id}
                  </span>
                </div>
                <div>
                  <span className="text-base-content/60">Plan ID:</span>
                  <span className="ml-2 font-mono font-semibold">
                    #{activeSubscription.subscriptionPlan.id}
                  </span>
                </div>
                <div>
                  <span className="text-base-content/60">Created:</span>
                  <span className="ml-2 font-semibold">
                    {dayjs(activeSubscription.createdAt).format("lll")}
                  </span>
                </div>
                <div>
                  <span className="text-base-content/60">Last Updated:</span>
                  <span className="ml-2 font-semibold">
                    {dayjs(activeSubscription.updatedAt).format("lll")}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="bg-white rounded-xl p-12 text-center border border-dashed border-gray-300">
            <MdTrendingUp className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-base-content/60 mb-2">
              No Active Subscription
            </h3>
            <p className="text-base-content/50">
              This business does not have an active subscription plan.
            </p>
          </div>
        )}
      </motion.section>

      {/* SUBSCRIPTION HISTORY SECTION */}
      <motion.section
        variants={cardVariants}
        className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
      >
        {/* HEADER */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
            <MdHistory className="text-2xl text-gray-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-base-content">
              Subscription History
            </h2>
            <p className="text-sm text-base-content/60">
              Past and inactive subscriptions
            </p>
          </div>
        </div>

        {subscriptionHistory.length > 0 ? (
          <div className="space-y-3">
            {subscriptionHistory.map((subscription: any) => (
              <motion.div
                key={subscription.id}
                whileHover={{ scale: 1.01, x: 4 }}
                className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-primary/50 transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  {/* PLAN INFO */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-base-content">
                        {subscription.subscriptionPlan.name} Plan
                      </h4>
                      <SubscriptionStatusBadge
                        status={
                          subscription.status as BusinessSubscriptionStatus
                        }
                      />
                    </div>
                    <p className="text-sm text-base-content/60">
                      {subscription.subscriptionPlan.description}
                    </p>
                  </div>

                  {/* DATE RANGE */}
                  <div className="flex items-center gap-4 text-sm">
                    <div>
                      <span className="text-base-content/60">Period:</span>
                      <span className="ml-2 font-semibold">
                        {dayjs(subscription.startDate).format("MMM DD, YYYY")} -{" "}
                        {dayjs(subscription.endDate).format("MMM DD, YYYY")}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-base-content">
                        ${subscription.subscriptionPlan.price}
                      </div>
                      <div className="text-xs text-base-content/60">/month</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-xl p-12 text-center border border-dashed border-gray-300">
            <MdHistory className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-base-content/60 mb-2">
              No History Available
            </h3>
            <p className="text-base-content/50">
              No previous or inactive subscriptions found.
            </p>
          </div>
        )}
      </motion.section>
    </motion.div>
  );
}
