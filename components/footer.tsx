import Link from 'next/link'
import { Github, Twitter, Linkedin } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <span className="text-2xl font-bold text-brand-gold">TrenderAI</span>
            </Link>
            <p className="text-gray-400 mb-4 max-w-md">
              Discover and analyze trending topics with AI-powered insights. 
              Stay ahead of the curve with real-time trend analysis.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-400 hover:text-brand-gold transition-colors">
                <Github className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-brand-gold transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-brand-gold transition-colors">
                <Linkedin className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/explore" className="text-gray-400 hover:text-brand-gold transition-colors">
                  Explore Trends
                </Link>
              </li>
              <li>
                <Link href="/trends" className="text-gray-400 hover:text-brand-gold transition-colors">
                  Trending Topics
                </Link>
              </li>
              <li>
                <Link href="/alerts" className="text-gray-400 hover:text-brand-gold transition-colors">
                  Smart Alerts
                </Link>
              </li>
              <li>
                <Link href="/saved" className="text-gray-400 hover:text-brand-gold transition-colors">
                  Saved Items
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-gray-400 hover:text-brand-gold transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-brand-gold transition-colors">
                  API Reference
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-brand-gold transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-brand-gold transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2024 TrenderAI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
