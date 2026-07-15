import { API_URL } from './config';

const originalFetch = window.fetch;

window.fetch = async function () {
  let [resource, config] = arguments;
  
  // If the resource is a string and hits our API (either starts with /api or has API_URL/api)
  if (typeof resource === 'string' && (resource.startsWith('/api/') || resource.includes('/api/'))) {
    
    // Ensure the URL points to the absolute API_URL if it's currently a relative path
    // Note: If API_URL is empty (local dev), this just preserves the relative path
    if (resource.startsWith('/api/') && API_URL) {
      resource = `${API_URL}${resource}`;
    }

    // Ensure cross-domain cookies (JWT) are sent to the backend
    config = config || {};
    config.credentials = 'include';
  }
  
  return originalFetch.call(this, resource, config);
};
