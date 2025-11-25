"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/toaster";
import api from "@/lib/api";
import { useAuthStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { ButtonProps } from "@/components/ui/button";
import { Chrome } from "lucide-react";

const GOOGLE_SCRIPT_ID = "google-identity-script";

interface GoogleSignInButtonProps extends Omit<ButtonProps, 'onClick'> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export default function GoogleSignInButton({ 
  variant = "outline", 
  size = "default",
  className = "",
  ...props 
}: GoogleSignInButtonProps) {
  const buttonRef = useRef<HTMLDivElement | null>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [manualLoading, setManualLoading] = useState(false);
  const { setAuth } = useAuthStore();
  const router = useRouter();

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  useEffect(() => {
    if (!clientId) {
      console.warn("Missing NEXT_PUBLIC_GOOGLE_CLIENT_ID");
      return;
    }

    const initialize = () => {
      if (!window.google || !buttonRef.current) return;
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredentialResponse,
      });
      const buttonTheme = variant === "outline" ? "outline" : "filled_blue";
      const buttonSize = size === "lg" ? "large" : size === "sm" ? "small" : "medium";
      
      window.google.accounts.id.renderButton(buttonRef.current, {
        theme: buttonTheme,
        size: buttonSize,
        width: "100%",
        text: "signin_with",
      });
      window.google.accounts.id.prompt();
      setScriptLoaded(true);
    };

    if (document.getElementById(GOOGLE_SCRIPT_ID)) {
      initialize();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.id = GOOGLE_SCRIPT_ID;
    script.onload = initialize;
    document.body.appendChild(script);

    return () => {
      script.onload = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientId]);

  const handleCredentialResponse = async (response: { credential: string }) => {
    if (!response.credential) {
      toast({
        title: "Google Sign-In failed",
        description: "Could not retrieve credential token",
        variant: "destructive",
      });
      return;
    }
    try {
      setManualLoading(true);
      const res = await api.post("/auth/google", { idToken: response.credential });
      setAuth(res.data.user, res.data.token);
      toast({ title: "Welcome back!", description: "Signed in with Google" });
      router.push("/dashboard");
    } catch (error: any) {
      toast({
        title: "Google Sign-In failed",
        description: error.response?.data?.message || "Unable to authenticate with Google",
        variant: "destructive",
      });
    } finally {
      setManualLoading(false);
    }
  };

  const handleManualClick = () => {
    if (!scriptLoaded) return;
    if (window.google?.accounts.id) {
      window.google.accounts.id.prompt();
    }
  };

  if (!clientId) {
    return null;
  }

  return (
    <div className={`w-full ${className}`}>
      <div ref={buttonRef} className="w-full flex justify-center" />
      {!scriptLoaded && (
        <Button
          type="button"
          className={`w-full ${className}`}
          variant={variant}
          size={size}
          onClick={handleManualClick}
          disabled={manualLoading}
          {...props}
        >
          <Chrome className="mr-2 h-4 w-4" />
          {manualLoading ? "Signing in..." : "Continue with Google"}
        </Button>
      )}
    </div>
  );
}

