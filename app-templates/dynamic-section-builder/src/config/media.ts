/**
 * Media Assets Configuration
 * 
 * Public URLs for media files hosted on Google Cloud Storage.
 * These are public URLs and don't belong in environment variables.
 */

export const MEDIA_CONFIG = {
  // Base URL for all media assets
  baseUrl: 'https://storage.googleapis.com/yourcompany-media',
  
  // Videos
  videos: {
    hero: 'https://storage.googleapis.com/yourcompany-media/videos/hero-video.mp4',
  },
  
  // Images (add as needed)
  images: {
    logo: 'https://storage.googleapis.com/yourcompany-media/images/logo.png',
    teamPhoto: 'https://storage.googleapis.com/yourcompany-media/images/team-photo.jpg',
    // placeholder: 'https://storage.googleapis.com/yourcompany-media/images/placeholder.jpg',
  },
  
  // Documents (add as needed)
  documents: {
    // brochure: 'https://storage.googleapis.com/yourcompany-media/docs/brochure.pdf',
  },
} as const;

// Helper function to get media URL
export const getMediaUrl = (path: string): string => {
  return `${MEDIA_CONFIG.baseUrl}/${path}`;
};

