/**
 * Formats a date as YYYY-MM-DD
 * @param {Date|string|number} date - Date to format
 * @returns {string} Formatted date
 */
export const formatDate = (date) => {
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};

/**
 * Formats a time as HH:MM
 * @param {Date|string|number} date - Date to format
 * @returns {string} Formatted time
 */
export const formatTime = (date) => {
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  
  return `${hours}:${minutes}`;
};

/**
 * Formats a date and time as YYYY-MM-DD HH:MM
 * @param {Date|string|number} date - Date to format
 * @returns {string} Formatted date and time
 */
export const formatDateTime = (date) => {
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  
  return `${formatDate(d)} ${formatTime(d)}`;
};

/**
 * Formats a date in a human-readable format
 * @param {Date|string|number} date - Date to format
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date
 */
export const formatReadableDate = (date, options = {}) => {
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  
  return new Intl.DateTimeFormat('en-US', { ...defaultOptions, ...options }).format(d);
};

/**
 * Formats a time in a human-readable format
 * @param {Date|string|number} date - Date to format
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted time
 */
export const formatReadableTime = (date, options = {}) => {
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  
  const defaultOptions = {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  };
  
  return new Intl.DateTimeFormat('en-US', { ...defaultOptions, ...options }).format(d);
};

/**
 * Formats a date and time in a human-readable format
 * @param {Date|string|number} date - Date to format
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date and time
 */
export const formatReadableDateTime = (date, options = {}) => {
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  };
  
  return new Intl.DateTimeFormat('en-US', { ...defaultOptions, ...options }).format(d);
};

/**
 * Converts a timestamp to a Date object
 * @param {number} timestamp - Timestamp in seconds
 * @returns {Date} Date object
 */
export const timestampToDate = (timestamp) => {
  // Check if timestamp is in seconds (10 digits) and convert to milliseconds if needed
  const timestampMs = timestamp.toString().length === 10 ? timestamp * 1000 : timestamp;
  return new Date(timestampMs);
};

/**
 * Converts a Date object to a timestamp in seconds
 * @param {Date} date - Date object
 * @returns {number} Timestamp in seconds
 */
export const dateToTimestamp = (date) => {
  return Math.floor(date.getTime() / 1000);
};

/**
 * Gets the zodiac sign based on birth date
 * @param {Date|string|number} date - Birth date
 * @returns {Object} Zodiac sign information
 */
export const getZodiacSign = (date) => {
  const d = new Date(date);
  if (isNaN(d.getTime())) return null;
  
  const month = d.getMonth() + 1;
  const day = d.getDate();
  
  const zodiacSigns = [
    { name: 'Capricorn', symbol: '♑', element: 'Earth', index: 9 },
    { name: 'Aquarius', symbol: '♒', element: 'Air', index: 10 },
    { name: 'Pisces', symbol: '♓', element: 'Water', index: 11 },
    { name: 'Aries', symbol: '♈', element: 'Fire', index: 0 },
    { name: 'Taurus', symbol: '♉', element: 'Earth', index: 1 },
    { name: 'Gemini', symbol: '♊', element: 'Air', index: 2 },
    { name: 'Cancer', symbol: '♋', element: 'Water', index: 3 },
    { name: 'Leo', symbol: '♌', element: 'Fire', index: 4 },
    { name: 'Virgo', symbol: '♍', element: 'Earth', index: 5 },
    { name: 'Libra', symbol: '♎', element: 'Air', index: 6 },
    { name: 'Scorpio', symbol: '♏', element: 'Water', index: 7 },
    { name: 'Sagittarius', symbol: '♐', element: 'Fire', index: 8 }
  ];
  
  // Determine zodiac sign based on month and day
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) {
    return zodiacSigns[1]; // Aquarius
  } else if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) {
    return zodiacSigns[2]; // Pisces
  } else if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) {
    return zodiacSigns[3]; // Aries
  } else if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) {
    return zodiacSigns[4]; // Taurus
  } else if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) {
    return zodiacSigns[5]; // Gemini
  } else if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) {
    return zodiacSigns[6]; // Cancer
  } else if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) {
    return zodiacSigns[7]; // Leo
  } else if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) {
    return zodiacSigns[8]; // Virgo
  } else if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) {
    return zodiacSigns[9]; // Libra
  } else if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) {
    return zodiacSigns[10]; // Scorpio
  } else if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) {
    return zodiacSigns[11]; // Sagittarius
  } else {
    return zodiacSigns[0]; // Capricorn
  }
}; 