'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import api from '@/lib/api';
import { toast } from '@/components/ui/toaster';
import { Loader2, Download, Palette } from 'lucide-react';
import Image from 'next/image';

export default function BrandGeneratorPage() {
  const [brandName, setBrandName] = useState('');
  const [niche, setNiche] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  const generateLogo = async () => {
    if (!brandName) {
      toast({ title: 'Error', description: 'Brand name is required', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/ai/brand-logo', { brandName });
      setResults({ ...results, logo: res.data.logoUrl });
      toast({ title: 'Success', description: 'Logo generated!' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.response?.data?.message || 'Failed to generate logo', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const generateStyle = async () => {
    if (!brandName) {
      toast({ title: 'Error', description: 'Brand name is required', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/ai/brand-style', { brandName, niche });
      setResults({ ...results, style: res.data.style });
      toast({ title: 'Success', description: 'Brand style generated!' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.response?.data?.message || 'Failed to generate style', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const generateStory = async () => {
    if (!brandName) {
      toast({ title: 'Error', description: 'Brand name is required', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/ai/brand-story', { brandName, niche });
      setResults({ ...results, story: res.data.brandStory });
      toast({ title: 'Success', description: 'Brand story generated!' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.response?.data?.message || 'Failed to generate story', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">AI Brand Generator</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Brand Information</CardTitle>
          <CardDescription>Enter your brand details to generate assets</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="brandName">Brand Name</Label>
            <Input
              id="brandName"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              placeholder="My Awesome Brand"
            />
          </div>
          <div>
            <Label htmlFor="niche">Niche (Optional)</Label>
            <Input
              id="niche"
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              placeholder="Fashion, Tech, Food, etc."
            />
          </div>
          <div className="flex gap-4">
            <Button onClick={generateLogo} disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Generate Logo
            </Button>
            <Button onClick={generateStyle} disabled={loading} variant="outline">
              <Palette className="mr-2 h-4 w-4" />
              Generate Style
            </Button>
            <Button onClick={generateStory} disabled={loading} variant="outline">
              Generate Story
            </Button>
          </div>
        </CardContent>
      </Card>

      {results?.logo && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Generated Logo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative w-64 h-64 bg-white rounded-lg p-4">
              <Image src={results.logo} alt="Generated Logo" width={256} height={256} className="object-contain" />
            </div>
            <Button className="mt-4" onClick={() => window.open(results.logo, '_blank')}>
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </CardContent>
        </Card>
      )}

      {results?.style && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Brand Style Guide</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Primary Colors</h3>
                <div className="flex gap-2">
                  {results.style.primaryColors?.map((color: string, i: number) => (
                    <div key={i} className="flex flex-col items-center">
                      <div
                        className="w-16 h-16 rounded border"
                        style={{ backgroundColor: color }}
                      />
                      <span className="text-xs mt-1">{color}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Secondary Colors</h3>
                <div className="flex gap-2">
                  {results.style.secondaryColors?.map((color: string, i: number) => (
                    <div key={i} className="flex flex-col items-center">
                      <div
                        className="w-16 h-16 rounded border"
                        style={{ backgroundColor: color }}
                      />
                      <span className="text-xs mt-1">{color}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Fonts</h3>
                <ul className="list-disc list-inside">
                  {results.style.fonts?.map((font: string, i: number) => (
                    <li key={i}>{font}</li>
                  ))}
                </ul>
              </div>
              {results.style.moodBoard && (
                <div>
                  <h3 className="font-semibold mb-2">Mood Board</h3>
                  <p className="text-muted-foreground">{results.style.moodBoard}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {results?.story && (
        <Card>
          <CardHeader>
            <CardTitle>Brand Story</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {results.story.tagline && (
              <div>
                <h3 className="font-semibold mb-2">Tagline</h3>
                <p className="text-lg italic">{results.story.tagline}</p>
              </div>
            )}
            {results.story.story && (
              <div>
                <h3 className="font-semibold mb-2">Brand Story</h3>
                <p className="whitespace-pre-line">{results.story.story}</p>
              </div>
            )}
            {results.story.mission && (
              <div>
                <h3 className="font-semibold mb-2">Mission</h3>
                <p>{results.story.mission}</p>
              </div>
            )}
            {results.story.vision && (
              <div>
                <h3 className="font-semibold mb-2">Vision</h3>
                <p>{results.story.vision}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

