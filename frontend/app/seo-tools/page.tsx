'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import api from '@/lib/api';
import { toast } from '@/components/ui/toaster';
import { Loader2, Search, FileText, Hash, BookOpen } from 'lucide-react';
import { useAuthStore } from '@/lib/store';
import { useRouter } from 'next/navigation';

export default function SEOToolsPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    productName: '',
    category: '',
    description: '',
  });
  const [results, setResults] = useState<any>({});

  if (!user) {
    router.push('/login');
    return null;
  }

  const generateTitle = async () => {
    setLoading('title');
    try {
      const res = await api.post('/seo/title', formData);
      setResults({ ...results, titles: res.data.titles });
      toast({ title: 'Success', description: 'SEO titles generated!' });
    } catch (error: any) {
      toast({ title: 'Error', description: 'Failed to generate titles', variant: 'destructive' });
    } finally {
      setLoading(null);
    }
  };

  const generateMeta = async () => {
    setLoading('meta');
    try {
      const res = await api.post('/seo/meta-description', formData);
      setResults({ ...results, descriptions: res.data.descriptions });
      toast({ title: 'Success', description: 'Meta descriptions generated!' });
    } catch (error: any) {
      toast({ title: 'Error', description: 'Failed to generate descriptions', variant: 'destructive' });
    } finally {
      setLoading(null);
    }
  };

  const generateKeywords = async () => {
    setLoading('keywords');
    try {
      const res = await api.post('/seo/keywords', formData);
      setResults({ ...results, keywords: res.data.keywords });
      toast({ title: 'Success', description: 'Keywords generated!' });
    } catch (error: any) {
      toast({ title: 'Error', description: 'Failed to generate keywords', variant: 'destructive' });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">AI SEO Tools</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Product Information</CardTitle>
          <CardDescription>Enter product details to generate SEO content</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="productName">Product Name</Label>
              <Input
                id="productName"
                value={formData.productName}
                onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                placeholder="Product name"
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="Product category"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Product description"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              SEO Titles
            </CardTitle>
            <CardDescription>Generate SEO-optimized page titles</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={generateTitle}
              disabled={loading !== null}
              className="w-full"
            >
              {loading === 'title' ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Generate Titles
                </>
              )}
            </Button>
            {results.titles && (
              <div className="space-y-2">
                {results.titles.map((title: string, i: number) => (
                  <div key={i} className="p-3 bg-muted rounded-lg text-sm">
                    {title}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Meta Descriptions
            </CardTitle>
            <CardDescription>Generate SEO meta descriptions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={generateMeta}
              disabled={loading !== null}
              className="w-full"
            >
              {loading === 'meta' ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <FileText className="mr-2 h-4 w-4" />
                  Generate Descriptions
                </>
              )}
            </Button>
            {results.descriptions && (
              <div className="space-y-2">
                {results.descriptions.map((desc: string, i: number) => (
                  <div key={i} className="p-3 bg-muted rounded-lg text-sm">
                    {desc}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Hash className="h-5 w-5" />
              Keywords
            </CardTitle>
            <CardDescription>Generate SEO keywords</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={generateKeywords}
              disabled={loading !== null}
              className="w-full"
            >
              {loading === 'keywords' ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Hash className="mr-2 h-4 w-4" />
                  Generate Keywords
                </>
              )}
            </Button>
            {results.keywords && (
              <div className="space-y-3">
                {results.keywords.primary && (
                  <div>
                    <p className="text-sm font-semibold mb-1">Primary:</p>
                    <p className="p-2 bg-primary/10 rounded text-sm">{results.keywords.primary}</p>
                  </div>
                )}
                {results.keywords.secondary && results.keywords.secondary.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold mb-1">Secondary:</p>
                    <div className="flex flex-wrap gap-2">
                      {results.keywords.secondary.map((kw: string, i: number) => (
                        <span key={i} className="px-2 py-1 bg-muted rounded text-xs">{kw}</span>
                      ))}
                    </div>
                  </div>
                )}
                {results.keywords.longTail && results.keywords.longTail.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold mb-1">Long-tail:</p>
                    <div className="space-y-1">
                      {results.keywords.longTail.map((kw: string, i: number) => (
                        <p key={i} className="text-xs text-muted-foreground">{kw}</p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

