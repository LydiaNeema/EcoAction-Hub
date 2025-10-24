'use client';

import Link from 'next/link';
import Image from 'next/image';
import { AlertTriangle, Bell, Zap } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F6FFF8]">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Image src="/EcoActionlogo.png" alt="EcoAction logo" width={28} height={28} className="object-contain" priority />
              <h1 className="text-xl font-semibold text-gray-800">
                EcoAction
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/auth/signin" className="text-gray-700 hover:text-gray-900 text-sm font-medium">
                Login
              </Link>
              <Link href="/auth/signup" className="bg-[#16A34A] text-white px-5 py-2 rounded-md hover:bg-[#15803D] transition-colors text-sm font-medium">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="relative bg-cover bg-center" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.65), rgba(255,255,255,0.65)), url('/assets/BG.jpg')", backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
      {/* Hero Section */}
      <section className="relative py-24">
        <div className="absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
          <svg viewBox="0 0 1200 400" className="w-full h-full">
            <path d="M-100 120 C 200 0, 800 -20, 1200 140" stroke="#E7ECEF" strokeWidth="28" fill="none" opacity="0.8" />
            <path d="M-120 220 C 200 100, 800 80, 1200 240" stroke="#EEF2F3" strokeWidth="22" fill="none" opacity="0.6" />
            <path d="M-140 320 C 200 200, 800 180, 1200 340" stroke="#F4F6F7" strokeWidth="18" fill="none" opacity="0.45" />
          </svg>
        </div>
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Turn Climate Concern Into Community Action
          </h1>
          <p className="text-lg text-gray-700 mb-10 max-w-3xl mx-auto">
            Join thousands taking climate action — report issues, collaborate on solutions, and respond to emergencies together.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/community" className="border-2 border-gray-800 text-gray-800 px-8 py-3 rounded-md hover:bg-gray-800 hover:text-white transition-all font-medium">
              Learn More
            </Link>
            <Link href="/auth/signup" className="bg-[#16A34A] text-white px-8 py-3 rounded-md hover:bg-[#15803D] transition-all font-medium">
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* Image Gallery */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-lg overflow-hidden shadow-lg h-64 bg-white relative">
            <Image 
              src="/assets/CommunityCleanup.jpg"
              alt="Community Cleanup"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
          <div className="rounded-lg overflow-hidden shadow-lg h-64 bg-white relative">
            <Image 
              src="/assets/FloodResponse.jpg"
              alt="Flood Response"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
          <div className="rounded-lg overflow-hidden shadow-lg h-64 bg-white relative">
            <Image 
              src="/assets/EnvironmentalAction.jpg"
              alt="Environmental Action"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
        </div>
      </section>

      </div>

      {/* How It Works */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-3">
            How EcoAction Hub Works
          </h2>
          <p className="text-gray-600 text-lg">
            Our AI-powered platform connects communities to solve local climate challenges
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Card 1: Emergency Response */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-left">
            <div className="w-12 h-12 mb-4 flex items-center justify-center rounded-full bg-white shadow-md">
              <AlertTriangle className="text-gray-900" size={28} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Emergency Response</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Quickly report local climate issues like flooding, pollution, or wildfire damage with real-time updates.
            </p>
          </div>

          {/* Card 2: Real Time Alerts */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-left">
            <div className="w-12 h-12 mb-4 flex items-center justify-center rounded-full bg-white shadow-md">
              <Bell className="text-gray-900" size={28} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Real Time Alerts</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Get instant alerts for floods, heatwaves, and pollution spikes happening near you.
            </p>
          </div>

          {/* Card 3: Take Action */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-left">
            <div className="w-12 h-12 mb-4 flex items-center justify-center rounded-full bg-white shadow-md">
              <Zap className="text-gray-900" size={28} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Take Action</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Join community-led actions: tree planting, cleanups, and awareness campaigns.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-[#F6FFF8] py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold text-[#16A34A] mb-2">2,000+</p>
              <p className="text-gray-600 text-sm">Reports Processed</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-[#16A34A] mb-2">500+</p>
              <p className="text-gray-600 text-sm">Local Actions</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-[#16A34A] mb-2">15,000+</p>
              <p className="text-gray-600 text-sm">Community Members</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-[#16A34A] mb-2">50+</p>
              <p className="text-gray-600 text-sm">Cities Covered</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">
          Community Impact Stories
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Testimonial 1 */}
          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-gray-600 font-semibold">SM</span>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Sarah M.</p>
                <p className="text-sm text-gray-500">Oakland, CA</p>
              </div>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed">
              "I reported a drainage issue that was causing flooding in my neighborhood. Within a week, the community organized and fixed it together!"
            </p>
          </div>

          {/* Testimonial 2 */}
          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-gray-600 font-semibold">MJ</span>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Marcus J.</p>
                <p className="text-sm text-gray-500">Austin, TX</p>
              </div>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed">
              "The emergency alerts saved my family during the last heatwave. We found cooling centers nearby."
            </p>
          </div>

          {/* Testimonial 3 */}
          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-gray-600 font-semibold">PP</span>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Priya P.</p>
                <p className="text-sm text-gray-500">Seattle, WA</p>
              </div>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed">
              "Joined 5 tree-planting events through the app. It's amazing to see our community come together for a greener future!"
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Ready to make a Difference?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join your community in taking action on climate issues today
          </p>
          <Link href="/auth/signup" className="inline-block bg-[#16A34A] text-white px-8 py-3 rounded-md hover:bg-[#15803D] transition-all font-medium">
            Get Started Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-8">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-gray-500 text-sm">
            © 2025 EcoAction Hub. Building sustainable communities together
          </p>
        </div>
      </footer>
    </div>
  );
}
