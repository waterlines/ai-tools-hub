'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Loader2, Lock } from 'lucide-react';

export default function DemoPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    if (!prompt.trim()) {
      setError('请输入提示词');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/replicate/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Generation failed');
      }

      if (data.output && Array.isArray(data.output) && data.output.length > 0) {
        setResult(data.output[0]);
      } else if (typeof data.output === 'string') {
        setResult(data.output);
      } else {
        setError('未能生成图像');
      }
    } catch (err) {
      setError((err as Error).message || '生成失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const examples = [
    'A futuristic city with flying cars at sunset',
    'A cute robot playing with a cat in a garden',
    'Abstract art with vibrant colors and geometric shapes',
    'A magical forest with glowing mushrooms at night',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-indigo-100 text-indigo-700 hover:bg-indigo-100">
            <Sparkles className="w-3 h-3 mr-1" />
            AI 模型演示
          </Badge>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            AI 图像生成
          </h1>
          <p className="text-xl text-gray-600">
            使用 Stable Diffusion XL 生成高质量图像
          </p>
        </div>

        {/* Main Card */}
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl">输入提示词</CardTitle>
            <CardDescription>
              描述您想要生成的图像，使用英文效果更好
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Input */}
            <div className="space-y-2">
              <Label htmlFor="prompt">提示词</Label>
              <Input
                id="prompt"
                placeholder="例如: A beautiful sunset over the ocean"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="h-12 text-base"
                disabled={loading}
              />
            </div>

            {/* Examples */}
            <div className="space-y-2">
              <Label>示例提示词</Label>
              <div className="flex flex-wrap gap-2">
                {examples.map((example, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => setPrompt(example)}
                    disabled={loading}
                    className="text-xs"
                  >
                    {example}
                  </Button>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            {session ? (
              <Button
                onClick={handleGenerate}
                disabled={loading || !prompt.trim()}
                className="w-full h-12 text-base bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    生成中...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    生成图像
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={() => router.push('/auth/signin')}
                className="w-full h-12 text-base bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              >
                <Lock className="mr-2 h-5 w-5" />
                登录后使用
              </Button>
            )}

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                {error}
              </div>
            )}

            {/* Result */}
            {result && (
              <div className="space-y-4">
                <Label>生成结果</Label>
                <div className="relative rounded-lg overflow-hidden border-2 border-indigo-200 bg-gray-100">
                  <img
                    src={result}
                    alt="Generated image"
                    className="w-full h-auto"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    asChild
                    variant="outline"
                    className="flex-1"
                  >
                    <a href={result} download target="_blank" rel="noopener noreferrer">
                      下载图像
                    </a>
                  </Button>
                  <Button
                    onClick={() => {
                      setResult(null);
                      setPrompt('');
                    }}
                    variant="outline"
                    className="flex-1"
                  >
                    重新生成
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="mt-8 bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
          <CardContent className="p-6">
            <h3 className="font-semibold text-lg mb-2">💡 提示</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• 使用详细的描述可以获得更好的结果</li>
              <li>• 可以包含风格、颜色、光照等细节</li>
              <li>• 生成时间通常需要 10-30 秒</li>
              <li>• 专业版用户享有更快的生成速度和更高的优先级</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

