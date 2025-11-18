"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import api from "@/lib/api";
import { toast } from "@/components/ui/toaster";
import OTPInput from "@/components/auth/OTPInput";
import ResendOtpButton from "@/components/auth/ResendOtpButton";
import GoogleSignInButton from "@/components/auth/GoogleSignInButton";
import { useAuthStore } from "@/lib/store";

type ViewState = "form" | "otp";

export default function RegisterPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [view, setView] = useState<ViewState>("form");
  const [loading, setLoading] = useState(false);
  const [pendingUser, setPendingUser] = useState<{ userId: string; email: string } | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const res = await api.post("/auth/signup", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      setPendingUser({ userId: res.data.userId, email: formData.email });
      setView("otp");
      toast({
        title: "OTP Sent",
        description: "Enter the 6-digit code we emailed to you.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Registration failed",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (otp: string) => {
    if (!pendingUser) return;
    try {
      setLoading(true);
      const res = await api.post("/auth/verify-otp", {
        userId: pendingUser.userId,
        otp,
      });
      setAuth(res.data.user, res.data.token);
      toast({ title: "Account verified!", description: "Welcome to DreamNex" });
      router.push("/dashboard");
    } catch (error: any) {
      toast({
        title: "Verification failed",
        description: error.response?.data?.message || "Invalid or expired OTP",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!pendingUser) return;
    await api.post("/auth/resend-otp", { userId: pendingUser.userId });
    toast({ title: "OTP resent", description: "Check your inbox for the new code." });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary/20 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Create Account</CardTitle>
          <CardDescription>Sign up to start building with AI</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {view === "form" && (
            <>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    minLength={6}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({ ...formData, confirmPassword: e.target.value })
                    }
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Creating account..." : "Sign Up"}
                </Button>
              </form>
              <div className="flex items-center gap-2">
                <div className="h-px flex-1 bg-muted" />
                <span className="text-xs uppercase tracking-wide text-muted-foreground">or</span>
                <div className="h-px flex-1 bg-muted" />
              </div>
              <GoogleSignInButton />
            </>
          )}

          {view === "otp" && pendingUser && (
            <div className="space-y-4">
              <div className="text-center space-y-2">
                <h3 className="text-xl font-semibold">Verify your email</h3>
                <p className="text-sm text-muted-foreground">
                  Enter the 6-digit code we sent to <span className="font-medium">{pendingUser.email}</span>
                </p>
              </div>
              <OTPInput onComplete={handleVerify} disabled={loading} />
              <div className="text-center">
                <ResendOtpButton onResend={handleResend} />
              </div>
              <Button variant="ghost" className="w-full" onClick={() => setView("form")}>
                Go back
              </Button>
            </div>
          )}

          <div className="text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

