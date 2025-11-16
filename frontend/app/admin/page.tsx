'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/lib/store';
import api from '@/lib/api';
import { toast } from '@/components/ui/toaster';
import { Check, X, Users, Store, TrendingUp } from 'lucide-react';

export default function AdminPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [analytics, setAnalytics] = useState<any>(null);
  const [pendingStores, setPendingStores] = useState<any[]>([]);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    if (user.role !== 'admin') {
      router.push('/');
      return;
    }

    api.get('/admin/analytics').then((res) => {
      setAnalytics(res.data.analytics);
      setPendingStores(res.data.analytics.stores.filter((s: any) => s.status === 'pending'));
    }).catch(() => {});
  }, [user, router]);

  const handleApprove = async (storeId: string) => {
    try {
      await api.put(`/admin/stores/${storeId}/approve`);
      toast({ title: 'Success', description: 'Store approved' });
      setPendingStores(pendingStores.filter(s => s.id !== storeId));
    } catch (error: any) {
      toast({ title: 'Error', description: error.response?.data?.message || 'Failed to approve', variant: 'destructive' });
    }
  };

  const handleReject = async (storeId: string) => {
    try {
      await api.put(`/admin/stores/${storeId}/reject`);
      toast({ title: 'Success', description: 'Store rejected' });
      setPendingStores(pendingStores.filter(s => s.id !== storeId));
    } catch (error: any) {
      toast({ title: 'Error', description: error.response?.data?.message || 'Failed to reject', variant: 'destructive' });
    }
  };

  if (!user || user.role !== 'admin') return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

      {analytics && (
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Total Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{analytics.totalUsers}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Store className="h-5 w-5" />
                Total Stores
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{analytics.totalStores}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Approved Stores</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{analytics.approvedStores}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Pending Stores</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{analytics.pendingStores}</p>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Pending Store Approvals</CardTitle>
          <CardDescription>Review and approve or reject stores</CardDescription>
        </CardHeader>
        <CardContent>
          {pendingStores.length === 0 ? (
            <p className="text-muted-foreground">No pending stores</p>
          ) : (
            <div className="space-y-4">
              {pendingStores.map((store) => (
                <div key={store.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-semibold">{store.name}</h3>
                    <p className="text-sm text-muted-foreground">Owner: {store.owner?.name || store.owner?.email}</p>
                    <p className="text-xs text-muted-foreground">Created: {new Date(store.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleApprove(store.id)}>
                      <Check className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleReject(store.id)}>
                      <X className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

