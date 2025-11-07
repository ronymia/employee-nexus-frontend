import SubscriptionPlanCard from "@/components/ui/subscription/SubscriptionCard";
import React from "react";

export default function BusinessSubscription() {
  return (
    <div>
      <SubscriptionPlanCard
        plan={{
          id: 1,
          name: "Basic plan",
          description: "Basic plan for small businesses",
          price: "$50",
          setupFee: "$10",
          status: "ACTIVE", // e.g., 'ACTIVE', 'INACTIVE'
          createdAt: "2023-01-01T00:00:00.000Z", // ISO string
        }}
      />
    </div>
  );
}
