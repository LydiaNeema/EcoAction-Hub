import { getToken } from '@/utils/auth';
import { endpoints } from './apiConfig';

class UploadService {
  /**
   * Upload an image file
   * @param {File} file - The image file to upload
   * @returns {Promise<Object>} Upload response with image URL
   */
  async uploadImage(file) {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('Authentication required for image upload');
      }

      // Validate file
      if (!file) {
        throw new Error('No file provided');
      }

      // Check file size (5MB limit)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        throw new Error('File too large. Maximum size is 5MB');
      }

      // Check file type
      const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Invalid file type. Allowed: PNG, JPG, JPEG, GIF, WEBP');
      }

      // Create FormData
      const formData = new FormData();
      formData.append('file', file);

      // Upload file
      const response = await fetch(`${endpoints.upload}/image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      return data;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  }

  /**
   * Delete an uploaded image
   * @param {string} filename - The filename to delete
   * @returns {Promise<Object>} Delete response
   */
  async deleteImage(filename) {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${endpoints.upload}/image/${filename}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Delete failed');
      }

      return data;
    } catch (error) {
      console.error('Delete error:', error);
      throw error;
    }
  }

  /**
   * Get image URL for display
   * @param {string} imagePath - The image path from the database
   * @returns {string} Full image URL
   */
  getImageUrl(imagePath) {
    console.log('🖼️ getImageUrl called with:', imagePath);
    
    if (!imagePath) {
      console.log('🖼️ No image path, using default fallback');
      return '/CommunityTreeplanting.jpeg'; // Default fallback
    }

    // If it's already a full URL, return as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      console.log('🖼️ Full URL detected, returning as-is:', imagePath);
      return imagePath;
    }

    // For uploaded images, use the backend server
    if (imagePath.startsWith('/uploads/') || imagePath.startsWith('uploads/')) {
      // Extract filename from path
      const filename = imagePath.includes('/') ? imagePath.split('/').pop() : imagePath;
      // Use centralized API base but direct uploads path
      const apiBase = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000/api';
      const baseUrl = apiBase.replace('/api', ''); // Remove /api suffix
      const finalUrl = `${baseUrl}/uploads/${filename}`;
      console.log('🖼️ Uploaded image URL generated:', finalUrl);
      console.log('🖼️ API Base:', apiBase);
      console.log('🖼️ Base URL:', baseUrl);
      console.log('🖼️ Filename:', filename);
      return finalUrl;
    }

    // In development, use local paths
    if (!imagePath.startsWith('/')) {
      const localPath = `/${imagePath}`;
      console.log('🖼️ Local path generated:', localPath);
      return localPath;
    }

    console.log('🖼️ Returning path as-is:', imagePath);
    return imagePath;
  }

  /**
   * Extract filename from image URL
   * @param {string} imageUrl - The image URL
   * @returns {string|null} Filename or null if not extractable
   */
  extractFilename(imageUrl) {
    if (!imageUrl || !imageUrl.includes('/uploads/')) {
      return null;
    }

    const parts = imageUrl.split('/uploads/');
    return parts.length > 1 ? parts[1] : null;
  }
}

const uploadService = new UploadService();
export default uploadService;
