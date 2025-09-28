import type { IPopupOption } from "@/types";
import { useState } from "react";

export default function usePopupOption() {
  const [popupOption, setPopupOption] = useState<IPopupOption>({
    open: false,
    closeOnDocumentClick: true,
    actionType: "create",
    form: "",
    data: null,
    title: "",
  });

  const createNewSubscriptionPlan = () => {
    setPopupOption({
      open: true,
      closeOnDocumentClick: true,
      actionType: "create",
      form: "SubscriptionPlanForm",
      data: null,
      title: "Create Subscription Plan",
    });
  };

  return { popupOption, setPopupOption, createNewSubscriptionPlan };
}
