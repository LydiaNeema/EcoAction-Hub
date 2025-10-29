import { getToken } from '@/utils/auth';
import API_BASE from './apiConfig';

/**
 * Upload Service
 * Handles all file upload operations
 */

const uploadService = {
  /**
   * Upload an image file
   */
  async uploadImage(file, onProgress = null) {
    const token = getToken();
    
    if (!token) {
      throw new Error('Authentication required to upload images');
    }

    // Validate file
    if (!file) {
      throw new Error('No file provided');
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new Error('File size too large. Maximum size is 5MB');
    }

    const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Invalid file type. Please upload PNG, JPG, JPEG, GIF, or WebP images');
    }

    // Create form data
    const formData = new FormData();
    formData.append('image', file);

    // Create XMLHttpRequest for progress tracking
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      // Track upload progress
      if (onProgress) {
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded / event.total) * 100);
            onProgress(progress);
          }
        });
      }

      xhr.addEventListener('load', () => {
        try {
          const response = JSON.parse(xhr.responseText);
          
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(response);
          } else {
            reject(new Error(response.error || 'Upload failed'));
          }
        } catch (error) {
          reject(new Error('Failed to parse response'));
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Network error during upload'));
      });

      xhr.addEventListener('abort', () => {
        reject(new Error('Upload was cancelled'));
      });

      // Configure and send request
      xhr.open('POST', `${API_BASE}/upload/image`);
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      xhr.send(formData);
    });
  },

  /**
   * Delete an uploaded image
   */
  async deleteImage(filename) {
    const token = getToken();
    
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_BASE}/upload/images/${filename}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete image');
    }

    return await response.json();
  },

  /**
   * Get image URL for display
   */
  getImageUrl(filename) {
    if (!filename) return null;
    
    // If filename is already a full URL, return it
    if (filename.startsWith('http')) {
      return filename;
    }
    
    // If it's a relative path, construct the full URL
    return `${API_BASE}/upload/images/${filename}`;
  },

  /**
   * Compress image on client side before upload (optional)
   */
  async compressImage(file, maxWidth = 800, maxHeight = 600, quality = 0.8) {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;
        
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width *= ratio;
          height *= ratio;
        }

        // Set canvas dimensions
        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(resolve, 'image/jpeg', quality);
      };

      img.src = URL.createObjectURL(file);
    });
  },

  /**
   * Validate image file before upload
   */
  validateImage(file) {
    const errors = [];
    
    if (!file) {
      errors.push('No file selected');
      return errors;
    }

    // Check file type
    const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      errors.push('Invalid file type. Please select PNG, JPG, JPEG, GIF, or WebP images');
    }

    // Check file size (5MB limit)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      errors.push('File size too large. Maximum size is 5MB');
    }

    return errors;
  }
};

export default uploadService;
