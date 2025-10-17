'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Heart, Eye, Sparkles, Calendar, Crown } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const stats = [
    {
      icon: <Heart className="w-5 h-5" />,
      label: '收藏工具',
      value: '12',
      color: 'text-red-500',
    },
    {
      icon: <Eye className="w-5 h-5" />,
      label: '浏览次数',
      value: '156',
      color: 'text-blue-500',
    },
    {
      icon: <Sparkles className="w-5 h-5" />,
      label: 'AI 调用',
      value: '8',
      color: 'text-purple-500',
    },
    {
      icon: <Calendar className="w-5 h-5" />,
      label: '加入天数',
      value: '15',
      color: 'text-green-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">个人中心</h1>
          <p className="text-gray-600">管理您的账户和偏好设置</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Profile */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="w-24 h-24 mb-4">
                    <AvatarImage src={session.user?.image || ''} alt={session.user?.name || ''} />
                    <AvatarFallback className="text-2xl">
                      {session.user?.name?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="text-2xl font-bold mb-1">{session.user?.name}</h2>
                  <p className="text-gray-600 text-sm mb-4">{session.user?.email}</p>
                  <Badge className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                    <Crown className="w-3 h-3 mr-1" />
                    免费版
                  </Badge>
                </div>
                <Separator className="my-6" />
                <Button
                  asChild
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                >
                  <Link href="/pricing">
                    <Sparkles className="mr-2 h-4 w-4" />
                    升级到专业版
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">快捷操作</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link href="/favorites">
                    <Heart className="mr-2 h-4 w-4" />
                    我的收藏
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link href="/demo">
                    <Sparkles className="mr-2 h-4 w-4" />
                    AI 演示
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link href="/settings">
                    <Calendar className="mr-2 h-4 w-4" />
                    账户设置
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Stats and Activity */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Grid */}
            <div className="grid sm:grid-cols-2 gap-4">
              {stats.map((stat, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                        <p className="text-3xl font-bold">{stat.value}</p>
                      </div>
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center ${stat.color}`}>
                        {stat.icon}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>最近活动</CardTitle>
                <CardDescription>您最近的操作记录</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { action: '收藏了工具', tool: 'Midjourney', time: '2 小时前' },
                    { action: '浏览了工具', tool: 'ChatGPT', time: '5 小时前' },
                    { action: '使用了 AI 演示', tool: '图像生成', time: '1 天前' },
                    { action: '收藏了工具', tool: 'GitHub Copilot', time: '2 天前' },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center justify-between py-3 border-b last:border-0">
                      <div>
                        <p className="font-medium">{activity.action}</p>
                        <p className="text-sm text-gray-600">{activity.tool}</p>
                      </div>
                      <p className="text-sm text-gray-500">{activity.time}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Subscription Info */}
            <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Crown className="w-5 h-5 mr-2 text-indigo-600" />
                  订阅信息
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">当前方案</p>
                    <p className="text-xl font-bold">免费版</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-2">功能限制</p>
                    <ul className="space-y-1 text-sm">
                      <li>• 收藏工具上限: 10 个</li>
                      <li>• AI 调用次数: 5 次/天</li>
                      <li>• 基础搜索功能</li>
                    </ul>
                  </div>
                  <Button
                    asChild
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                  >
                    <Link href="/pricing">
                      解锁所有功能
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

