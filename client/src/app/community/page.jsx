"use client";
import { useState } from "react";
import Image from "next/image";
import Navbar from '@/components/Navbar';
import { Search, Users, Target, Calendar, Leaf, MapPin, Clock, Plus } from "lucide-react";

export default function Page() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All categories");

  const stats = [
    { title: "Active Actions", value: "6", color: "text-gray-900" },
    { title: "Total Participants", value: "453", color: "text-gray-900" },
    { title: "Your Actions", value: "8", color: "text-gray-900" },
    { title: "This month", value: "6", color: "text-gray-900" }
  ];

  const communityActions = [
    {
      id: 1,
      title: "Tree planting",
      description: "Join us to plant 100 native trees and restore the park...",
      location: "Riverside Park, San Francisco",
      date: "Oct 18, 2025, 9:00 AM",
      participants: "100 trees, 50 tons CO2/year",
      image: "/CommunityTreeplanting.jpeg",
      category: "Environment"
    },
    {
      id: 2,
      title: "Beach cleanup",
      description: "Help remove plastic waste and debris from our beautiful beach",
      location: "River side Beach, San Francisco",
      date: "Oct 16, 2025, 9:00 AM",
      participants: "100 trees, 50 tons CO2/year",
      image: "/CoastCleaning.jpeg",
      category: "Environment"
    },
    {
      id: 3,
      title: "Urban Garden Project",
      description: "Help establish a community garden to grow fresh produce",
      location: "Riverside Park, San Francisco",
      date: "Oct 18, 2025, 9:00 AM",
      participants: "100 trees, 50 tons CO2/year",
      image: "/UrbanGardening.jpeg",
      category: "Agriculture"
    }
  ];

  const categories = ["All categories", "Environment", "Agriculture", "Conservation", "Education"];

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <Navbar />
      
      {/* Main Content */}
      <main className="flex-1">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Community Actions</h1>
              <p className="text-gray-600 mt-1">Join real initiatives and make real difference in your community</p>
            </div>
            <button className="bg-[#16A34A] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#15803D]">
              Start New Action
            </button>
          </div>
        </div>

        <div className="px-6 py-6">
        {/* Search and Filter - Single unified card */}
        <div className="bg-white rounded-lg border border-gray-200 p-3 mb-6 flex items-center gap-3">
          <div className="flex-1 relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <Search className="text-gray-400 w-5 h-5" />
            </div>
            <input
              type="text"
              placeholder="Search Actions"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-0 rounded-lg focus:ring-2 focus:ring-green-500 focus:bg-white transition-colors"
            />
          </div>
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="appearance-none bg-gray-50 border-0 rounded-lg px-4 py-2.5 pr-10 focus:ring-2 focus:ring-green-500 focus:bg-white min-w-[180px] cursor-pointer transition-colors"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="text-center">
                <div className={`text-3xl font-bold ${stat.color} mb-2`}>{stat.value}</div>
                <div className="text-gray-600 text-sm">{stat.title}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Community Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {communityActions.map((action) => (
            <div key={action.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300">
              {/* Image */}
              <div className="aspect-video relative overflow-hidden">
                <Image
                  src={action.image}
                  alt={action.title}
                  width={400}
                  height={250}
                  className="w-full h-full object-cover"
                  priority={action.id <= 3}
                />
                <div className="absolute inset-0 bg-black bg-opacity-20"></div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{action.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{action.description}</p>

                {/* Location */}
                <div className="flex items-center gap-3 text-gray-700 text-sm mb-3">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <MapPin className="w-4 h-4 text-gray-900" />
                  </div>
                  <span>{action.location}</span>
                </div>

                {/* Date */}
                <div className="flex items-center gap-3 text-gray-700 text-sm mb-4">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <Clock className="w-4 h-4 text-gray-900" />
                  </div>
                  <span>{action.date}</span>
                </div>

                {/* Impact */}
                <div className="flex items-center gap-3 text-gray-700 text-sm mb-4">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <Leaf className="w-4 h-4 text-gray-900" />
                  </div>
                  <span>{action.participants}</span>
                </div>

                {/* Join Button */}
                <button className="w-full bg-[#16A34A] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#15803D] transition-colors">
                  JOIN ACTION
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-8">
          <button className="bg-white text-gray-700 border border-gray-300 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors">
            Load More Actions
          </button>
        </div>
        </div>
      </main>
    </div>
  );
}
