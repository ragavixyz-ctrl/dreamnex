'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/lib/store';
import api from '@/lib/api';
import Link from 'next/link';
import { Store, TrendingUp, Eye, Package } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [stores, setStores] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    api.get(`/stores?owner=${user.id}`).then((res) => {
      setStores(res.data.stores || []);
    }).catch(() => {});

    // Get analytics for first store if available
    if (stores.length > 0) {
      api.get(`/stores/${stores[0]._id}/analytics`).then((res) => {
        setAnalytics(res.data.analytics);
      }).catch(() => {});
    }
  }, [user, router, stores.length]);

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Dashboard</h1>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="h-5 w-5" />
              Total Stores
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stores.length}</p>
          </CardContent>
        </Card>
        {analytics && (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Total Views
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{analytics.totalProductViews || 0}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Products
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{analytics.productCount || 0}</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>My Stores</CardTitle>
          <CardDescription>Manage your stores and view analytics</CardDescription>
        </CardHeader>
        <CardContent>
          {stores.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">You don't have any stores yet</p>
              <Link href="/create-store">
                <Button>Create Your First Store</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {stores.map((store) => (
                <div key={store._id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-semibold">{store.name}</h3>
                    <p className="text-sm text-muted-foreground">{store.description}</p>
                    <span className={`text-xs px-2 py-1 rounded mt-2 inline-block ${
                      store.status === 'approved' ? 'bg-green-100 text-green-800' :
                      store.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {store.status}
                    </span>
                  </div>
                  <Link href={`/stores/${store._id}`}>
                    <Button variant="outline">View Store</Button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

