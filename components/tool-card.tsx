'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, ExternalLink, Eye } from 'lucide-react';

interface ToolCardProps {
  tool: {
    id: string;
    name: string;
    slug: string;
    description: string;
    website_url: string;
    logo_url: string;
    pricing_type: string;
    is_featured: boolean;
    view_count: number;
    favorite_count: number;
    tags: string[];
  };
  isFavorited?: boolean;
  onFavoriteToggle?: () => void;
}

export function ToolCard({ tool, isFavorited = false, onFavoriteToggle }: ToolCardProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);

  const handleFavorite = async () => {
    if (!session) {
      router.push('/auth/signin');
      return;
    }
    onFavoriteToggle?.();
  };

  const getPricingColor = (type: string) => {
    switch (type) {
      case 'free':
        return 'bg-green-100 text-green-700 hover:bg-green-100';
      case 'freemium':
        return 'bg-blue-100 text-blue-700 hover:bg-blue-100';
      case 'paid':
        return 'bg-purple-100 text-purple-700 hover:bg-purple-100';
      default:
        return 'bg-gray-100 text-gray-700 hover:bg-gray-100';
    }
  };

  const getPricingLabel = (type: string) => {
    switch (type) {
      case 'free':
        return '免费';
      case 'freemium':
        return '免费试用';
      case 'paid':
        return '付费';
      default:
        return type;
    }
  };

  return (
    <Card
      className="group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {tool.is_featured && (
        <div className="absolute top-0 right-0 bg-gradient-to-br from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
          精选
        </div>
      )}

      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
              <img
                src={tool.logo_url}
                alt={tool.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <CardTitle className="text-lg group-hover:text-indigo-600 transition-colors">
                {tool.name}
              </CardTitle>
              <div className="flex items-center space-x-2 mt-1">
                <Badge className={getPricingColor(tool.pricing_type)}>
                  {getPricingLabel(tool.pricing_type)}
                </Badge>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className={`${
              isFavorited ? 'text-red-500' : 'text-gray-400'
            } hover:text-red-500 transition-colors`}
            onClick={handleFavorite}
          >
            <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <CardDescription className="line-clamp-2 text-sm">
          {tool.description}
        </CardDescription>
        <div className="flex flex-wrap gap-1.5 mt-3">
          {tool.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between">
        <div className="flex items-center space-x-4 text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <Eye className="w-3.5 h-3.5" />
            <span>{tool.view_count}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Heart className="w-3.5 h-3.5" />
            <span>{tool.favorite_count}</span>
          </div>
        </div>
        <Button
          asChild
          size="sm"
          className={`transition-all ${
            isHovered
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
              : ''
          }`}
          variant={isHovered ? 'default' : 'outline'}
        >
          <a href={tool.website_url} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="w-3.5 h-3.5 mr-1" />
            访问
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}

