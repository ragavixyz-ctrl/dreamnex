'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/lib/store';
import api from '@/lib/api';
import { toast } from '@/components/ui/toaster';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function WishlistPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [wishlist, setWishlist] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    fetchWishlist();
  }, [user, router]);

  const fetchWishlist = async () => {
    try {
      const res = await api.get('/wishlist');
      setWishlist(res.data.wishlist);
    } catch (error: any) {
      console.error('Failed to fetch wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId: string) => {
    try {
      await api.delete(`/wishlist/${productId}`);
      await fetchWishlist();
      toast({ title: 'Success', description: 'Removed from wishlist' });
    } catch (error: any) {
      toast({ title: 'Error', description: 'Failed to remove', variant: 'destructive' });
    }
  };

  const addToCart = async (productId: string) => {
    try {
      await api.post('/cart/add', { productId, quantity: 1 });
      toast({ title: 'Success', description: 'Added to cart' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.response?.data?.message || 'Failed to add to cart', variant: 'destructive' });
    }
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  const products = wishlist?.products || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">My Wishlist</h1>

      {products.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">Your wishlist is empty</h2>
            <p className="text-muted-foreground mb-6">Save products you love for later!</p>
            <Link href="/">
              <Button>Start Shopping</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((item: any) => (
            <Card key={item._id} className="hover:shadow-lg transition-shadow">
              {item.product?.images?.[0] && (
                <div className="relative h-48 w-full">
                  <Image
                    src={item.product.images[0].url}
                    alt={item.product.name}
                    fill
                    className="object-cover rounded-t-lg"
                  />
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-lg">{item.product?.name}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {item.product?.shortDescription || item.product?.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">${item.product?.price}</span>
                </div>
                <div className="flex gap-2">
                  <Button
                    className="flex-1"
                    onClick={() => addToCart(item.product._id)}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => removeFromWishlist(item.product._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

