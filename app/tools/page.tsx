'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ToolCard } from '@/components/tool-card';
import { Search, Filter } from 'lucide-react';

// Mock data - 在实际应用中应该从 Supabase 获取
const mockTools = [
  {
    id: '1',
    name: 'Midjourney',
    slug: 'midjourney',
    description: '强大的 AI 图像生成工具',
    website_url: 'https://www.midjourney.com',
    logo_url: 'https://placehold.co/100x100/6366f1/white?text=MJ',
    pricing_type: 'paid',
    is_featured: true,
    view_count: 12500,
    favorite_count: 850,
    tags: ['图像生成', 'AI艺术', '创意设计'],
    category: '图像生成',
  },
  {
    id: '2',
    name: 'ChatGPT',
    slug: 'chatgpt',
    description: '强大的对话式 AI 助手',
    website_url: 'https://chat.openai.com',
    logo_url: 'https://placehold.co/100x100/10a37f/white?text=GPT',
    pricing_type: 'freemium',
    is_featured: true,
    view_count: 25000,
    favorite_count: 1500,
    tags: ['对话AI', '文本生成', '代码助手'],
    category: '文本生成',
  },
  {
    id: '3',
    name: 'GitHub Copilot',
    slug: 'github-copilot',
    description: 'AI 编程助手',
    website_url: 'https://github.com/features/copilot',
    logo_url: 'https://placehold.co/100x100/24292e/white?text=GH',
    pricing_type: 'paid',
    is_featured: true,
    view_count: 18000,
    favorite_count: 920,
    tags: ['代码补全', '编程助手', '开发工具'],
    category: '代码助手',
  },
  {
    id: '4',
    name: 'Runway',
    slug: 'runway',
    description: 'AI 视频生成和编辑平台',
    website_url: 'https://runwayml.com',
    logo_url: 'https://placehold.co/100x100/8b5cf6/white?text=RW',
    pricing_type: 'freemium',
    is_featured: false,
    view_count: 8500,
    favorite_count: 450,
    tags: ['视频生成', '视频编辑', 'AI特效'],
    category: '视频处理',
  },
  {
    id: '5',
    name: 'ElevenLabs',
    slug: 'elevenlabs',
    description: 'AI 语音合成工具',
    website_url: 'https://elevenlabs.io',
    logo_url: 'https://placehold.co/100x100/ec4899/white?text=11',
    pricing_type: 'freemium',
    is_featured: false,
    view_count: 6200,
    favorite_count: 380,
    tags: ['语音合成', 'TTS', '音频生成'],
    category: '音频处理',
  },
  {
    id: '6',
    name: 'Tableau AI',
    slug: 'tableau-ai',
    description: 'AI 驱动的数据分析平台',
    website_url: 'https://www.tableau.com',
    logo_url: 'https://placehold.co/100x100/0ea5e9/white?text=TB',
    pricing_type: 'paid',
    is_featured: false,
    view_count: 5800,
    favorite_count: 290,
    tags: ['数据可视化', '商业智能', 'AI分析'],
    category: '数据分析',
  },
];

export default function ToolsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredTools, setFilteredTools] = useState(mockTools);

  const categories = [
    { value: 'all', label: '全部' },
    { value: '图像生成', label: '图像生成' },
    { value: '文本生成', label: '文本生成' },
    { value: '视频处理', label: '视频处理' },
    { value: '音频处理', label: '音频处理' },
    { value: '代码助手', label: '代码助手' },
    { value: '数据分析', label: '数据分析' },
  ];

  useEffect(() => {
    let filtered = mockTools;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(tool => tool.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(tool =>
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    setFilteredTools(filtered);
  }, [searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            探索 AI 工具
          </h1>
          <p className="text-xl text-gray-600">
            发现 {mockTools.length} 个优质 AI 工具
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="搜索工具名称、描述或标签..."
              className="pl-12 h-14 text-lg border-2 focus:border-indigo-600"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
            <TabsList className="w-full justify-start overflow-x-auto flex-wrap h-auto p-1 bg-white">
              {categories.map((category) => (
                <TabsTrigger
                  key={category.value}
                  value={category.value}
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white"
                >
                  {category.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            找到 <span className="font-semibold text-indigo-600">{filteredTools.length}</span> 个工具
          </p>
        </div>

        {/* Tools Grid */}
        {filteredTools.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-semibold mb-2">未找到相关工具</h3>
            <p className="text-gray-600 mb-6">
              尝试调整搜索关键词或筛选条件
            </p>
            <Button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            >
              重置筛选
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

