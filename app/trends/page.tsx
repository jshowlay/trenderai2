import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, TrendingDown, Activity } from 'lucide-react'

const trendData = [
  {
    category: 'Technology',
    trends: [
      { name: 'AI/ML', score: 95, change: '+12%', direction: 'up' },
      { name: 'Web3', score: 87, change: '+8%', direction: 'up' },
      { name: 'Cybersecurity', score: 82, change: '+5%', direction: 'up' }
    ]
  },
  {
    category: 'Business',
    trends: [
      { name: 'Remote Work', score: 78, change: '-3%', direction: 'down' },
      { name: 'E-commerce', score: 85, change: '+7%', direction: 'up' },
      { name: 'Sustainability', score: 90, change: '+15%', direction: 'up' }
    ]
  },
  {
    category: 'Finance',
    trends: [
      { name: 'Cryptocurrency', score: 88, change: '+10%', direction: 'up' },
      { name: 'ESG Investing', score: 92, change: '+18%', direction: 'up' },
      { name: 'Fintech', score: 86, change: '+6%', direction: 'up' }
    ]
  }
]

export default function TrendsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Trending Topics</h1>
        <p className="text-gray-400">
          Real-time analysis of trending topics across different categories
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {trendData.map((category) => (
          <Card key={category.category} className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-brand-gold">{category.category}</CardTitle>
              <CardDescription className="text-gray-400">
                Top trending topics in {category.category.toLowerCase()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {category.trends.map((trend) => (
                  <div key={trend.name} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {trend.direction === 'up' ? (
                        <TrendingUp className="h-4 w-4 text-green-400" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-400" />
                      )}
                      <div>
                        <p className="font-medium text-white">{trend.name}</p>
                        <p className="text-sm text-gray-400">Score: {trend.score}</p>
                      </div>
                    </div>
                    <div className={`text-sm font-medium ${
                      trend.direction === 'up' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {trend.change}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Analytics Overview */}
      <Card className="mt-8 bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="h-5 w-5 mr-2 text-brand-gold" />
            Analytics Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-brand-gold">1,247</p>
              <p className="text-gray-400">Active Trends</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-400">+23%</p>
              <p className="text-gray-400">Growth Rate</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-400">89.2</p>
              <p className="text-gray-400">Avg Score</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-400">156</p>
              <p className="text-gray-400">Categories</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
