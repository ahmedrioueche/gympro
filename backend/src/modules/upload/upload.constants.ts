/**
 * Upload configuration constants
 * These are shared between frontend and backend for validation
 */

// File size limits in bytes
export const UPLOAD_LIMITS = {
  IMAGE_MAX_SIZE: 10 * 1024 * 1024, // 10 MB
  VIDEO_MAX_SIZE: 50 * 1024 * 1024, // 50 MB
  DOCUMENT_MAX_SIZE: 20 * 1024 * 1024, // 20 MB
  DEFAULT_MAX_SIZE: 50 * 1024 * 1024, // 50 MB (fallback)
} as const;

// Allowed MIME types
export const ALLOWED_MIME_TYPES = {
  IMAGE: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
  VIDEO: [
    'video/mp4',
    'video/webm',
    'video/quicktime', // .mov
    'video/x-msvideo', // .avi
  ],
  DOCUMENT: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],
} as const;

// All allowed types combined
export const ALL_ALLOWED_MIME_TYPES = [
  ...ALLOWED_MIME_TYPES.IMAGE,
  ...ALLOWED_MIME_TYPES.VIDEO,
  ...ALLOWED_MIME_TYPES.DOCUMENT,
];

// File extensions for display
export const ALLOWED_EXTENSIONS = {
  IMAGE: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
  VIDEO: ['mp4', 'webm', 'mov', 'avi'],
  DOCUMENT: ['pdf', 'doc', 'docx'],
} as const;

// Helper to get max size for a file type
export const getMaxSizeForMime = (mimeType: string): number => {
  if (ALLOWED_MIME_TYPES.IMAGE.includes(mimeType as any)) {
    return UPLOAD_LIMITS.IMAGE_MAX_SIZE;
  }
  if (ALLOWED_MIME_TYPES.VIDEO.includes(mimeType as any)) {
    return UPLOAD_LIMITS.VIDEO_MAX_SIZE;
  }
  if (ALLOWED_MIME_TYPES.DOCUMENT.includes(mimeType as any)) {
    return UPLOAD_LIMITS.DOCUMENT_MAX_SIZE;
  }
  return UPLOAD_LIMITS.DEFAULT_MAX_SIZE;
};

// Format bytes to human readable
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
