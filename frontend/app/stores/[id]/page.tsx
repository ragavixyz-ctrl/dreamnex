'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import api from '@/lib/api';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, Eye, Heart, ShoppingCart } from 'lucide-react';
import { useAuthStore } from '@/lib/store';
import api from '@/lib/api';
import { toast } from '@/components/ui/toaster';

export default function StoreDetailPage() {
  const params = useParams();
  const storeId = params.id as string;
  const { user } = useAuthStore();
  const [store, setStore] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/stores/${storeId}`).then((res) => {
      setStore(res.data.store);
      setProducts(res.data.store.products || []);
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  }, [storeId]);

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  if (!store) {
    return <div className="container mx-auto px-4 py-8">Store not found</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Store Header */}
      <div className="bg-gradient-to-r from-primary to-purple-600 text-white py-16">
        <div className="container mx-auto px-4">
          {store.banner && (
            <div className="relative h-64 mb-8 rounded-lg overflow-hidden">
              <Image src={store.banner} alt={store.name} width={1200} height={256} className="object-cover w-full h-full" />
            </div>
          )}
          <div className="flex items-center gap-6">
            {store.logo && (
              <div className="relative w-32 h-32 bg-white rounded-lg p-4">
                <Image src={store.logo} alt={store.name} width={128} height={128} className="object-contain w-full h-full" />
              </div>
            )}
            <div>
              <h1 className="text-4xl font-bold mb-2">{store.name}</h1>
              {store.aiGeneratedData?.tagline && (
                <p className="text-xl opacity-90">{store.aiGeneratedData.tagline}</p>
              )}
              <p className="mt-4 opacity-80">{store.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Store Info */}
      {store.aiGeneratedData && (
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {store.aiGeneratedData.brandStory && (
              <Card>
                <CardHeader>
                  <CardTitle>Brand Story</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-line">{store.aiGeneratedData.brandStory}</p>
                </CardContent>
              </Card>
            )}
            {store.aiGeneratedData.mission && (
              <Card>
                <CardHeader>
                  <CardTitle>Mission & Vision</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {store.aiGeneratedData.mission && (
                    <div>
                      <h3 className="font-semibold mb-2">Mission</h3>
                      <p>{store.aiGeneratedData.mission}</p>
                    </div>
                  )}
                  {store.aiGeneratedData.vision && (
                    <div>
                      <h3 className="font-semibold mb-2">Vision</h3>
                      <p>{store.aiGeneratedData.vision}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* Products */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-6">Products</h2>
        {products.length === 0 ? (
          <p className="text-muted-foreground">No products available</p>
        ) : (
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <Card key={product._id} className="hover:shadow-lg transition-shadow">
                {product.images && product.images.length > 0 && (
                  <div className="relative h-48 w-full">
                    <Image
                      src={product.images[0].url}
                      alt={product.name}
                      width={400}
                      height={192}
                      className="object-cover rounded-t-lg w-full h-full"
                    />
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {product.shortDescription || product.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl font-bold">${product.price}</span>
                  </div>
                  <div className="flex gap-2">
                    {user && (
                      <>
                        <Button
                          className="flex-1"
                          onClick={async () => {
                            try {
                              await api.post('/cart/add', { productId: product._id, quantity: 1 });
                              toast({ title: 'Success', description: 'Added to cart' });
                            } catch (error: any) {
                              toast({ title: 'Error', description: error.response?.data?.message || 'Failed to add to cart', variant: 'destructive' });
                            }
                          }}
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Add to Cart
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={async () => {
                            try {
                              await api.post('/wishlist/add', { productId: product._id });
                              toast({ title: 'Success', description: 'Added to wishlist' });
                            } catch (error: any) {
                              toast({ title: 'Error', description: 'Failed to add to wishlist', variant: 'destructive' });
                            }
                          }}
                        >
                          <Heart className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                  {product.views !== undefined && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mt-2">
                      <Eye className="h-4 w-4" />
                      {product.views} views
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

