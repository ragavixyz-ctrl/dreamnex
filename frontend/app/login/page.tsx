"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/lib/store";
import api from "@/lib/api";
import { toast } from "@/components/ui/toaster";
import GoogleSignInButton from "@/components/auth/GoogleSignInButton";
import ResendOtpButton from "@/components/auth/ResendOtpButton";

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [needVerification, setNeedVerification] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setNeedVerification(null);

    try {
      const res = await api.post("/auth/login", formData);
      setAuth(res.data.user, res.data.token);
      toast({ title: "Success", description: "Logged in successfully" });
      router.push("/dashboard");
    } catch (error: any) {
      const message = error.response?.data?.message || "Login failed";
      if (message.toLowerCase().includes("verify")) {
        setNeedVerification(formData.email);
      }
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!needVerification) return;
    await api.post("/auth/resend-otp", { email: needVerification });
    toast({
      title: "OTP sent",
      description: "Check your inbox for a new verification code.",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary/20 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
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
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>
            {needVerification && (
              <div className="text-center text-sm text-muted-foreground space-y-2">
                <p>This account still needs email verification.</p>
                <ResendOtpButton onResend={handleResend} initialCountdown={10} />
              </div>
            )}
            <div className="text-center text-sm">
              <Link href="/forgot-password" className="text-primary hover:underline">
                Forgot password?
              </Link>
            </div>
          </form>

          <div className="flex items-center gap-2">
            <div className="h-px flex-1 bg-muted" />
            <span className="text-xs uppercase tracking-wide text-muted-foreground">or</span>
            <div className="h-px flex-1 bg-muted" />
          </div>

          <GoogleSignInButton />

          <div className="text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-primary hover:underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

