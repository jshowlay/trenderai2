import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Bell, Plus, Trash2, Settings } from 'lucide-react'

const sampleAlerts = [
  {
    id: '1',
    name: 'AI Technology',
    keywords: ['artificial intelligence', 'machine learning', 'AI'],
    isActive: true,
    frequency: 'Real-time',
    lastTriggered: '2 hours ago'
  },
  {
    id: '2',
    name: 'Cryptocurrency',
    keywords: ['bitcoin', 'ethereum', 'crypto'],
    isActive: true,
    frequency: 'Daily',
    lastTriggered: '1 day ago'
  },
  {
    id: '3',
    name: 'Climate Change',
    keywords: ['climate', 'sustainability', 'renewable energy'],
    isActive: false,
    frequency: 'Weekly',
    lastTriggered: '3 days ago'
  }
]

export default function AlertsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Smart Alerts</h1>
        <p className="text-gray-400 mb-6">
          Set up custom alerts to stay informed about topics that matter to you
        </p>
        
        <Button className="bg-brand-gold text-black hover:bg-yellow-400">
          <Plus className="h-4 w-4 mr-2" />
          Create New Alert
        </Button>
      </div>

      {/* Active Alerts */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {sampleAlerts.map((alert) => (
          <Card key={alert.id} className="bg-gray-900 border-gray-800">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{alert.name}</CardTitle>
                <Switch checked={alert.isActive} />
              </div>
              <CardDescription className="text-gray-400">
                {alert.keywords.join(', ')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Frequency:</span>
                  <span className="text-white">{alert.frequency}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Last Triggered:</span>
                  <span className="text-white">{alert.lastTriggered}</span>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="border-gray-700 text-gray-300">
                    <Settings className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white">
                    <Trash2 className="h-3 w-3 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create Alert Form */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="h-5 w-5 mr-2 text-brand-gold" />
            Create New Alert
          </CardTitle>
          <CardDescription className="text-gray-400">
            Set up a new alert to monitor specific topics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Alert Name
              </label>
              <Input
                placeholder="Enter alert name..."
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Keywords
              </label>
              <Input
                placeholder="Enter keywords separated by commas..."
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div className="flex gap-4">
              <Button className="bg-brand-gold text-black hover:bg-yellow-400">
                Create Alert
              </Button>
              <Button variant="outline" className="border-gray-700 text-gray-300">
                Cancel
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
