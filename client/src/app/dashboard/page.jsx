"use client";
import Navbar from "@/components/Navbar";
import React from 'react';
import { FileText, Users, AlertTriangle, TrendingUp, ArrowRight, Droplets, Flame, Wind } from "lucide-react";
import { dashboardData } from "@/data/dashboardData";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Dashboard() {
  const { user: authUser, loading: authLoading } = useAuth();
  const { aiInsights, recentActivities } = dashboardData;
  
  // Use logged-in user's name or fallback to static data
  const userName = authUser?.full_name?.split(' ')[0] || dashboardData.user.name;

  // Icon mapping
  const iconComponents = {
    FileText, Users, AlertTriangle, Droplets, Flame, Wind
  };

  return (
    <div className="flex min-h-screen  bg-gray-50">
      <Navbar />
      
      {/* Main Content - Fixed Layout */}
      <main className="flex-1 p-8   overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Welcome Section */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {userName}!
            </h1>
            <p className="text-gray-600">
              Here's what's happening in your community today
            </p>
          </div>

          {/* Quick Actions - 3 Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Report Issue Card */}
            <Link href="/reports" className="block">
              <div className="bg-white rounded-xl border-2 border-gray-200 hover:border-gray-400 transition-all cursor-pointer shadow-sm p-6 hover:shadow-md">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-gray-900" />
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Report Issues</h3>
                <p className="text-gray-600 text-sm">Document climate problems in your area</p>
              </div>
            </Link>

            {/* Join Actions Card */}
            <Link href="/community" className="block">
              <div className="bg-white rounded-xl border-2 border-gray-200 hover:border-gray-400 transition-all cursor-pointer shadow-sm p-6 hover:shadow-md">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                    <Users className="w-6 h-6 text-gray-900" />
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Join Actions</h3>
                <p className="text-gray-600 text-sm">Support community projects in your area</p>
              </div>
            </Link>

            {/* View Alerts Card */}
            <Link href="/emergency" className="block">
              <div className="bg-white rounded-xl border-2 border-gray-200 hover:border-gray-400 transition-all cursor-pointer shadow-sm p-6 hover:shadow-md">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-gray-900" />
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">View Alerts</h3>
                <p className="text-gray-600 text-sm">Stay alert to community emergency updates</p>
              </div>
            </Link>
          </div>

          {/* Impact Summary - 4 Cards */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Impact</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Issues Reported */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <p className="text-gray-600 text-sm mb-2">Issues reported</p>
                <p className="text-3xl font-bold text-gray-900 mb-2">12</p>
                <div className="flex items-center text-sm text-gray-500">
                  <TrendingUp className="w-4 h-4 mr-1 text-gray-900" />
                  <span>0.5% worth</span>
                </div>
              </div>

              {/* Actions Joined */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <p className="text-gray-600 text-sm mb-2">Actions joined</p>
                <p className="text-3xl font-bold text-gray-900 mb-2">8</p>
                <div className="flex items-center text-sm text-gray-500">
                  <TrendingUp className="w-4 h-4 mr-1 text-gray-900" />
                  <span>4.5% worth</span>
                </div>
              </div>

              {/* Community Impact */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <p className="text-gray-600 text-sm mb-2">Community impacted</p>
                <p className="text-3xl font-bold text-gray-900 mb-2">452</p>
                <p className="text-sm text-gray-500">0.5% worth</p>
              </div>

              {/* Trees Planted */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <p className="text-gray-600 text-sm mb-2">Trees planted</p>
                <p className="text-3xl font-bold text-gray-900 mb-2">24</p>
                <p className="text-sm text-gray-500">2.5% worth</p>
              </div>
            </div>
          </div>

          {/* AI Insights - 2x2 Grid */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">AI INSIGHTS FOR YOUR AREA</h2>
              <span className="bg-gray-100 text-gray-900 text-xs font-medium px-3 py-1 rounded-full">
                Powered by AI
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {aiInsights.map((insight) => {
                const IconComponent = iconComponents[insight.icon];

                return (
                  <div key={insight.id} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md flex-shrink-0">
                        <IconComponent className="w-5 h-5 text-gray-900" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{insight.title}</h3>
                        <p className="text-gray-600 text-sm">{insight.description}</p>
                      </div>
                    </div>
                    {insight.type === 'event' ? (
                      <Link href="/community">
                        <button className="text-sm bg-[rgba(32,165,41,1)] text-white px-4 py-2 rounded-lg hover:bg-green-800 transition-colors">
                          {insight.buttonText}
                        </button>
                        
                      </Link>
                    ) : (
                      <Link href="/emergency">
                        <button className="text-sm border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                          {insight.buttonText}
                        </button>
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="space-y-6">
                {recentActivities.map((activity) => {
                  const IconComponent = iconComponents[activity.icon];
                  const iconColors = {
                    report: "bg-gray-100 text-gray-900",
                    community: "bg-gray-100 text-gray-900", 
                    alert: "bg-gray-100 text-gray-900"
                  };

                  return (
                    <div key={activity.id} className="flex items-start gap-4 pb-6 border-b border-gray-200 last:border-0 last:pb-0">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${iconColors[activity.type]}`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-gray-900">{activity.title}</span>
                          <span className="text-xs text-gray-500 border border-gray-300 rounded-full px-2 py-1">
                            {activity.time}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{activity.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}