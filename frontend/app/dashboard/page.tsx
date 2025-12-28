'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/lib/store';
import api from '@/lib/api';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Store,
  TrendingUp,
  Eye,
  Package,
  Settings,
  Sparkles,
  Palette,
  Zap,
  MessageSquare,
  ShoppingCart,
  Rocket,
  CheckCircle2,
  ArrowRight,
  Info,
  Wand2,
  Image,
  Search,
  Clock,
  DollarSign,
  Users,
  Target,
  Globe,
  Shield,
} from 'lucide-react';

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

  const features = [
    { icon: Palette, title: 'AI Brand Generation', desc: 'Logos, colors, typography, brand stories' },
    { icon: Zap, title: 'Product Design', desc: 'AI-generated product images & descriptions' },
    { icon: Store, title: 'Store Creation', desc: 'Complete online stores in minutes' },
    { icon: ShoppingCart, title: 'E-Commerce', desc: 'Cart, checkout, orders, payments' },
    { icon: Image, title: 'Photo Enhancement', desc: 'AI image enhancement & background removal' },
    { icon: TrendingUp, title: 'Pricing Suggestions', desc: 'Optimal pricing recommendations' },
    { icon: Search, title: 'SEO Tools', desc: 'SEO titles, meta descriptions, keywords' },
    { icon: MessageSquare, title: 'AI Assistant', desc: 'Shopping chatbot & recommendations' },
  ];

  const howItWorks = [
    { step: 1, title: 'Generate Your Brand', desc: 'Create logo, colors, and brand identity with AI', link: '/brand-generator' },
    { step: 2, title: 'Create Your Store', desc: 'AI builds a complete store with products and marketing', link: '/create-store' },
    { step: 3, title: 'Customize & Launch', desc: 'Customize themes, set prices, and go live', link: '/dashboard' },
    { step: 4, title: 'Start Selling', desc: 'Accept orders, manage inventory, track sales', link: '/orders' },
  ];

  const problemsSolved = [
    { icon: Clock, title: 'Saves Time', desc: 'Launch in minutes, not weeks' },
    { icon: DollarSign, title: 'Saves Money', desc: 'No expensive designers needed' },
    { icon: Users, title: 'No Skills Required', desc: 'AI handles everything for you' },
    { icon: Target, title: 'Complete Solution', desc: 'Everything in one platform' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Welcome to DreamNex, {user.name}!</h1>
          <p className="text-muted-foreground">Your AI-powered e-commerce dashboard</p>
        </div>
        <Link href="/settings">
          <Button variant="outline" className="gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </Button>
        </Link>
      </div>

      {/* What is DreamNex Section */}
      <Card className="mb-8 border-2">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <CardTitle className="text-2xl">What is DreamNex?</CardTitle>
          </div>
          <CardDescription className="text-base">
            DreamNex is an AI-powered e-commerce platform that builds brands, products, and complete online stores for you.
            No coding, design skills, or large budgets required. Launch your online business in minutes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {problemsSolved.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 border rounded-lg hover:border-primary transition-colors"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold">{item.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Stats Section */}
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

      {/* How It Works Section */}
      <Card className="mb-8 border-2">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg">
              <Rocket className="h-6 w-6 text-white" />
            </div>
            <CardTitle className="text-2xl">How DreamNex Works</CardTitle>
          </div>
          <CardDescription className="text-base">
            Follow these simple steps to build and launch your online store
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {howItWorks.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full border-2 hover:border-primary transition-all hover:shadow-lg">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold">
                        {step.step}
                      </div>
                      <CardTitle className="text-lg">{step.title}</CardTitle>
                    </div>
                    <CardDescription>{step.desc}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link href={step.link}>
                      <Button variant="outline" size="sm" className="w-full">
                        Get Started
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Features Section */}
      <Card className="mb-8 border-2">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg">
              <Wand2 className="h-6 w-6 text-white" />
            </div>
            <CardTitle className="text-2xl">What Can You Do with DreamNex?</CardTitle>
          </div>
          <CardDescription className="text-base">
            Complete set of AI-powered tools for your e-commerce business
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 border rounded-lg hover:border-primary transition-all hover:shadow-md"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-sm">{feature.title}</h3>
                </div>
                <p className="text-xs text-muted-foreground">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card className="border-2 hover:border-primary transition-all cursor-pointer">
          <Link href="/brand-generator">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Generate Brand
              </CardTitle>
              <CardDescription>Create your brand identity with AI</CardDescription>
            </CardHeader>
          </Link>
        </Card>
        <Card className="border-2 hover:border-primary transition-all cursor-pointer">
          <Link href="/product-designer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Design Products
              </CardTitle>
              <CardDescription>Create product designs and descriptions</CardDescription>
            </CardHeader>
          </Link>
        </Card>
        <Card className="border-2 hover:border-primary transition-all cursor-pointer">
          <Link href="/chat">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                AI Assistant
              </CardTitle>
              <CardDescription>Get help and recommendations</CardDescription>
            </CardHeader>
          </Link>
        </Card>
      </div>

      {/* My Stores Section */}
      <Card>
        <CardHeader>
          <CardTitle>My Stores</CardTitle>
          <CardDescription>Manage your stores and view analytics</CardDescription>
        </CardHeader>
        <CardContent>
          {stores.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Store className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">You don't have any stores yet</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Create your first store with AI-powered tools. DreamNex will generate everything you need:
                logo, branding, products, descriptions, and marketing materials.
              </p>
              <Link href="/create-store">
                <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600">
                  <Rocket className="mr-2 h-5 w-5" />
                  Create Your First Store
                </Button>
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

