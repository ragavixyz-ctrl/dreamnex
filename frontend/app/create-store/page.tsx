'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import api from '@/lib/api';
import { toast } from '@/components/ui/toaster';
import { Loader2, Sparkles } from 'lucide-react';
import { useAuthStore } from '@/lib/store';

export default function CreateStorePage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    storeName: '',
    niche: '',
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({ title: 'Error', description: 'Please login first', variant: 'destructive' });
      router.push('/login');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/stores/create', formData);
      toast({ title: 'Success', description: 'Store created successfully! It will be reviewed by admin.' });
      router.push(`/stores/${res.data.store.id}`);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to create store',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Create AI Store</h1>
      
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            Store Information
          </CardTitle>
          <CardDescription>
            AI will generate logo, theme, products, and marketing materials for your store
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="storeName">Store Name *</Label>
              <Input
                id="storeName"
                value={formData.storeName}
                onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                placeholder="My Awesome Store"
                required
              />
            </div>
            <div>
              <Label htmlFor="niche">Niche</Label>
              <Input
                id="niche"
                value={formData.niche}
                onChange={(e) => setFormData({ ...formData, niche: e.target.value })}
                placeholder="Fashion, Tech, Food, etc."
              />
            </div>
            <div>
              <Label htmlFor="description">Description (Optional)</Label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe your store..."
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating store with AI...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Create Store
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

