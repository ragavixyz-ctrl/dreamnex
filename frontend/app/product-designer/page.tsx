'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import api from '@/lib/api';
import { toast } from '@/components/ui/toaster';
import { Loader2, Download } from 'lucide-react';
import Image from 'next/image';

export default function ProductDesignerPage() {
  const [productIdea, setProductIdea] = useState('');
  const [count, setCount] = useState(3);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [description, setDescription] = useState<any>(null);

  const generateDesigns = async () => {
    if (!productIdea) {
      toast({ title: 'Error', description: 'Product idea is required', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/ai/product-design', { productIdea, count });
      setImages(res.data.images.map((img: any) => img.url));
      toast({ title: 'Success', description: 'Product designs generated!' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.response?.data?.message || 'Failed to generate designs', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const generateDescription = async () => {
    if (!productIdea) {
      toast({ title: 'Error', description: 'Product idea is required', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/ai/product-description', { productName: productIdea });
      setDescription(res.data.description);
      toast({ title: 'Success', description: 'Product description generated!' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.response?.data?.message || 'Failed to generate description', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">AI Product Designer</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Product Information</CardTitle>
          <CardDescription>Describe your product idea and AI will generate designs</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="productIdea">Product Idea</Label>
            <Input
              id="productIdea"
              value={productIdea}
              onChange={(e) => setProductIdea(e.target.value)}
              placeholder="e.g., Modern wireless headphones, Eco-friendly water bottle"
            />
          </div>
          <div>
            <Label htmlFor="count">Number of Designs (1-5)</Label>
            <Input
              id="count"
              type="number"
              min="1"
              max="5"
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value) || 3)}
            />
          </div>
          <div className="flex gap-4">
            <Button onClick={generateDesigns} disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Generate Designs
            </Button>
            <Button onClick={generateDescription} disabled={loading} variant="outline">
              Generate Description
            </Button>
          </div>
        </CardContent>
      </Card>

      {images.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Generated Product Designs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {images.map((url, i) => (
                <div key={i} className="relative aspect-square bg-white rounded-lg p-4">
                  <Image src={url} alt={`Product design ${i + 1}`} width={400} height={400} className="object-contain w-full h-full" />
                  <Button
                    className="mt-2 w-full"
                    variant="outline"
                    onClick={() => window.open(url, '_blank')}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {description && (
        <Card>
          <CardHeader>
            <CardTitle>Product Description</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {description.seo && (
              <div>
                <h3 className="font-semibold mb-2">SEO Description</h3>
                <p>{description.seo}</p>
              </div>
            )}
            {description.bullets && description.bullets.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Key Features</h3>
                <ul className="list-disc list-inside space-y-1">
                  {description.bullets.map((bullet: string, i: number) => (
                    <li key={i}>{bullet}</li>
                  ))}
                </ul>
              </div>
            )}
            {description.highlights && description.highlights.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Highlights</h3>
                <ul className="list-disc list-inside space-y-1">
                  {description.highlights.map((highlight: string, i: number) => (
                    <li key={i}>{highlight}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

