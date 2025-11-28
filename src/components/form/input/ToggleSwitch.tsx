"use client";

import { Controller, useFormContext } from "react-hook-form";
import { motion } from "motion/react";

interface IToggleSwitchProps {
  name: string;
  label?: string;
  disabled?: boolean;
  onChange?: (value: boolean) => void;
}

export default function ToggleSwitch({
  name,
  label,
  disabled = false,
  onChange,
}: IToggleSwitchProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const isOn = field.value || false;

        const handleToggle = () => {
          if (!disabled) {
            const newValue = !isOn;
            field.onChange(newValue);
            onChange?.(newValue);
          }
        };

        return (
          <div className="flex items-center gap-x-3">
            <button
              type="button"
              role="switch"
              aria-checked={isOn}
              disabled={disabled}
              onClick={handleToggle}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                isOn ? "bg-primary" : "bg-gray-300"
              } ${
                disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
              }`}
            >
              <motion.div
                className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-md"
                animate={{
                  x: isOn ? 24 : 0,
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 25,
                }}
              />
            </button>
            {label && (
              <span className="text-sm font-medium text-gray-700">{label}</span>
            )}
          </div>
        );
      }}
    />
  );
}
