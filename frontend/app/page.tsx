'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/lib/store';
import api from '@/lib/api';
import { motion } from 'framer-motion';
import { Sparkles, Store, Palette, MessageSquare, Zap } from 'lucide-react';

export default function HomePage() {
  const { user } = useAuthStore();
  const [trendingProducts, setTrendingProducts] = useState<any[]>([]);
  const [stores, setStores] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      api.get('/users/homepage').then((res) => {
        setTrendingProducts(res.data.data.trending || []);
        setStores(res.data.data.stores || []);
      }).catch(() => {});
    } else {
      api.get('/stores?status=approved').then((res) => {
        setStores(res.data.stores.slice(0, 6) || []);
      }).catch(() => {});
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            DreamNex
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8">
            AI builds brands, products, and online stores for you
          </p>
          <div className="flex gap-4 justify-center">
            {user ? (
              <>
                <Link href="/create-store">
                  <Button size="lg" className="text-lg px-8">
                    <Sparkles className="mr-2 h-5 w-5" />
                    Create Store
                  </Button>
                </Link>
                <Link href="/brand-generator">
                  <Button size="lg" variant="outline" className="text-lg px-8">
                    Generate Brand
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/register">
                  <Button size="lg" className="text-lg px-8">
                    Get Started
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="outline" className="text-lg px-8">
                    Login
                  </Button>
                </Link>
              </>
            )}
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">AI-Powered Features</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <Palette className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Brand Generation</CardTitle>
              <CardDescription>
                AI generates logos, color palettes, typography, and brand stories
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <Zap className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Product Design</CardTitle>
              <CardDescription>
                Create stunning product images and descriptions with AI
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <Store className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Store Creation</CardTitle>
              <CardDescription>
                AI builds complete online stores with products and branding
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <MessageSquare className="h-10 w-10 text-primary mb-2" />
              <CardTitle>AI Assistant</CardTitle>
              <CardDescription>
                Get personalized product recommendations and shopping help
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Stores Section */}
      {stores.length > 0 && (
        <section className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Stores</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {stores.slice(0, 6).map((store) => (
              <Link key={store._id} href={`/stores/${store._id}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    {store.logo && (
                      <img src={store.logo} alt={store.name} className="w-20 h-20 object-contain mb-4" />
                    )}
                    <CardTitle>{store.name}</CardTitle>
                    <CardDescription>{store.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold mb-4">Ready to Build Your Dream Store?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Let AI handle the design, branding, and product creation
          </p>
          {!user && (
            <Link href="/register">
              <Button size="lg" className="text-lg px-8">
                Start Free
              </Button>
            </Link>
          )}
        </motion.div>
      </section>
    </div>
  );
}

