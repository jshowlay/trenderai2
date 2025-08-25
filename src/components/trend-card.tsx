import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TrendingUp, TrendingDown, Bookmark, Share2 } from 'lucide-react'
import Image from 'next/image'

interface Trend {
  id: string
  title: string
  description: string
  category: string
  trendScore: number
  change: string
  isPositive: boolean
  image: string
  savedAt?: string
}

interface TrendCardProps {
  trend: Trend
}

export function TrendCard({ trend }: TrendCardProps) {
  return (
    <Card className="bg-gray-900 border-gray-800 hover:border-brand-gold transition-colors duration-200 overflow-hidden">
      <div className="relative h-48 w-full">
        <Image
          src={trend.image}
          alt={trend.title}
          fill
          className="object-cover"
        />
        <div className="absolute top-2 right-2 flex space-x-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 bg-black/50 hover:bg-black/70 text-white"
          >
            <Bookmark className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 bg-black/50 hover:bg-black/70 text-white"
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
        <div className="absolute bottom-2 left-2">
          <span className="bg-brand-gold text-black px-2 py-1 rounded text-xs font-medium">
            {trend.category}
          </span>
        </div>
      </div>
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg line-clamp-2">{trend.title}</CardTitle>
          <div className="flex items-center space-x-1 ml-2">
            {trend.isPositive ? (
              <TrendingUp className="h-4 w-4 text-green-400" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-400" />
            )}
            <span className={`text-sm font-medium ${
              trend.isPositive ? 'text-green-400' : 'text-red-400'
            }`}>
              {trend.change}
            </span>
          </div>
        </div>
        <CardDescription className="text-gray-400 line-clamp-2">
          {trend.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-brand-gold rounded-full"></div>
            <span className="text-sm text-gray-400">Score: {trend.trendScore}</span>
          </div>
          {trend.savedAt && (
            <span className="text-xs text-gray-500">
              Saved {trend.savedAt}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
