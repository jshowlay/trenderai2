import { TrendCard } from '@/components/trend-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Filter } from 'lucide-react'

const sampleTrends = [
  {
    id: '1',
    title: 'AI in Healthcare',
    description: 'Artificial intelligence revolutionizing medical diagnostics and patient care',
    category: 'Technology',
    trendScore: 95,
    change: '+12%',
    isPositive: true,
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop'
  },
  {
    id: '2',
    title: 'Sustainable Energy',
    description: 'Renewable energy adoption accelerating globally',
    category: 'Environment',
    trendScore: 87,
    change: '+8%',
    isPositive: true,
    image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&h=300&fit=crop'
  },
  {
    id: '3',
    title: 'Remote Work Evolution',
    description: 'Hybrid work models becoming the new standard',
    category: 'Business',
    trendScore: 82,
    change: '-3%',
    isPositive: false,
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop'
  },
  {
    id: '4',
    title: 'Cryptocurrency Regulation',
    description: 'Global regulatory frameworks for digital assets',
    category: 'Finance',
    trendScore: 78,
    change: '+15%',
    isPositive: true,
    image: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400&h=300&fit=crop'
  }
]

export default function ExplorePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Explore Trends</h1>
        <p className="text-gray-400 mb-6">
          Discover trending topics across technology, business, and more
        </p>
        
        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search trends..."
              className="pl-10 bg-gray-900 border-gray-700 text-white"
            />
          </div>
          <Button variant="outline" className="border-gray-700 text-gray-300">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      {/* Trends Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sampleTrends.map((trend) => (
          <TrendCard key={trend.id} trend={trend} />
        ))}
      </div>

      {/* Load More */}
      <div className="text-center mt-12">
        <Button variant="outline" className="border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-black">
          Load More Trends
        </Button>
      </div>
    </div>
  )
}
