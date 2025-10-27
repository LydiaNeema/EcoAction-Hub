// src/utils/profileHelpers.js
export const getInitials = (name) => {
  if (!name) return 'U';
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
};

export const calculateMemberDuration = (memberSince) => {
  if (!memberSince) return '0 months';
  
  const start = new Date(memberSince);
  const now = new Date();
  const months = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
  return `${months} months`;
};

export const formatLocation = (county, area) => {
  if (area && county) return `${area}, ${county} County`;
  return area || county || 'Location not set';
};