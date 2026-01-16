"use client";

import SubscriptionStatusBadge from "@/components/ui/SubscriptionStatusBadge";
import {
  BusinessSubscriptionStatus,
  SUBSCRIPTION_STATUS_METADATA,
} from "@/types/enums/subscription-status.enum";
import { motion } from "motion/react";

// ==================== COMPONENT ====================
export default function SubscriptionStatusDemo() {
  // ==================== RENDER ====================
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-8">
      <div className="mx-auto max-w-6xl">
        {/* PAGE HEADER */}
        <motion.header
          className="mb-12 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="mb-3 text-4xl font-bold text-gray-900">
            Business Subscription Status
          </h1>
          <p className="text-lg text-gray-600">
            Visual representation of all subscription statuses
          </p>
        </motion.header>

        {/* STATUS GRID */}
        <motion.div
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, staggerChildren: 0.1 }}
        >
          {Object.values(BusinessSubscriptionStatus).map((status, index) => {
            const metadata = SUBSCRIPTION_STATUS_METADATA[status];

            return (
              <motion.div
                key={status}
                className="rounded-2xl bg-white p-6 shadow-lg transition-shadow hover:shadow-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {/* STATUS BADGE */}
                <div className="mb-4 flex items-center justify-between">
                  <SubscriptionStatusBadge
                    key={status}
                    status={status}
                    onClick={() => {}}
                  />
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      metadata.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {metadata.isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                {/* STATUS INFO */}
                <div className="space-y-3">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500">
                      Value
                    </h3>
                    <p className="font-mono text-sm text-gray-900">
                      {metadata.value}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-gray-500">
                      Description
                    </h3>
                    <p className="text-sm text-gray-700">
                      {metadata.description}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-gray-500">
                      Priority
                    </h3>
                    <div className="flex items-center gap-2">
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-200">
                        <div
                          className="h-full bg-linear-to-r from-blue-500 to-purple-500"
                          style={{
                            width: `${(metadata.priority / 6) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        {metadata.priority}/6
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* USAGE EXAMPLE */}
        <motion.section
          className="mt-12 rounded-2xl bg-white p-8 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="mb-4 text-2xl font-bold text-gray-900">
            Usage Example
          </h2>
          <div className="space-y-4">
            <div className="rounded-lg bg-gray-50 p-4">
              <h3 className="mb-2 text-sm font-semibold text-gray-700">
                Component Usage
              </h3>
              <pre className="overflow-x-auto text-sm text-gray-800">
                {`<SubscriptionStatusBadge 
  status={subscription.status} 
  onClick={() => handleStatusClick()} 
/>`}
              </pre>
            </div>

            <div className="rounded-lg bg-gray-50 p-4">
              <h3 className="mb-2 text-sm font-semibold text-gray-700">
                All Statuses in Row
              </h3>
              <div className="flex flex-wrap gap-3">
                {Object.values(BusinessSubscriptionStatus).map((status) => (
                  <SubscriptionStatusBadge
                    key={status}
                    status={status}
                    onClick={() => {}}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        {/* STATUS LEGEND */}
        <motion.section
          className="mt-8 rounded-2xl bg-linear-to-br from-blue-50 to-purple-50 p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="mb-6 text-2xl font-bold text-gray-900">
            Status Legend
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg bg-white p-4 shadow">
              <h3 className="mb-3 font-semibold text-green-700">
                Active Statuses
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="shrink-0 font-semibold">•</span>
                  <span>
                    <strong>TRIAL:</strong> Customer is in trial period
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="shrink-0 font-semibold">•</span>
                  <span>
                    <strong>ACTIVE:</strong> Subscription is active and paid
                  </span>
                </li>
              </ul>
            </div>

            <div className="rounded-lg bg-white p-4 shadow">
              <h3 className="mb-3 font-semibold text-red-700">
                Inactive Statuses
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="shrink-0 font-semibold">•</span>
                  <span>
                    <strong>PENDING:</strong> Awaiting activation
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="shrink-0 font-semibold">•</span>
                  <span>
                    <strong>CANCELLED:</strong> Manually cancelled
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="shrink-0 font-semibold">•</span>
                  <span>
                    <strong>EXPIRED:</strong> Subscription has ended
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="shrink-0 font-semibold">•</span>
                  <span>
                    <strong>SUSPENDED:</strong> Temporarily suspended
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
