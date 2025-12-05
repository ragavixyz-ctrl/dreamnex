'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import api from '@/lib/api';
import { toast } from '@/components/ui/toaster';
import { Loader2, Image as ImageIcon, Sparkles } from 'lucide-react';
import { useAuthStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function ProductEnhancerPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [enhancements, setEnhancements] = useState<string[]>([]);
  const [result, setResult] = useState<any>(null);

  if (!user) {
    router.push('/login');
    return null;
  }

  const enhancementOptions = [
    { id: 'quality', label: 'Improve Quality' },
    { id: 'backgroundRemoval', label: 'Remove Background' },
    { id: 'shadows', label: 'Add Shadows' },
    { id: 'reflections', label: 'Add Reflections' },
    { id: 'colorCorrection', label: 'Color Correction' },
    { id: 'mockup', label: 'Product Mockup' },
  ];

  const toggleEnhancement = (id: string) => {
    setEnhancements(prev =>
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    );
  };

  const handleEnhance = async () => {
    if (!imageUrl) {
      toast({ title: 'Error', description: 'Please provide an image URL', variant: 'destructive' });
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/product-enhancer/enhance', {
        imageUrl,
        enhancements,
      });
      setResult(res.data);
      toast({ title: 'Success', description: 'Image enhanced successfully!' });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to enhance image',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">AI Product Photo Enhancer</h1>

      <div className="grid lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Enhance Product Photo</CardTitle>
            <CardDescription>Upload or provide image URL to enhance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input
                id="imageUrl"
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/product-image.jpg"
              />
            </div>

            <div>
              <Label>Enhancement Options</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {enhancementOptions.map((option) => (
                  <Button
                    key={option.id}
                    type="button"
                    variant={enhancements.includes(option.id) ? 'default' : 'outline'}
                    onClick={() => toggleEnhancement(option.id)}
                    className="justify-start"
                  >
                    {enhancements.includes(option.id) && <Sparkles className="h-4 w-4 mr-2" />}
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>

            <Button
              onClick={handleEnhance}
              disabled={loading || !imageUrl}
              className="w-full"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enhancing...
                </>
              ) : (
                <>
                  <ImageIcon className="mr-2 h-4 w-4" />
                  Enhance Image
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {result && (
          <Card>
            <CardHeader>
              <CardTitle>Enhanced Image</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-muted">
                <Image
                  src={result.enhancedUrl}
                  alt="Enhanced product"
                  fill
                  className="object-contain"
                />
              </div>
              <Button
                onClick={() => window.open(result.enhancedUrl, '_blank')}
                variant="outline"
                className="w-full"
              >
                Download Enhanced Image
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

