import type React from "react";
import { motion } from "motion/react";

interface ICustomButtonProps {
  htmlType?: "button" | "submit" | "reset";
  className?: string;
  clickHandler?: () => void;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  disabled?: boolean;
  isLoading?: boolean;
  buttonType?:
    | "soft"
    | "ghost"
    | "active"
    | "disabled"
    | "outline"
    | "dash"
    | "link";
}

export default function CustomButton({
  children,
  htmlType = "button",
  className = ``,
  clickHandler = () => {},
  // variant = "primary",
  buttonType,
  disabled = false,
  isLoading = false,
}: ICustomButtonProps) {
  return (
    <button
      type={htmlType}
      onClick={clickHandler}
      disabled={disabled}
      className={`btn btn-primary ${buttonType ? `btn-${buttonType}` : ""} ${
        className ?? ""
      } ${
        isLoading
          ? "bg-primary-content flex items-center justify-center border-none cursor-pointer"
          : ""
      } `}
    >
      {isLoading ? (
        <motion.span
          animate={{ rotate: 360 }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: 1.5,
          }}
          className="button_loader"
        ></motion.span>
      ) : (
        children
      )}
    </button>
  );
}
