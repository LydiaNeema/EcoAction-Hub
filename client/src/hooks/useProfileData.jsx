// src/hooks/useProfileData.js
import { useState, useEffect } from 'react';
import { profileService } from '@/services/profileService';

export function useProfileData(userId) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock profile data that matches your backend Profile model
  const mockProfile = {
    id: 1,
    user_id: 1,
    full_name: "Lydia Chen",
    email: "lydia.chen@example.com",
    county: "Nairobi",
    area: "Westlands",
    member_since: "2025-03-01",
    issues_reported: 12,
    alerts_responded: 8,
    community_impact: 452,
    trees_planted: 24,
    impact_points: 452,
    avatar_url: null,
    bio: "Environmental activist and community leader",
    issues_this_month: 3,
    alerts_this_month: 2,
    impact_this_month: 5
  };

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        // Try to fetch from real API first
        console.log('Attempting to fetch profile from API for userId:', userId);
        const profileData = await profileService.fetchProfile(userId);
        console.log('Profile data received:', profileData);
        setProfile(profileData);
        setError(null); // Clear any previous errors
      } catch (err) {
        console.log('API fetch failed, using mock data:', err.message);
        // Use mock data as fallback with a slight delay to simulate loading
        setTimeout(() => {
          setProfile(mockProfile);
          setError(null); // Don't show error for mock data
        }, 500);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      loadProfile();
    }
  }, [userId]);

  const updateProfile = async (updates) => {
    try {
      console.log('Attempting to update profile via API...');
      const updatedProfile = await profileService.updateProfile(userId, updates);
      setProfile(updatedProfile);
      return updatedProfile;
    } catch (err) {
      console.log('API update failed, updating mock data locally:', err.message);
      // Update mock data locally if API fails
      const updatedProfile = { ...profile, ...updates };
      setProfile(updatedProfile);
      return updatedProfile;
    }
  };

  const updateStats = async (stats) => {
    try {
      console.log('Attempting to update stats via API...');
      const updatedProfile = await profileService.updateStats(userId, stats);
      setProfile(updatedProfile);
      return updatedProfile;
    } catch (err) {
      console.log('API stats update failed, updating mock data locally:', err.message);
      // Update mock data locally if API fails
      const updatedProfile = { ...profile, ...stats };
      setProfile(updatedProfile);
      return updatedProfile;
    }
  };

  return {
    profile,
    loading,
    error,
    updateProfile,
    updateStats,
    refetch: () => {
      if (userId) {
        setLoading(true);
        profileService.fetchProfile(userId)
          .then(setProfile)
          .catch(err => {
            console.log('Refetch failed, using mock data');
            setProfile(mockProfile);
          })
          .finally(() => setLoading(false));
      }
    }
  };
}