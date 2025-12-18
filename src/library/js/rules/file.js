/**
 * File Validation Rules
 */

import { isEmptyValue } from '../utils/dom.js';

/**
 * Parse file size string to bytes
 * @param {string|number} size
 * @returns {number}
 */
function parseFileSize(size) {
  if (typeof size === 'number') return size;

  const str = String(size).trim().toUpperCase();
  const match = str.match(/^([\d.]+)\s*(B|KB|MB|GB|TB)?$/);

  if (!match) return parseInt(size, 10) || 0;

  const value = parseFloat(match[1]);
  const unit = match[2] || 'B';

  const units = {
    'B': 1,
    'KB': 1024,
    'MB': 1024 * 1024,
    'GB': 1024 * 1024 * 1024,
    'TB': 1024 * 1024 * 1024 * 1024
  };

  return Math.floor(value * (units[unit] || 1));
}

/**
 * Format bytes to human readable
 * @param {number} bytes
 * @returns {string}
 */
function formatFileSize(bytes) {
  if (bytes === 0) return '0 B';

  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));

  return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + units[i];
}

/**
 * Get files from value (handles FileList, File, or array)
 * @param {*} value
 * @returns {File[]}
 */
function getFiles(value) {
  if (!value) return [];
  if (value instanceof FileList) return Array.from(value);
  if (value instanceof File) return [value];
  if (Array.isArray(value)) return value.filter(f => f instanceof File);
  return [];
}

/**
 * File required
 */
export const fileRequired = {
  message: 'Please select a file',
  validate(value) {
    const files = getFiles(value);
    return files.length > 0;
  }
};

/**
 * Maximum file size
 */
export const fileSize = {
  message: 'File size must not exceed {maxFormatted}',
  validate(value, params) {
    const files = getFiles(value);
    if (files.length === 0) return true;

    const maxSize = parseFileSize(params.max || params.value);
    params.maxFormatted = formatFileSize(maxSize);

    return files.every(file => file.size <= maxSize);
  }
};

/**
 * Minimum file size
 */
export const fileMinSize = {
  message: 'File size must be at least {minFormatted}',
  validate(value, params) {
    const files = getFiles(value);
    if (files.length === 0) return true;

    const minSize = parseFileSize(params.min || params.value);
    params.minFormatted = formatFileSize(minSize);

    return files.every(file => file.size >= minSize);
  }
};

/**
 * File MIME type validation
 */
export const fileType = {
  message: 'File type not allowed. Allowed types: {types}',
  validate(value, params) {
    const files = getFiles(value);
    if (files.length === 0) return true;

    let allowedTypes = params.types || params.value;
    if (typeof allowedTypes === 'string') {
      allowedTypes = allowedTypes.split(',').map(t => t.trim());
    }

    if (!Array.isArray(allowedTypes) || allowedTypes.length === 0) return true;

    return files.every(file => {
      const fileType = file.type.toLowerCase();

      return allowedTypes.some(allowed => {
        allowed = allowed.toLowerCase();

        // Exact match
        if (fileType === allowed) return true;

        // Wildcard match (e.g., "image/*")
        if (allowed.endsWith('/*')) {
          const category = allowed.slice(0, -2);
          return fileType.startsWith(category + '/');
        }

        return false;
      });
    });
  }
};

/**
 * File extension validation
 */
export const fileExtension = {
  message: 'File extension not allowed. Allowed: {extensions}',
  validate(value, params) {
    const files = getFiles(value);
    if (files.length === 0) return true;

    let allowedExts = params.extensions || params.value;
    if (typeof allowedExts === 'string') {
      allowedExts = allowedExts.split(',').map(e => e.trim().toLowerCase().replace(/^\./, ''));
    }

    if (!Array.isArray(allowedExts) || allowedExts.length === 0) return true;

    params.extensions = allowedExts.join(', ');

    return files.every(file => {
      const ext = file.name.split('.').pop().toLowerCase();
      return allowedExts.includes(ext);
    });
  }
};

/**
 * Image files only
 */
export const imageOnly = {
  message: 'Only image files are allowed',
  validate(value) {
    const files = getFiles(value);
    if (files.length === 0) return true;

    return files.every(file => file.type.startsWith('image/'));
  }
};

/**
 * Image dimensions validation
 */
export const imageDimensions = {
  message: 'Image dimensions must be {requirement}',
  async validate(value, params) {
    const files = getFiles(value);
    if (files.length === 0) return true;

    const { minWidth, maxWidth, minHeight, maxHeight, exactWidth, exactHeight } = params;

    // Build requirement message
    const requirements = [];
    if (exactWidth && exactHeight) {
      requirements.push(`exactly ${exactWidth}x${exactHeight}`);
    } else {
      if (minWidth) requirements.push(`min width ${minWidth}px`);
      if (maxWidth) requirements.push(`max width ${maxWidth}px`);
      if (minHeight) requirements.push(`min height ${minHeight}px`);
      if (maxHeight) requirements.push(`max height ${maxHeight}px`);
    }
    params.requirement = requirements.join(', ') || 'within allowed dimensions';

    // Only validate image files
    const imageFiles = files.filter(f => f.type.startsWith('image/'));
    if (imageFiles.length === 0) return true;

    // Check each image
    const results = await Promise.all(imageFiles.map(file => {
      return new Promise(resolve => {
        const img = new Image();
        const url = URL.createObjectURL(file);

        img.onload = () => {
          URL.revokeObjectURL(url);
          const { width, height } = img;

          if (exactWidth && width !== exactWidth) { resolve(false); return; }
          if (exactHeight && height !== exactHeight) { resolve(false); return; }
          if (minWidth && width < minWidth) { resolve(false); return; }
          if (maxWidth && width > maxWidth) { resolve(false); return; }
          if (minHeight && height < minHeight) { resolve(false); return; }
          if (maxHeight && height > maxHeight) { resolve(false); return; }

          resolve(true);
        };

        img.onerror = () => {
          URL.revokeObjectURL(url);
          resolve(false);
        };

        img.src = url;
      });
    }));

    return results.every(r => r);
  }
};

/**
 * Maximum number of files
 */
export const maxFiles = {
  message: 'Maximum {max} files allowed',
  validate(value, params) {
    const files = getFiles(value);
    const max = params.max || params.value || Infinity;
    return files.length <= max;
  }
};

/**
 * Minimum number of files
 */
export const minFiles = {
  message: 'At least {min} files required',
  validate(value, params) {
    const files = getFiles(value);
    if (files.length === 0) return true; // Let required handle empty
    const min = params.min || params.value || 1;
    return files.length >= min;
  }
};

/**
 * Total file size (sum of all files)
 */
export const totalFileSize = {
  message: 'Total file size must not exceed {maxFormatted}',
  validate(value, params) {
    const files = getFiles(value);
    if (files.length === 0) return true;

    const maxSize = parseFileSize(params.max || params.value);
    params.maxFormatted = formatFileSize(maxSize);

    const totalSize = files.reduce((sum, file) => sum + file.size, 0);
    return totalSize <= maxSize;
  }
};

export default {
  fileRequired,
  fileSize,
  fileMinSize,
  fileType,
  fileExtension,
  imageOnly,
  imageDimensions,
  maxFiles,
  minFiles,
  totalFileSize
};
