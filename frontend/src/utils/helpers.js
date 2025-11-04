// Utility functions for the frontend application

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const formatTime = (timeString) => {
  return timeString || 'N/A';
};

export const validateUsername = (username) => {
  if (!username) return false;
  const sanitized = sanitizeInput(username);
  return sanitized && !sanitized.includes(' ') && sanitized.length >= 3 && sanitized.length <= 20;
};

export const validatePassword = (password) => {
  return password && password.length >= 6 && password.length <= 50;
};

export const generateSeatLabel = (row, col) => {
  return `${String.fromCharCode(65 + row)}${col + 1}`;
};

export const capitalizeFirst = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const sanitizeInput = (input) => {
  if (!input) return '';
  return input.trim().replace(/[<>"'&]/g, '');
};

export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};