// Environment configuration for different deployment environments

export const getEnvironmentConfig = () => {
  const hostname = window.location.hostname;
  const protocol = window.location.protocol;
  const port = window.location.port;
  
  // Detect environment
  const isDevelopment = hostname === 'localhost' || hostname === '127.0.0.1';
  const isStaging = hostname.includes('staging') || hostname.includes('preview');
  const isProduction = hostname === 'ourgoal.site' || hostname === 'www.ourgoal.site';
  
  // Base URL configuration
  let baseUrl: string;
  
  if (isDevelopment) {
    baseUrl = `${protocol}//${hostname}${port ? `:${port}` : ''}`;
  } else if (isStaging) {
    baseUrl = `${protocol}//${hostname}`;
  } else {
    baseUrl = 'https://ourgoal.site';
  }
  
  return {
    isDevelopment,
    isStaging,
    isProduction,
    baseUrl,
    hostname,
    protocol,
    port,
    
    // URLs for different purposes
    resetPasswordUrl: `${baseUrl}/reset-password`,
    loginUrl: `${baseUrl}/login`,
    homeUrl: `${baseUrl}/`,
    
    // Environment name for logging
    environmentName: isDevelopment ? 'development' : isStaging ? 'staging' : 'production'
  };
};

// Export commonly used values
export const ENV = getEnvironmentConfig();

// Helper functions
export const isDevelopment = () => ENV.isDevelopment;
export const isProduction = () => ENV.isProduction;
export const getBaseUrl = () => ENV.baseUrl;
export const getResetPasswordUrl = () => ENV.resetPasswordUrl;
