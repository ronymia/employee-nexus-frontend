// components/SubscriptionPlanCard.tsx
import { useMemo } from "react";

interface SubscriptionPlanProps {
  plan: {
    id: string;
    name: string;
    description: string;
    price: number;
    setupFee: number;
    status: string; // e.g., 'ACTIVE', 'INACTIVE'
    createdAt: string; // ISO string
  };
  onUpgrade?: () => void;
  onCancel?: () => void;
}

export default function SubscriptionPlanCard({
  plan,
  onUpgrade,
  onCancel,
}: SubscriptionPlanProps) {
  const createdDate = useMemo(() => {
    const date = new Date(plan.createdAt);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }, [plan.createdAt]);

  const statusLabel = plan.status === "ACTIVE" ? "Active" : "Inactive";

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-md">
      {/* Badge and Status */}
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-semibold uppercase text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
          Current Plan
        </span>
        <span
          className={`text-xs font-semibold px-2 py-1 rounded-full ${
            plan.status === "ACTIVE"
              ? "text-green-700 bg-green-100"
              : "text-gray-600 bg-gray-200"
          }`}
        >
          {statusLabel}
        </span>
      </div>

      {/* Plan name and description */}
      <h3 className="text-2xl font-bold text-gray-800 mb-1">{plan.name}</h3>
      <p className="text-sm text-gray-500 mb-4">{plan.description}</p>

      {/* Pricing */}
      <div className="mb-4">
        <span className="text-3xl font-bold text-blue-600">${plan.price}</span>
        <span className="text-sm text-gray-500 ml-1"> / month</span>
        <div className="text-xs text-gray-500 mt-1">
          Setup fee: ${plan.setupFee}
        </div>
      </div>

      {/* Metadata */}
      <div className="text-xs text-gray-400 mb-4">Since {createdDate}</div>

      {/* Actions */}
      <div className="flex space-x-2">
        {onUpgrade && (
          <button
            onClick={onUpgrade}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm font-medium"
          >
            Upgrade Plan
          </button>
        )}
        {onCancel && (
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-md text-sm font-medium"
          >
            Cancel Plan
          </button>
        )}
      </div>
    </div>
  );
}
