'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import api from '@/lib/api';
import { toast } from '@/components/ui/toaster';
import Link from 'next/link';

function VerifyEmailForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(!!token);

  useEffect(() => {
    if (token) {
      api.post('/auth/verify-email', { token })
        .then(() => {
          setVerified(true);
          toast({ title: 'Success', description: 'Email verified successfully' });
        })
        .catch((error: any) => {
          toast({
            title: 'Error',
            description: error.response?.data?.message || 'Failed to verify email',
            variant: 'destructive',
          });
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary/20 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Email Verification</CardTitle>
          <CardDescription>
            {loading ? 'Verifying your email...' : verified ? 'Email verified!' : 'Verification failed'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">
              <p>Please wait...</p>
            </div>
          ) : verified ? (
            <div className="text-center space-y-4">
              <p className="text-green-600">Your email has been verified successfully!</p>
              <Link href="/login">
                <Button>Go to Login</Button>
              </Link>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <p className="text-muted-foreground">
                The verification link is invalid or has expired.
              </p>
              <Link href="/login">
                <Button>Go to Login</Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailForm />
    </Suspense>
  );
}

