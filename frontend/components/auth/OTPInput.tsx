"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface OTPInputProps {
  length?: number;
  onComplete: (otp: string) => void;
  disabled?: boolean;
}

export default function OTPInput({ length = 6, onComplete, disabled }: OTPInputProps) {
  const [values, setValues] = useState<string[]>(Array(length).fill(""));
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newValues = [...values];
    newValues[index] = value.slice(-1);
    setValues(newValues);

    if (value && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }

    const otp = newValues.join("");
    if (otp.length === length && !newValues.includes("")) {
      onComplete(otp);
    }
  };

  const handleKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace" && !values[index] && index > 0) {
      const newValues = [...values];
      newValues[index - 1] = "";
      setValues(newValues);
      inputsRef.current[index - 1]?.focus();
    }
  };

  return (
    <div className="flex gap-2 justify-center">
      {values.map((value, index) => (
        <input
          key={index}
          ref={(el) => {
            inputsRef.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value}
          disabled={disabled}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          className={cn(
            "w-12 h-12 text-center text-xl font-semibold border rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        />
      ))}
    </div>
  );
}

