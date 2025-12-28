'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Sparkles,
  Store,
  Palette,
  Zap,
  MessageSquare,
  ShoppingCart,
  TrendingUp,
  Shield,
  Globe,
  Wand2,
  Rocket,
  CheckCircle2,
  ArrowRight,
  Target,
  Users,
  Clock,
  DollarSign,
  Image,
  Search,
  FileText,
  Settings,
  Heart,
  Package,
} from 'lucide-react';
import Logo from '@/components/Logo';

export default function AboutPage() {
  const problems = [
    {
      icon: Clock,
      title: 'Time-Consuming Setup',
      description: 'Traditional e-commerce platforms require weeks of design, development, and content creation.',
      solution: 'DreamNex creates complete stores in minutes with AI-powered automation.',
    },
    {
      icon: DollarSign,
      title: 'High Costs',
      description: 'Hiring designers, developers, and marketers can cost thousands of dollars.',
      solution: 'Get professional-quality results at a fraction of the cost with AI.',
    },
    {
      icon: Users,
      title: 'Lack of Expertise',
      description: 'Not everyone has design skills, coding knowledge, or marketing expertise.',
      solution: 'No technical skills needed - AI handles everything for you.',
    },
    {
      icon: Target,
      title: 'Brand Identity Challenges',
      description: 'Creating a cohesive brand identity requires multiple tools and services.',
      solution: 'Generate complete brand identities (logo, colors, story) in one place.',
    },
  ];

  const features = [
    {
      icon: Palette,
      title: 'AI Brand Generation',
      description: 'Create stunning logos, color palettes, typography, and complete brand stories instantly.',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Zap,
      title: 'Product Design',
      description: 'Generate professional product images, descriptions, and marketing materials with AI.',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Store,
      title: 'Store Creation',
      description: 'Build complete online stores with AI-generated products, branding, and themes.',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: ShoppingCart,
      title: 'Full E-Commerce',
      description: 'Shopping cart, checkout, order tracking, payments, and customer management.',
      color: 'from-orange-500 to-red-500',
    },
    {
      icon: Image,
      title: 'Photo Enhancement',
      description: 'AI-powered image enhancement, background removal, and product mockups.',
      color: 'from-pink-500 to-rose-500',
    },
    {
      icon: TrendingUp,
      title: 'Pricing Suggestions',
      description: 'Get optimal pricing recommendations based on competitor analysis and market trends.',
      color: 'from-yellow-500 to-orange-500',
    },
    {
      icon: Search,
      title: 'SEO Tools',
      description: 'Generate SEO-friendly titles, meta descriptions, keywords, and blog posts.',
      color: 'from-indigo-500 to-purple-500',
    },
    {
      icon: MessageSquare,
      title: 'AI Shopping Assistant',
      description: 'Get personalized product recommendations and shopping assistance from AI chatbot.',
      color: 'from-teal-500 to-cyan-500',
    },
  ];

  const howItWorks = [
    {
      step: 1,
      title: 'Sign Up & Create Account',
      description: 'Register with email or Google Sign-In. Verify your email to get started.',
      icon: Users,
    },
    {
      step: 2,
      title: 'Generate Your Brand',
      description: 'Use AI to create your logo, color palette, brand story, and style guide.',
      icon: Wand2,
    },
    {
      step: 3,
      title: 'Create Your Store',
      description: 'AI generates a complete online store with products, descriptions, and marketing materials.',
      icon: Store,
    },
    {
      step: 4,
      title: 'Customize & Launch',
      description: 'Customize themes, add products, set prices, and launch your store.',
      icon: Rocket,
    },
    {
      step: 5,
      title: 'Start Selling',
      description: 'Accept orders, manage inventory, track sales, and grow your business.',
      icon: TrendingUp,
    },
  ];

  const useCases = [
    {
      title: 'Entrepreneurs',
      description: 'Launch your product idea quickly without technical expertise or large budgets.',
      icon: Rocket,
    },
    {
      title: 'Small Businesses',
      description: 'Create a professional online presence and expand your customer reach.',
      icon: Store,
    },
    {
      title: 'Creators',
      description: 'Monetize your creativity by selling products with AI-generated designs.',
      icon: Palette,
    },
    {
      title: 'Dropshippers',
      description: 'Build multiple stores quickly with AI-generated product descriptions and marketing.',
      icon: Package,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-purple-50/30 dark:to-purple-950/20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-16">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="flex justify-center mb-6">
              <Logo size="lg" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              What is DreamNex?
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              The AI-powered e-commerce platform that builds brands, products, and online stores for you
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/register">
                <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600">
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/">
                <Button size="lg" variant="outline">
                  Explore Features
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* What Problems We Solve */}
      <section className="py-20 bg-background/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">Problems We Solve</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Starting an online business shouldn't be complicated or expensive
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {problems.map((problem, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full border-2 hover:border-primary transition-colors">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-destructive/10 rounded-lg">
                        <problem.icon className="h-5 w-5 text-destructive" />
                      </div>
                      <CardTitle>{problem.title}</CardTitle>
                    </div>
                    <CardDescription className="text-base">{problem.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-start gap-2 p-3 bg-primary/5 rounded-lg border border-primary/20">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <p className="text-sm font-medium">{problem.solution}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">How DreamNex Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From idea to online store in 5 simple steps
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {howItWorks.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="mb-8"
              >
                <Card className="border-2 hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-6">
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold text-2xl">
                          {step.step}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <step.icon className="h-6 w-6 text-primary" />
                          <h3 className="text-2xl font-bold">{step.title}</h3>
                        </div>
                        <p className="text-muted-foreground text-lg">{step.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-background/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">Complete Feature Set</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to build, launch, and grow your online business
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full border-2 hover:border-primary transition-all hover:shadow-lg">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4`}>
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                    <CardDescription className="text-base">{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">Who Can Use DreamNex?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Perfect for anyone who wants to start selling online
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {useCases.map((useCase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full text-center border-2 hover:border-primary transition-all hover:shadow-lg">
                  <CardHeader>
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <useCase.icon className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{useCase.title}</CardTitle>
                    <CardDescription className="text-base">{useCase.description}</CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">Why Choose DreamNex?</h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              The fastest way to launch your online business
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { icon: Clock, title: 'Launch in Minutes', desc: 'From idea to live store in under 10 minutes' },
              { icon: DollarSign, title: 'Affordable', desc: 'No expensive designers or developers needed' },
              { icon: Shield, title: 'Secure & Reliable', desc: 'Enterprise-grade security and uptime' },
              { icon: Globe, title: 'Global Reach', desc: 'Sell to customers worldwide' },
              { icon: Settings, title: 'Easy Management', desc: 'Intuitive dashboard for all your needs' },
              { icon: Sparkles, title: 'AI-Powered', desc: 'Cutting-edge AI for best results' },
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                <p className="opacity-90">{benefit.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-4xl font-bold mb-4">Ready to Start Your Online Business?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of entrepreneurs who are building their dreams with DreamNex
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/register">
                <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 text-lg px-8">
                  Create Free Account
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/">
                <Button size="lg" variant="outline" className="text-lg px-8">
                  Explore Features
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

