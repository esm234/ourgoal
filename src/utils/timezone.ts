// Timezone utilities for handling time zones consistently
// This helps fix timezone issues between client and server

/**
 * Get the current time in Saudi Arabia timezone (UTC+3)
 * This ensures consistent time handling across the application
 */
export const getSaudiTime = (): Date => {
  // Use proper timezone conversion
  const now = new Date();
  return new Date(now.toLocaleString("en-US", {timeZone: "Asia/Riyadh"}));
};

/**
 * Convert a UTC date to Saudi Arabia timezone
 */
export const convertToSaudiTime = (utcDate: Date | string): Date => {
  const date = typeof utcDate === 'string' ? new Date(utcDate) : utcDate;
  // Convert UTC to Saudi time using proper timezone
  return new Date(date.toLocaleString("en-US", {timeZone: "Asia/Riyadh"}));
};

/**
 * Convert a Saudi Arabia time to UTC for database storage
 */
export const convertToUTC = (saudiDate: Date): Date => {
  // Convert Saudi time to UTC properly
  const utcTime = new Date(saudiDate.toLocaleString("en-US", {timeZone: "UTC"}));
  return utcTime;
};

/**
 * Format date for display in Arabic with Saudi timezone
 */
export const formatSaudiDate = (date: Date | string, options?: Intl.DateTimeFormatOptions): string => {
  // Parse the UTC date from Supabase
  const utcDate = typeof date === 'string' ? new Date(date) : date;

  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
    calendar: 'gregory',
    timeZone: 'Asia/Riyadh' // This automatically converts UTC to Saudi time
  };

  try {
    return utcDate.toLocaleDateString('ar-SA', { ...defaultOptions, ...options });
  } catch (error) {
    // Fallback to English if Arabic fails
    return utcDate.toLocaleDateString('en-US', { ...defaultOptions, ...options });
  }
};

/**
 * Format time for display in Arabic with Saudi timezone
 */
export const formatSaudiTime = (date: Date | string, options?: Intl.DateTimeFormatOptions): string => {
  // Parse the UTC date from Supabase
  const utcDate = typeof date === 'string' ? new Date(date) : date;

  const defaultOptions: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Riyadh' // This automatically converts UTC to Saudi time
  };

  try {
    return utcDate.toLocaleTimeString('ar-SA', { ...defaultOptions, ...options });
  } catch (error) {
    // Fallback to English if Arabic fails
    return utcDate.toLocaleTimeString('en-US', { ...defaultOptions, ...options });
  }
};

/**
 * Format datetime for display in Arabic with Saudi timezone
 */
export const formatSaudiDateTime = (date: Date | string): string => {
  // Parse the UTC date from Supabase
  const utcDate = typeof date === 'string' ? new Date(date) : date;

  try {
    return utcDate.toLocaleString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      calendar: 'gregory',
      timeZone: 'Asia/Riyadh' // This automatically converts UTC to Saudi time
    });
  } catch (error) {
    // Fallback to English if Arabic fails
    return utcDate.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      weekday: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Asia/Riyadh'
    });
  }
};

/**
 * Check if an event is currently active based on Saudi time
 */
export const isEventActiveInSaudiTime = (startTime: string, durationMinutes: number): boolean => {
  const now = new Date();
  const eventStart = new Date(startTime); // UTC from Supabase
  const eventEnd = new Date(eventStart.getTime() + durationMinutes * 60 * 1000);

  return now >= eventStart && now <= eventEnd;
};

/**
 * Check if an event is upcoming based on Saudi time
 */
export const isEventUpcomingInSaudiTime = (startTime: string): boolean => {
  const now = new Date();
  const eventStart = new Date(startTime); // UTC from Supabase

  return now < eventStart;
};

/**
 * Check if an event is finished based on Saudi time
 */
export const isEventFinishedInSaudiTime = (startTime: string, durationMinutes: number): boolean => {
  const now = new Date();
  const eventStart = new Date(startTime); // UTC from Supabase
  const eventEnd = new Date(eventStart.getTime() + durationMinutes * 60 * 1000);

  return now > eventEnd;
};

/**
 * Get time remaining until event starts or ends (in seconds)
 */
export const getTimeRemainingInSaudiTime = (startTime: string, durationMinutes: number): {
  timeToStart: number;
  timeToEnd: number;
  isActive: boolean;
  hasStarted: boolean;
  hasEnded: boolean;
} => {
  const now = new Date();
  const eventStart = new Date(startTime); // UTC from Supabase
  const eventEnd = new Date(eventStart.getTime() + durationMinutes * 60 * 1000);

  const timeToStart = Math.max(0, Math.floor((eventStart.getTime() - now.getTime()) / 1000));
  const timeToEnd = Math.max(0, Math.floor((eventEnd.getTime() - now.getTime()) / 1000));

  const hasStarted = now >= eventStart;
  const hasEnded = now > eventEnd;
  const isActive = hasStarted && !hasEnded;

  return {
    timeToStart,
    timeToEnd,
    isActive,
    hasStarted,
    hasEnded
  };
};
