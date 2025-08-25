import { TrendCard } from '@/components/trend-card'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Bookmark, Share2, Download } from 'lucide-react'

const savedTrends = [
  {
    id: '1',
    title: 'AI in Healthcare',
    description: 'Artificial intelligence revolutionizing medical diagnostics and patient care',
    category: 'Technology',
    trendScore: 95,
    change: '+12%',
    isPositive: true,
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop',
    savedAt: '2024-01-15'
  },
  {
    id: '2',
    title: 'Sustainable Energy',
    description: 'Renewable energy adoption accelerating globally',
    category: 'Environment',
    trendScore: 87,
    change: '+8%',
    isPositive: true,
    image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&h=300&fit=crop',
    savedAt: '2024-01-14'
  },
  {
    id: '3',
    title: 'Remote Work Evolution',
    description: 'Hybrid work models becoming the new standard',
    category: 'Business',
    trendScore: 82,
    change: '-3%',
    isPositive: false,
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop',
    savedAt: '2024-01-13'
  }
]

export default function SavedPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Saved Trends</h1>
        <p className="text-gray-400 mb-6">
          Your collection of bookmarked trends and insights
        </p>
        
        <div className="flex gap-4">
          <Button variant="outline" className="border-gray-700 text-gray-300">
            <Share2 className="h-4 w-4 mr-2" />
            Share Collection
          </Button>
          <Button variant="outline" className="border-gray-700 text-gray-300">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Saved Trends Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {savedTrends.map((trend) => (
          <TrendCard key={trend.id} trend={trend} />
        ))}
      </div>

      {/* Collection Stats */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bookmark className="h-5 w-5 mr-2 text-brand-gold" />
            Collection Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-brand-gold">{savedTrends.length}</p>
              <p className="text-gray-400">Saved Trends</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-400">3</p>
              <p className="text-gray-400">Categories</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-400">88.0</p>
              <p className="text-gray-400">Avg Score</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-400">3 days</p>
              <p className="text-gray-400">Oldest Save</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
