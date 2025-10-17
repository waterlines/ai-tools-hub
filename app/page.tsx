import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Sparkles, Zap, Shield, TrendingUp } from 'lucide-react';

export default function HomePage() {
  const features = [
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: '精选工具',
      description: '精心挑选的优质 AI 工具，覆盖各个领域',
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: '实时更新',
      description: '持续更新最新的 AI 工具和技术动态',
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: '安全可靠',
      description: '所有工具经过审核，确保安全可靠',
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: '趋势分析',
      description: '了解 AI 工具的使用趋势和热度',
    },
  ];

  const categories = [
    { name: '图像生成', icon: '🎨', count: 25, color: 'from-pink-500 to-rose-500' },
    { name: '文本生成', icon: '✍️', count: 30, color: 'from-blue-500 to-cyan-500' },
    { name: '视频处理', icon: '🎬', count: 18, color: 'from-purple-500 to-indigo-500' },
    { name: '音频处理', icon: '🎵', count: 15, color: 'from-green-500 to-emerald-500' },
    { name: '代码助手', icon: '💻', count: 22, color: 'from-orange-500 to-amber-500' },
    { name: '数据分析', icon: '📊', count: 12, color: 'from-teal-500 to-cyan-500' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-20 px-4">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center space-y-8">
            <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-100 px-4 py-2 text-sm">
              <Sparkles className="w-4 h-4 mr-1 inline" />
              探索 AI 的无限可能
            </Badge>
            <h1 className="text-6xl md:text-7xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                发现最好的
              </span>
              <br />
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                AI 工具
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              汇集全球优质 AI 工具，助力您的创作和工作效率提升
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                asChild
                size="lg"
                className="h-14 px-8 text-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all"
              >
                <Link href="/tools">
                  开始探索
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-14 px-8 text-lg border-2 hover:border-indigo-600 hover:text-indigo-600"
              >
                <Link href="/pricing">查看定价</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">热门分类</h2>
            <p className="text-xl text-gray-600">浏览不同领域的 AI 工具</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Link key={category.name} href={`/tools?category=${category.name}`}>
                <Card className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
                  <CardContent className="p-6">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform`}>
                      {category.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-indigo-600 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-gray-500">{category.count} 个工具</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">为什么选择我们</h2>
            <p className="text-xl text-gray-600">专业、全面、易用的 AI 工具导航平台</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            准备好探索 AI 的世界了吗？
          </h2>
          <p className="text-xl mb-8 opacity-90">
            立即注册，开始您的 AI 工具探索之旅
          </p>
          <Button
            asChild
            size="lg"
            className="h-14 px-8 text-lg bg-white text-indigo-600 hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all"
          >
            <Link href="/auth/signin">
              免费开始
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-xl">🤖</span>
                </div>
                <span className="text-white font-bold">AI 工具导航</span>
              </div>
              <p className="text-sm">发现和探索最好的 AI 工具</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">产品</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/tools" className="hover:text-white transition-colors">探索工具</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition-colors">定价</Link></li>
                <li><Link href="/api" className="hover:text-white transition-colors">API</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">资源</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/blog" className="hover:text-white transition-colors">博客</Link></li>
                <li><Link href="/docs" className="hover:text-white transition-colors">文档</Link></li>
                <li><Link href="/support" className="hover:text-white transition-colors">支持</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">公司</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="hover:text-white transition-colors">关于我们</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">联系我们</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">隐私政策</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            <p>&copy; 2024 AI 工具导航站. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

