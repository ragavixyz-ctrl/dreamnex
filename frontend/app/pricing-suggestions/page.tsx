'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import api from '@/lib/api';
import { toast } from '@/components/ui/toaster';
import { Loader2, TrendingUp, DollarSign } from 'lucide-react';
import { useAuthStore } from '@/lib/store';
import { useRouter } from 'next/navigation';

export default function PricingSuggestionsPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<any>(null);
  const [formData, setFormData] = useState({
    productName: '',
    category: '',
    cost: '',
    description: '',
  });

  if (!user) {
    router.push('/login');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post('/pricing/suggest', {
        productName: formData.productName,
        category: formData.category,
        cost: formData.cost ? parseFloat(formData.cost) : undefined,
        description: formData.description,
      });
      setSuggestion(res.data.pricing);
      toast({ title: 'Success', description: 'Pricing suggestion generated!' });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to generate pricing suggestion',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">AI Pricing Suggestions</h1>

      <div className="grid lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Product Information</CardTitle>
            <CardDescription>Enter product details to get AI-powered pricing suggestions</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="productName">Product Name *</Label>
                <Input
                  id="productName"
                  value={formData.productName}
                  onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="category">Category *</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g., Electronics, Fashion, Home & Garden"
                  required
                />
              </div>
              <div>
                <Label htmlFor="cost">Cost (Optional)</Label>
                <Input
                  id="cost"
                  type="number"
                  step="0.01"
                  value={formData.cost}
                  onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label htmlFor="description">Description (Optional)</Label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  placeholder="Describe your product..."
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Get Pricing Suggestion
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {suggestion && (
          <Card>
            <CardHeader>
              <CardTitle>Pricing Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center p-6 bg-gradient-to-br from-primary/10 to-purple-600/10 rounded-lg">
                <DollarSign className="h-12 w-12 mx-auto mb-4 text-primary" />
                <div className="text-4xl font-bold mb-2">${suggestion.suggested.toFixed(2)}</div>
                <p className="text-muted-foreground">Suggested Price</p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Price Range</h3>
                <div className="flex justify-between">
                  <span>Minimum: ${suggestion.min.toFixed(2)}</span>
                  <span>Maximum: ${suggestion.max.toFixed(2)}</span>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Strategy</h3>
                <p className="capitalize text-lg">{suggestion.strategy}</p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Reasoning</h3>
                <p className="text-muted-foreground">{suggestion.reasoning}</p>
              </div>

              {suggestion.positioning && (
                <div>
                  <h3 className="font-semibold mb-2">Market Positioning</h3>
                  <p className="text-muted-foreground">{suggestion.positioning}</p>
                </div>
              )}

              {suggestion.competitorAnalysis && suggestion.competitorAnalysis.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Competitor Analysis</h3>
                  <div className="space-y-2">
                    {suggestion.competitorAnalysis.slice(0, 5).map((comp: any, i: number) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{comp.name}</span>
                        <span>${comp.price.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

