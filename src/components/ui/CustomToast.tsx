import toast, { Toast } from "react-hot-toast";
import {
  PiCheckCircleFill,
  PiWarningCircleFill,
  PiXCircleFill,
  PiInfoFill,
  PiX,
} from "react-icons/pi";
import { motion, AnimatePresence } from "motion/react";

type ToastType = "success" | "error" | "warning" | "info";

interface CustomToastProps {
  t: Toast;
  type: ToastType;
  message: string;
  description?: string;
}

const ToastIcon = ({ type }: { type: ToastType }) => {
  switch (type) {
    case "success":
      return <PiCheckCircleFill className="text-2xl text-green-500" />;
    case "error":
      return <PiXCircleFill className="text-2xl text-red-500" />;
    case "warning":
      return <PiWarningCircleFill className="text-2xl text-yellow-500" />;
    case "info":
      return <PiInfoFill className="text-2xl text-blue-500" />;
  }
};

const ToastBorderColor = (type: ToastType) => {
  switch (type) {
    case "success":
      return "border-green-500";
    case "error":
      return "border-red-500";
    case "warning":
      return "border-yellow-500";
    case "info":
      return "border-blue-500";
    default:
      return "border-gray-200";
  }
};

const CustomToast = ({ t, type, message, description }: CustomToastProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.9 }}
      animate={{
        opacity: t.visible ? 1 : 0,
        y: t.visible ? 0 : -20,
        scale: t.visible ? 1 : 0.9,
      }}
      exit={{ opacity: 0, y: -20, scale: 0.9 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={`max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-primary-content ring-opacity-5 border-l-4 ${ToastBorderColor(
        type
      )}`}
    >
      <div className="flex-1 w-0 p-4">
        <div className="flex items-start">
          <div className="shrink-0 pt-0.5">
            <ToastIcon type={type} />
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-gray-900">{message}</p>
            {description && (
              <p className="mt-1 text-sm text-gray-500">{description}</p>
            )}
          </div>
        </div>
      </div>
      <div className="flex border-l border-gray-200">
        <button
          onClick={() => toast.dismiss(t.id)}
          className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-gray-600 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <PiX className="text-lg" />
        </button>
      </div>
    </motion.div>
  );
};

export const showToast = {
  success: (message: string, description?: string) =>
    toast.custom((t) => (
      <CustomToast
        t={t}
        type="success"
        message={message}
        description={description}
      />
    )),
  error: (message: string, description?: string) =>
    toast.custom((t) => (
      <CustomToast
        t={t}
        type="error"
        message={message}
        description={description}
      />
    )),
  warning: (message: string, description?: string) =>
    toast.custom((t) => (
      <CustomToast
        t={t}
        type="warning"
        message={message}
        description={description}
      />
    )),
  info: (message: string, description?: string) =>
    toast.custom((t) => (
      <CustomToast
        t={t}
        type="info"
        message={message}
        description={description}
      />
    )),
};

export default CustomToast;
