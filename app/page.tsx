import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, Zap, Target, BarChart3 } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          <span className="text-brand-gold">TrenderAI</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
          Discover and analyze trending topics with AI-powered insights
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="bg-brand-gold text-black hover:bg-yellow-400">
            <Link href="/explore">
              Start Exploring
            </Link>
          </Button>
          <Button variant="outline" size="lg" className="border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-black">
            <Link href="/trends">
              View Trends
            </Link>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <TrendingUp className="h-8 w-8 text-brand-gold mb-2" />
              <CardTitle>Real-time Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-400">
                Track trending topics as they happen with live data feeds
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <Zap className="h-8 w-8 text-brand-gold mb-2" />
              <CardTitle>AI Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-400">
                Get intelligent insights and predictions powered by AI
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <Target className="h-8 w-8 text-brand-gold mb-2" />
              <CardTitle>Smart Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-400">
                Set up custom alerts for topics that matter to you
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <BarChart3 className="h-8 w-8 text-brand-gold mb-2" />
              <CardTitle>Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-400">
                Deep dive into trend analytics and performance metrics
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center">
        <Card className="bg-gray-900 border-brand-gold max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Ready to get started?</CardTitle>
            <CardDescription className="text-gray-400">
              Join thousands of users discovering the next big trends
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild size="lg" className="bg-brand-gold text-black hover:bg-yellow-400">
              <Link href="/explore">
                Explore Trends Now
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
