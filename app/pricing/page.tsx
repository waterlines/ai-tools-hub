'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Sparkles } from 'lucide-react';

const plans = [
  {
    name: '免费版',
    price: '¥0',
    period: '永久免费',
    description: '适合个人用户探索 AI 工具',
    features: [
      '浏览所有 AI 工具',
      '基础搜索功能',
      '收藏最多 10 个工具',
      '社区支持',
    ],
    priceId: null,
    popular: false,
  },
  {
    name: '专业版',
    price: '¥29',
    period: '每月',
    description: '适合专业用户和创作者',
    features: [
      '所有免费版功能',
      '无限收藏工具',
      '高级搜索和筛选',
      'AI 模型调用演示',
      '优先客服支持',
      '独家工具推荐',
    ],
    priceId: 'price_monthly',
    popular: true,
  },
  {
    name: '年度版',
    price: '¥290',
    period: '每年',
    description: '最划算的选择，节省 17%',
    features: [
      '所有专业版功能',
      '年度报告和趋势分析',
      '专属会员徽章',
      '提前体验新功能',
      '专属折扣优惠',
    ],
    priceId: 'price_yearly',
    popular: false,
  },
];

export default function PricingPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (priceId: string | null) => {
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    if (!priceId) {
      return;
    }

    setLoading(priceId);

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Subscription error:', error);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-indigo-100 text-indigo-700 hover:bg-indigo-100">
            <Sparkles className="w-3 h-3 mr-1" />
            定价方案
          </Badge>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            选择适合您的方案
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            无论您是个人用户还是专业创作者，我们都有适合您的方案
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative ${
                plan.popular
                  ? 'border-indigo-500 border-2 shadow-xl scale-105'
                  : 'border-gray-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-1">
                    最受欢迎
                  </Badge>
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-gray-500 ml-2">/ {plan.period}</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className={`w-full h-12 text-base font-medium ${
                    plan.popular
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
                      : ''
                  }`}
                  variant={plan.popular ? 'default' : 'outline'}
                  onClick={() => handleSubscribe(plan.priceId)}
                  disabled={loading === plan.priceId || !plan.priceId}
                >
                  {loading === plan.priceId
                    ? '处理中...'
                    : plan.priceId
                    ? '立即订阅'
                    : '当前方案'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-gray-600">
            所有方案均支持随时取消，无需长期承诺
          </p>
        </div>
      </div>
    </div>
  );
}

