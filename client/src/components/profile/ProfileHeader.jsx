// src/components/profile/ProfileHeader.js
import { Edit, Mail, MapPin, Calendar } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ProfileForm } from './ProfileForm';
import { getInitials, calculateMemberDuration, formatLocation } from '@/utils/profileHelpers';

export function ProfileHeader({ profile, isEditing, isSubmitting, onEditToggle, onSave, onCancel }) {
  if (isEditing) {
    return (
      <Card className="border-2">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6">
            <Avatar className="w-24 h-24">
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                {getInitials(profile?.full_name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
              <ProfileForm
                initialData={{
                  name: profile?.full_name || '',
                  email: profile?.email || '',
                  county: profile?.county || '',
                  area: profile?.area || ''
                }}
                onSave={onSave}
                onCancel={onCancel}
                isSubmitting={isSubmitting}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2">
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row gap-6">
          <Avatar className="w-24 h-24">
            <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
              {getInitials(profile?.full_name)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="mb-2 text-3xl font-bold">{profile?.full_name || 'User'}</h1>
                <p className="text-muted-foreground">
                  Community Member since {profile?.member_since ? new Date(profile.member_since).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'recently'}
                </p>
              </div>
              <Button variant="outline" onClick={onEditToggle}>
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </div>

            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>{profile?.email || 'No email provided'}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{formatLocation(profile?.county, profile?.area)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Member for {calculateMemberDuration(profile?.member_since)}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}