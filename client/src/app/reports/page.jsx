"use client";
import { useState } from 'react';
import { Icon } from '@iconify/react';
import Navbar from '@/components/Navbar';
import Image from 'next/image';

export default function ReportsPage() {
  const [formData, setFormData] = useState({
    issueType: '',
    location: '',
    description: '',
    images: []
  });

  const issueTypes = [
    'Flooding',
    'Drought',
    'Air Pollution',
    'Water Pollution',
    'Deforestation',
    'Wildfire',
    'Waste Management',
    'Soil Erosion',
    'Heat Damage',
    'Other'
  ];

  // Mock data for recent reports
  const recentReports = [
    {
      id: 1,
      type: 'Flooding',
      location: 'Market St',
      time: '2 hours ago',
      status: 'active'
    },
    {
      id: 2,
      type: 'Heat Damage',
      location: 'Mission District',
      time: '1 day ago',
      status: 'active'
    },
    {
      id: 3,
      type: 'Air Pollution',
      location: 'Downtown',
      time: '3 days ago',
      status: 'resolved'
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }));
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitting report:', formData);
    alert('Report submitted successfully! Our AI will analyze it immediately.');
    setFormData({
      issueType: '',
      location: '',
      description: '',
      images: []
    });
  };

  const getStatusBadge = (status) => {
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
        status === 'active' 
          ? 'bg-green-100 text-green-800' 
          : 'bg-gray-100 text-gray-800'
      }`}>
        {status === 'active' ? 'Active' : 'Resolved'}
      </span>
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Report Environmental Issue</h1>
            <p className="text-gray-600 mt-2">
              Help your community by reporting climate-related issues in your area
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Report Form */}
            <div className="lg:col-span-2 space-y-8">
              {/* Issue Details Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Issue Details</h2>
                <p className="text-gray-600 mb-6">Provide information about the issue you're reporting</p>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Issue Type */}
                  <div>
                    <label htmlFor="issueType" className="block text-sm font-medium text-gray-700 mb-3">
                      Issue Type *
                    </label>
                    <select
                      id="issueType"
                      name="issueType"
                      value={formData.issueType}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select issue type</option>
                      {issueTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  {/* Location */}
                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-3">
                      Location *
                    </label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Address or area name"
                    />
                    <p className="text-sm text-gray-500 mt-2">Auto-detected: San Francisco, CA</p>
                  </div>

                  {/* Description */}
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-3">
                      Description *
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Describe what you observed..."
                    />
                  </div>

                  {/* Photo Evidence */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Photo Evidence (Optional)
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                      />
                      <label
                        htmlFor="image-upload"
                        className="cursor-pointer flex flex-col items-center justify-center"
                      >
                        <Icon icon="lucide:upload" className="w-8 h-8 text-gray-400 mb-3" />
                        <span className="text-sm text-gray-600 font-medium">
                          Click to upload or drag and drop
                        </span>
                        <span className="text-xs text-gray-500 mt-1">
                          PNG, JPG, GIF up to 10MB
                        </span>
                      </label>
                    </div>

                    {/* Preview uploaded images */}
                    {formData.images.length > 0 && (
                      <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                        {formData.images.map((image, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={URL.createObjectURL(image)}
                              alt={`Upload ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Icon icon="lucide:x" className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                    >
                      Submit Report
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Right Column - Guidelines and Recent Reports */}
            <div className="space-y-6">
              {/* Report Guidelines */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Why Report?</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-5 h-5 mt-0.5">
                      <Icon icon="lucide:brain" className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">AI-Powered Analysis</p>
                      <p className="text-sm text-gray-600 mt-1">
                        Our AI instantly analyzes your report to identify patterns and suggest solutions
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-5 h-5 mt-0.5">
                      <Icon icon="lucide:users" className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Community Alerts</p>
                      <p className="text-sm text-gray-600 mt-1">
                        Your report helps alert neighbors about issues in your area
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-5 h-5 mt-0.5">
                      <Icon icon="lucide:trending-up" className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Track Progress</p>
                      <p className="text-sm text-gray-600 mt-1">
                        Monitor how your report leads to community action
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Reports Nearby */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Reports Nearby</h3>
                
                <div className="space-y-3">
                  {recentReports.map(report => (
                    <div key={report.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">
                          {report.type} - {report.location}
                        </p>
                        <p className="text-sm text-gray-500">{report.time}</p>
                      </div>
                      {getStatusBadge(report.status)}
                    </div>
                  ))}
                </div>

                <button className="w-full mt-4 px-4 py-2 text-sm text-blue-600 font-medium border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors">
                  View All Reports
                </button>
              </div>

              {/* Quick Tips */}
              <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">Quick Tips</h3>
                <ul className="space-y-2 text-sm text-blue-800">
                  <li className="flex items-start gap-2">
                    <Icon icon="lucide:check" className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>Be specific about location and timing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon icon="lucide:check" className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>Include photos when possible</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon icon="lucide:check" className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>Note any immediate safety concerns</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}