"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface ResendOtpButtonProps {
  onResend: () => Promise<void>;
  initialCountdown?: number;
}

export default function ResendOtpButton({ onResend, initialCountdown = 30 }: ResendOtpButtonProps) {
  const [countdown, setCountdown] = useState(initialCountdown);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleResend = async () => {
    try {
      setLoading(true);
      await onResend();
      setCountdown(initialCountdown);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      type="button"
      variant="link"
      className="px-0"
      onClick={handleResend}
      disabled={countdown > 0 || loading}
    >
      {countdown > 0 ? `Resend OTP in ${countdown}s` : loading ? "Sending..." : "Resend OTP"}
    </Button>
  );
}

