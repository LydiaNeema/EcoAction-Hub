"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Navbar from '@/components/Navbar';
import { Search, MapPin, Clock, Leaf, X, Upload, Edit3 } from "lucide-react";
import communityService from '@/services/communityService';
import uploadService from '@/services/uploadService';
import { getToken } from '@/utils/auth';
import { useAuth } from '@/context/AuthContext';

export default function Page() {
  const { refreshUser, user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All categories");
  const [joinedActions, setJoinedActions] = useState(new Set());
  const [allActions, setAllActions] = useState([]);
  const [communityActions, setCommunityActions] = useState([]);
  const [displayedActions, setDisplayedActions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    active_actions: 0,
    total_participants: 0,
    your_actions: 0
  });
  const [itemsToShow, setItemsToShow] = useState(3);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingAction, setEditingAction] = useState(null);

  const categories = ["All categories", "Environment", "Agriculture", "Conservation", "Education"];

  // Fetch data on mount
  useEffect(() => {
    fetchActions();
    fetchStats();
    fetchMyActions();
  }, []);

  // Filter actions when search or category changes
  useEffect(() => {
    filterActions();
  }, [searchTerm, selectedCategory, allActions]);

  // Update displayed actions when filtered actions or items to show changes
  useEffect(() => {
    setDisplayedActions(communityActions.slice(0, itemsToShow));
  }, [communityActions, itemsToShow]);

  const fetchActions = async () => {
    try {
      setLoading(true);
      const data = await communityService.getActions({
        status: 'active'
      });
      setAllActions(data.actions || []);
      setCommunityActions(data.actions || []);
    } catch (err) {
      console.error('Failed to fetch actions:', err);
      // Fallback to static data if API fails
      const fallbackData = [
        {
          id: 1,
          title: "Tree planting",
          description: "Join us to plant 100 native trees and restore the park...",
          location: "Riverside Park, San Francisco",
          date: "2025-10-18T09:00:00",
          participants_count: 25,
          impact_metric: "100 trees, 50 tons CO2/year",
          image: "/CommunityTreeplanting.jpeg",
          category: "Environment"
        },
        {
          id: 2,
          title: "Beach cleanup",
          description: "Help remove plastic waste and debris from our beautiful beach",
          location: "River side Beach, San Francisco",
          date: "2025-10-16T09:00:00",
          participants_count: 40,
          impact_metric: "500kg plastic removed",
          image: "/CoastCleaning.jpeg",
          category: "Environment"
        },
        {
          id: 3,
          title: "Urban Garden Project",
          description: "Help establish a community garden to grow fresh produce",
          location: "Riverside Park, San Francisco",
          date: "2025-10-18T09:00:00",
          participants_count: 15,
          impact_metric: "Fresh produce for 50 families",
          image: "/UrbanGardening.jpeg",
          category: "Agriculture"
        }
      ];
      setAllActions(fallbackData);
      setCommunityActions(fallbackData);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await communityService.getStats();
      setStats(data.stats || { active_actions: 0, total_participants: 0 });
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  const fetchMyActions = async () => {
    try {
      const token = getToken();
      if (!token) {
        // User not logged in, skip fetching joined actions
        return;
      }
      const data = await communityService.getMyActions();
      const actionIds = new Set(data.actions.map(a => a.id));
      setJoinedActions(actionIds);
    } catch (err) {
      console.error('Failed to fetch my actions:', err);
      // If error, user might not be logged in or token expired
    }
  };

  const filterActions = () => {
    let filtered = [...allActions];

    // Filter by category
    if (selectedCategory !== "All categories") {
      filtered = filtered.filter(action => action.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm.trim()) {
      filtered = filtered.filter(action => 
        action.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        action.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        action.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setCommunityActions(filtered);
    setItemsToShow(3); // Reset items to show when filtering
  };

  const handleJoinAction = async (actionId) => {
    const token = getToken();
    if (!token) {
      alert('🔒 You need to be signed in to join community actions. Please sign in or create an account to start making an impact!');
      return;
    }

    try {
      await communityService.joinAction(actionId);
      setJoinedActions(prev => new Set([...prev, actionId]));
      
      // Update the participants count locally in both arrays
      const updateAction = (action) => 
        action.id === actionId 
          ? { ...action, participants_count: (action.participants_count || 0) + 1 }
          : action;
      
      setAllActions(prev => prev.map(updateAction));
      setCommunityActions(prev => prev.map(updateAction));
      
      // Refresh stats and user profile
      fetchStats();
      fetchMyActions();
      refreshUser(); // This will update the dashboard statistics
      
      // Show success message
      const action = communityActions.find(a => a.id === actionId);
      alert(`✅ Great! You've successfully joined "${action?.title}". You'll receive updates about this action and your impact has been recorded.`);
    } catch (err) {
      alert(err.message || 'Failed to join action. Please try again.');
    }
  };

  const handleLeaveAction = async (actionId) => {
    try {
      await communityService.leaveAction(actionId);
      setJoinedActions(prev => {
        const newSet = new Set(prev);
        newSet.delete(actionId);
        return newSet;
      });
      
      // Update the participants count locally in both arrays
      const updateAction = (action) => 
        action.id === actionId 
          ? { ...action, participants_count: Math.max(0, (action.participants_count || 0) - 1) }
          : action;
      
      setAllActions(prev => prev.map(updateAction));
      setCommunityActions(prev => prev.map(updateAction));
      
      // Refresh stats and user profile
      fetchStats();
      fetchMyActions();
      refreshUser(); // This will update the dashboard statistics
      
      const action = communityActions.find(a => a.id === actionId);
      alert(`You have successfully left "${action?.title}". Your participation has been removed, but you can rejoin anytime if you change your mind.`);
    } catch (err) {
      alert(err.message || 'Failed to leave action. Please try again.');
    }
  };

  const handleLoadMore = () => {
    setItemsToShow(prev => prev + 3);
  };

  const handleCreateAction = async (formData) => {
    try {
      await communityService.createAction(formData);
      setShowCreateModal(false);
      // Refresh the actions list and user profile
      fetchActions();
      fetchStats();
      refreshUser(); // This will update the dashboard statistics
      alert('🎉 Your community action has been created successfully! Other community members can now discover and join your initiative.');
    } catch (err) {
      alert(err.message || 'Failed to create action. Please make sure you are logged in.');
    }
  };

  const handleEditAction = (action) => {
    setEditingAction(action);
    setShowEditModal(true);
  };

  const handleUpdateAction = async (formData) => {
    try {
      await communityService.updateAction(editingAction.id, formData);
      setShowEditModal(false);
      setEditingAction(null);
      // Refresh the actions list
      fetchActions();
      fetchStats();
      alert('✅ Your community action has been updated successfully!');
    } catch (err) {
      alert(err.message || 'Failed to update action. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <Navbar />
      
      {/* Main Content */}
      <main className="flex-1 ml-64 overflow-y-auto h-screen">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Community Actions</h1>
              <p className="text-gray-600 mt-1">Join real initiatives and make real difference in your community</p>
            </div>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="bg-[#16A34A] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#15803D]"
            >
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
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">{stats.active_actions || communityActions.length}</div>
              <div className="text-gray-600 text-sm">Active Actions</div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">{stats.total_participants || 0}</div>
              <div className="text-gray-600 text-sm">Total Participants</div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">{joinedActions.size}</div>
              <div className="text-gray-600 text-sm">Your Actions</div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">{communityActions.length}</div>
              <div className="text-gray-600 text-sm">This month</div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            <p className="mt-4 text-gray-600">Loading actions...</p>
          </div>
        )}

        {/* No Results */}
        {!loading && displayedActions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No community actions found. Try adjusting your filters.</p>
          </div>
        )}

        {/* Community Actions Grid */}
        {!loading && displayedActions.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedActions.map((action) => {
                const isJoined = joinedActions.has(action.id);
                return (
                  <div key={action.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300">
                    {/* Image */}
                    <div className="aspect-video relative overflow-hidden">
                      <Image
                        src={uploadService.getImageUrl(action.image)}
                        alt={action.title}
                        width={400}
                        height={250}
                        className="w-full h-full object-cover"
                        priority={action.id <= 3}
                      />
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
                      <div className="flex items-center gap-3 text-gray-700 text-sm mb-3">
                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
                          <Clock className="w-4 h-4 text-gray-900" />
                        </div>
                        <span>{formatDate(action.date)}</span>
                      </div>

                      {/* Participants */}
                      <div className="flex items-center gap-3 text-gray-700 text-sm mb-4">
                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
                          <Leaf className="w-4 h-4 text-gray-900" />
                        </div>
                        <span>{action.participants_count || 0} participants • {action.impact_metric || "Making an impact"}</span>
                      </div>

                      {/* Action Buttons */}
                      <div className="space-y-2">
                        {/* Edit Button - Only show if user created this action */}
                        {user && action.created_by === user.id && (
                          <button 
                            onClick={() => handleEditAction(action)}
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                          >
                            <Edit3 className="w-4 h-4" />
                            EDIT ACTION
                          </button>
                        )}
                        
                        {/* Join/Leave Button */}
                        {isJoined ? (
                          <button 
                            onClick={() => handleLeaveAction(action.id)}
                            className="w-full bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                          >
                            LEAVE ACTION
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleJoinAction(action.id)}
                            className="w-full bg-[#16A34A] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#15803D] transition-colors"
                          >
                            JOIN ACTION
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Load More - Functional */}
            {displayedActions.length < communityActions.length && (
              <div className="text-center mt-8">
                <button 
                  onClick={handleLoadMore}
                  className="bg-white text-gray-700 border border-gray-300 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Load More Actions ({communityActions.length - displayedActions.length} remaining)
                </button>
              </div>
            )}
          </>
        )}
        </div>
      </main>

      {/* Create Action Modal */}
      {showCreateModal && (
        <CreateActionModal 
          onClose={() => setShowCreateModal(false)} 
          onCreate={handleCreateAction}
        />
      )}

      {/* Edit Action Modal */}
      {showEditModal && editingAction && (
        <EditActionModal 
          action={editingAction}
          onClose={() => {
            setShowEditModal(false);
            setEditingAction(null);
          }} 
          onUpdate={handleUpdateAction}
        />
      )}
    </div>
  );
}

// Create Action Modal Component
function CreateActionModal({ onClose, onCreate }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Environment',
    location: '',
    date: '',
    image: '',
    impact_metric: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        setUploading(true);
        
        // Upload the file to the server
        const uploadResult = await uploadService.uploadImage(file);
        
        // Set the uploaded image data
        setUploadedImage({
          file: file,
          url: uploadResult.image_url,
          filename: uploadResult.filename
        });
        
        // Update form data with the server URL
        setFormData({...formData, image: uploadResult.image_url});
        
      } catch (error) {
        alert(`Image upload failed: ${error.message}`);
        console.error('Upload error:', error);
      } finally {
        setUploading(false);
      }
    }
  };

  const removeUploadedImage = async () => {
    if (uploadedImage && uploadedImage.filename) {
      try {
        // Delete the uploaded file from server
        await uploadService.deleteImage(uploadedImage.filename);
      } catch (error) {
        console.error('Failed to delete image:', error);
        // Continue anyway - user can still remove from form
      }
    }
    
    setUploadedImage(null);
    setFormData({...formData, image: ''});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    const requiredFields = [
      { field: 'title', name: 'Action Title' },
      { field: 'description', name: 'Description' },
      { field: 'category', name: 'Category' },
      { field: 'location', name: 'Location' },
      { field: 'date', name: 'Date & Time' }
    ];
    
    for (const { field, name } of requiredFields) {
      if (!formData[field] || formData[field].trim() === '') {
        alert(`Please fill in the ${name} field. All required fields must be completed.`);
        return;
      }
    }
    
    // Validate date is in the future
    const selectedDate = new Date(formData.date);
    const now = new Date();
    if (selectedDate <= now) {
      alert('Please select a future date and time for your action.');
      return;
    }
    
    // Validate title length
    if (formData.title.trim().length < 3) {
      alert('Action title must be at least 3 characters long.');
      return;
    }
    
    // Validate description length
    if (formData.description.trim().length < 10) {
      alert('Description must be at least 10 characters long to provide enough detail.');
      return;
    }
    
    setSubmitting(true);
    try {
      await onCreate(formData);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Create New Action</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Action Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="e.g., Tree Planting Event"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Describe your community action in detail..."
            />
          </div>

          {/* Category and Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="Environment">Environment</option>
                <option value="Agriculture">Agriculture</option>
                <option value="Conservation">Conservation</option>
                <option value="Education">Education</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date & Time *
              </label>
              <input
                type="datetime-local"
                required
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location *
            </label>
            <input
              type="text"
              required
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="e.g., Riverside Park, San Francisco"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Action Image (Optional)
            </label>
            
            {!uploadedImage ? (
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({...formData, image: e.target.value})}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="https://example.com/image.jpg or /image.jpg"
                    disabled={uploading}
                  />
                  <label
                    htmlFor="community-image-upload"
                    className={`px-4 py-2 border border-gray-300 rounded-lg flex items-center gap-2 cursor-pointer transition-colors ${
                      uploading 
                        ? 'bg-gray-100 cursor-not-allowed' 
                        : 'hover:bg-gray-50'
                    }`}
                    title={uploading ? "Uploading..." : "Upload image"}
                  >
                    {uploading ? (
                      <div className="w-4 h-4 border-2 border-gray-300 border-t-green-500 rounded-full animate-spin"></div>
                    ) : (
                      <Upload className="w-4 h-4" />
                    )}
                  </label>
                  <input
                    id="community-image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                </div>
                <p className="text-xs text-gray-500">
                  {uploading ? 'Uploading image...' : 'Enter an image URL or upload a file (max 5MB)'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="relative inline-block">
                  <img
                    src={uploadedImage.url || formData.image}
                    alt="Uploaded preview"
                    className="w-32 h-24 object-cover rounded-lg border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={removeUploadedImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    title="Remove image"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
                <div className="flex gap-2">
                  <label
                    htmlFor="community-image-upload-replace"
                    className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer font-medium"
                  >
                    Replace Image
                  </label>
                  <input
                    id="community-image-upload-replace"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Impact Metric */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expected Impact
            </label>
            <input
              type="text"
              value={formData.impact_metric}
              onChange={(e) => setFormData({...formData, impact_metric: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="e.g., 100 trees planted, 50 tons CO2/year"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-6 py-3 bg-[#16A34A] text-white rounded-lg font-medium hover:bg-[#15803D] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Creating...' : 'Create Action'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Edit Action Modal Component
function EditActionModal({ action, onClose, onUpdate }) {
  const [formData, setFormData] = useState({
    title: action.title || '',
    description: action.description || '',
    category: action.category || 'Environment',
    location: action.location || '',
    date: action.date ? new Date(action.date).toISOString().slice(0, 16) : '',
    image: action.image || '',
    impact_metric: action.impact_metric || ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        setUploading(true);
        
        // Upload the file to the server
        const uploadResult = await uploadService.uploadImage(file);
        
        // Set the uploaded image data
        setUploadedImage({
          file: file,
          url: uploadResult.image_url,
          filename: uploadResult.filename
        });
        
        // Update form data with the server URL
        setFormData({...formData, image: uploadResult.image_url});
        
      } catch (error) {
        alert(`Image upload failed: ${error.message}`);
        console.error('Upload error:', error);
      } finally {
        setUploading(false);
      }
    }
  };

  const removeUploadedImage = async () => {
    if (uploadedImage && uploadedImage.filename) {
      try {
        // Delete the uploaded file from server
        await uploadService.deleteImage(uploadedImage.filename);
      } catch (error) {
        console.error('Failed to delete image:', error);
        // Continue anyway - user can still remove from form
      }
    }
    
    setUploadedImage(null);
    setFormData({...formData, image: ''});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    const requiredFields = [
      { field: 'title', name: 'Action Title' },
      { field: 'description', name: 'Description' },
      { field: 'category', name: 'Category' },
      { field: 'location', name: 'Location' },
      { field: 'date', name: 'Date & Time' }
    ];
    
    for (const { field, name } of requiredFields) {
      if (!formData[field] || formData[field].trim() === '') {
        alert(`Please fill in the ${name} field. All required fields must be completed.`);
        return;
      }
    }
    
    // Validate date is in the future
    const selectedDate = new Date(formData.date);
    const now = new Date();
    if (selectedDate <= now) {
      alert('Please select a future date and time for your action.');
      return;
    }
    
    // Validate title length
    if (formData.title.trim().length < 3) {
      alert('Action title must be at least 3 characters long.');
      return;
    }
    
    // Validate description length
    if (formData.description.trim().length < 10) {
      alert('Description must be at least 10 characters long to provide enough detail.');
      return;
    }
    
    setSubmitting(true);
    try {
      await onUpdate(formData);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Edit Action</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Action Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Tree Planting Event"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Describe your community action in detail..."
            />
          </div>

          {/* Category and Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Environment">Environment</option>
                <option value="Agriculture">Agriculture</option>
                <option value="Conservation">Conservation</option>
                <option value="Education">Education</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date & Time *
              </label>
              <input
                type="datetime-local"
                required
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location *
            </label>
            <input
              type="text"
              required
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Riverside Park, San Francisco"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Action Image (Optional)
            </label>
            
            {!uploadedImage ? (
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({...formData, image: e.target.value})}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://example.com/image.jpg or /image.jpg"
                    disabled={uploading}
                  />
                  <label
                    htmlFor="edit-image-upload"
                    className={`px-4 py-2 border border-gray-300 rounded-lg flex items-center gap-2 cursor-pointer transition-colors ${
                      uploading 
                        ? 'bg-gray-100 cursor-not-allowed' 
                        : 'hover:bg-gray-50'
                    }`}
                    title={uploading ? "Uploading..." : "Upload image"}
                  >
                    {uploading ? (
                      <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                    ) : (
                      <Upload className="w-4 h-4" />
                    )}
                  </label>
                  <input
                    id="edit-image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                </div>
                <p className="text-xs text-gray-500">
                  {uploading ? 'Uploading image...' : 'Enter an image URL or upload a file (max 5MB)'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="relative inline-block">
                  <img
                    src={uploadedImage.url || formData.image}
                    alt="Uploaded preview"
                    className="w-32 h-24 object-cover rounded-lg border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={removeUploadedImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    title="Remove image"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
                <div className="flex gap-2">
                  <label
                    htmlFor="edit-image-upload-replace"
                    className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer font-medium"
                  >
                    Replace Image
                  </label>
                  <input
                    id="edit-image-upload-replace"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Impact Metric */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expected Impact
            </label>
            <input
              type="text"
              value={formData.impact_metric}
              onChange={(e) => setFormData({...formData, impact_metric: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., 100 trees planted, 50 tons CO2/year"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Updating...' : 'Update Action'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
