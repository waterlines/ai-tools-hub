'use client';

import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Chrome } from 'lucide-react';

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center">
              <span className="text-3xl">🤖</span>
            </div>
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            AI 工具导航站
          </CardTitle>
          <CardDescription className="text-base">
            发现和探索最好的 AI 工具
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={() => signIn('google', { callbackUrl: '/' })}
            className="w-full h-12 text-base font-medium bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-200 shadow-sm"
            variant="outline"
          >
            <Chrome className="mr-2 h-5 w-5" />
            使用 Google 账号登录
          </Button>
          <p className="text-xs text-center text-gray-500 px-4">
            登录即表示您同意我们的服务条款和隐私政策
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

