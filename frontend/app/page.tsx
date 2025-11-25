'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/lib/store';
import api from '@/lib/api';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Store, 
  Palette, 
  MessageSquare, 
  Zap, 
  ArrowRight, 
  CheckCircle2,
  Wand2,
  Rocket,
  TrendingUp,
  Shield,
  Globe
} from 'lucide-react';
import Logo from '@/components/Logo';
import GoogleSignInButton from '@/components/auth/GoogleSignInButton';

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

  const features = [
    {
      icon: Palette,
      title: 'AI Brand Generation',
      description: 'Generate stunning logos, color palettes, typography, and complete brand identities in seconds.',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Zap,
      title: 'Product Design',
      description: 'Create professional product images and compelling descriptions powered by AI.',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Store,
      title: 'Store Creation',
      description: 'Build complete online stores with AI-generated products, branding, and marketing materials.',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: MessageSquare,
      title: 'AI Assistant',
      description: 'Get personalized recommendations and shopping assistance from our intelligent chatbot.',
      color: 'from-orange-500 to-red-500',
    },
  ];

  const benefits = [
    'No coding required',
    'Launch in minutes',
    'AI-powered everything',
    'Professional results',
    '24/7 support',
    'Free to start',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-purple-50/30 dark:to-purple-950/20">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-purple-200/10 to-pink-200/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 py-24 md:py-32 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-5xl mx-auto"
          >
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex justify-center mb-8"
            >
              <Logo size="lg" />
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight"
            >
              <span className="bg-gradient-to-r from-primary via-purple-600 to-pink-500 bg-clip-text text-transparent">
                Build Your Dream Store
              </span>
              <br />
              <span className="text-foreground">With AI Magic</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-xl md:text-2xl text-muted-foreground mb-4 max-w-3xl mx-auto"
            >
              Create stunning brands, products, and complete online stores powered by artificial intelligence.
              <br />
              <span className="text-lg">No design skills required. Launch in minutes.</span>
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-10"
            >
              {user ? (
                <>
                  <Link href="/create-store">
                    <Button size="lg" className="text-lg px-8 py-6 h-auto group">
                      <Rocket className="mr-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      Create Your Store
                    </Button>
                  </Link>
                  <Link href="/brand-generator">
                    <Button size="lg" variant="outline" className="text-lg px-8 py-6 h-auto">
                      <Wand2 className="mr-2 h-5 w-5" />
                      Generate Brand
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/register">
                    <Button size="lg" className="text-lg px-8 py-6 h-auto group bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90">
                      Get Started Free
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <div className="flex items-center gap-2">
                    <div className="h-px w-8 bg-border" />
                    <span className="text-sm text-muted-foreground">or</span>
                    <div className="h-px w-8 bg-border" />
                  </div>
                  <GoogleSignInButton variant="outline" size="lg" className="text-lg px-8 py-6 h-auto" />
                </>
              )}
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground"
            >
              {benefits.map((benefit, i) => (
                <div key={i} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>{benefit}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-24 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Everything You Need to <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">Succeed</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Powerful AI tools that handle every aspect of your e-commerce journey
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Card className="h-full hover:shadow-2xl transition-all duration-300 border-2 hover:border-primary/50 group">
                <CardHeader>
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                    <feature.icon className="h-7 w-7 text-white" />
                  </div>
                  <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-24 bg-gradient-to-br from-purple-50/50 to-blue-50/50 dark:from-purple-950/20 dark:to-blue-950/20 rounded-3xl my-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">How It Works</h2>
          <p className="text-xl text-muted-foreground">Simple, fast, and powerful</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            { step: '1', title: 'Sign Up', desc: 'Create your account or sign in with Google in seconds' },
            { step: '2', title: 'Describe Your Vision', desc: 'Tell our AI what kind of store or brand you want to create' },
            { step: '3', title: 'Launch', desc: 'Get your complete store with products, branding, and marketing materials' },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.2 }}
              className="text-center"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 shadow-lg">
                {item.step}
              </div>
              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-muted-foreground">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stores Section */}
      {stores.length > 0 && (
        <section className="container mx-auto px-4 py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Featured <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">Stores</span>
            </h2>
            <p className="text-xl text-muted-foreground">See what others are building with DreamNex</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stores.slice(0, 6).map((store, i) => (
              <motion.div
                key={store._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Link href={`/stores/${store._id}`}>
                  <Card className="h-full hover:shadow-2xl transition-all duration-300 border-2 hover:border-primary/50 group overflow-hidden">
                    {store.banner && (
                      <div className="h-32 w-full bg-gradient-to-r from-primary to-purple-600 relative overflow-hidden">
                        <img 
                          src={store.banner} 
                          alt={store.name} 
                          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex items-center gap-4">
                        {store.logo && (
                          <div className="w-16 h-16 rounded-lg bg-white p-2 shadow-md">
                            <img src={store.logo} alt={store.name} className="w-full h-full object-contain" />
                          </div>
                        )}
                        <div className="flex-1">
                          <CardTitle className="group-hover:text-primary transition-colors">{store.name}</CardTitle>
                          <CardDescription className="line-clamp-2">{store.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-6">
          {[
            { icon: Rocket, label: 'Stores Created', value: '10K+' },
            { icon: TrendingUp, label: 'Active Users', value: '50K+' },
            { icon: Shield, label: 'Secure Platform', value: '100%' },
            { icon: Globe, label: 'Countries', value: '150+' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center"
            >
              <Card className="border-2">
                <CardContent className="pt-6">
                  <stat.icon className="h-8 w-8 text-primary mx-auto mb-4" />
                  <div className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <p className="text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="container mx-auto px-4 py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-purple-600/5">
            <CardContent className="pt-12 pb-12 px-8">
              <motion.div
                animate={{ 
                  scale: [1, 1.05, 1],
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="inline-block mb-6"
              >
                <Logo size="lg" />
              </motion.div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Ready to Build Your <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">Dream Store?</span>
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Join thousands of entrepreneurs creating successful online stores with AI
              </p>
              {!user && (
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Link href="/register">
                    <Button size="lg" className="text-lg px-8 py-6 h-auto bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90">
                      Start Building Now
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <GoogleSignInButton variant="outline" size="lg" className="text-lg px-8 py-6 h-auto" />
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </section>
    </div>
  );
}
