// Security utility functions

/**
 * Sanitize user input to prevent XSS attacks
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

/**
 * Validate URL format
 */
export const isValidUrl = (url) => {
  if (!url) return true; // Optional URLs are valid
  
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
};

/**
 * Validate email format
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Check if token is expired
 */
export const isTokenExpired = (token) => {
  if (!token) return true;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

/**
 * Auto-logout on token expiration
 */
export const checkTokenExpiration = () => {
  const token = localStorage.getItem('adminToken');
  
  if (isTokenExpired(token)) {
    localStorage.removeItem('adminToken');
    window.location.href = '/admin/login';
    return false;
  }
  
  return true;
};

/**
 * Rate limiting for form submissions
 */
const requestTimestamps = new Map();

export const rateLimit = (key, limitMs = 5000) => {
  const now = Date.now();
  const lastRequest = requestTimestamps.get(key);
  
  if (lastRequest && now - lastRequest < limitMs) {
    const waitTime = Math.ceil((limitMs - (now - lastRequest)) / 1000);
    throw new Error(`Please wait ${waitTime} seconds before trying again`);
  }
  
  requestTimestamps.set(key, now);
  return true;
};