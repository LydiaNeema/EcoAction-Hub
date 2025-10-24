// src/app/profile/page.js
'use client';

import { useState } from 'react';
import { useProfileData } from '@/hooks/useProfileData';
import { useAuth } from '@/context/AuthContext';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { StatsGrid } from '@/components/profile/StatsGrid';
import { AchievementsGrid } from '@/components/profile/AchievementsGrid';
import { ActivityFeed } from '@/components/profile/ActivityFeed';
import { ImpactSummary } from '@/components/profile/ImpactSummary';
import { Separator } from '@/components/ui/separator';

export default function ProfilePage() {
  const { user: authUser, loading: authLoading } = useAuth();
  const userId = authUser?.id || 1; // Use logged-in user's ID or fallback to 1
  const { profile, loading, error, updateProfile } = useProfileData(userId);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async (formData) => {
    setIsSubmitting(true);
    try {
      await updateProfile({
        full_name: formData.name,
        email: formData.email,
        county: formData.county,
        area: formData.area
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="p-8">
          <div className="max-w-5xl mx-auto">
          <div className="animate-pulse space-y-8">
            {/* Profile Header Skeleton */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-6 bg-gray-300 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                </div>
              </div>
            </div>
            
            {/* Stats Grid Skeleton */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="h-8 bg-gray-300 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                </div>
              ))}
            </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="p-8">
          <div className="max-w-5xl mx-auto text-center">
          <div className="bg-gray-100 border border-gray-400 text-gray-900 px-4 py-3 rounded-lg">
            Error loading profile: {error}
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
          >
            Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-8">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Page Header */}
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Profile</h1>
            <p className="text-gray-600">Manage your profile and view your impact</p>
          </div>

          <ProfileHeader
            profile={profile}
            isEditing={isEditing}
            isSubmitting={isSubmitting}
            onEditToggle={() => setIsEditing(!isEditing)}
            onSave={handleSave}
            onCancel={handleCancel}
          />

          <StatsGrid stats={profile} />

          <AchievementsGrid />

          <Separator />

          <ActivityFeed />

          <ImpactSummary stats={profile} />
        </div>
      </div>
    </div>
  );
}
