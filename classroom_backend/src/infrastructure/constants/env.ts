

const getEnv = (key: string, defaultValue?: string): string => {
    const value = process.env[key] || defaultValue;
    if (value === undefined) {
      throw new Error(`missing env variable ${key}`);
    }
    return value;
  };
  
  export const DATABASE_URL = getEnv('DATABASE_URL');
  export const PORT = getEnv('PORT', '4500');
  export const NODE_ENV = getEnv('NODE_ENV');
  export const API_ORIGIN = getEnv('API_ORIGIN');
  export const EMAIL_PASSKEY = getEnv('EMAIL_PASSKEY');
  export const EMAIL = getEnv('EMAIL');
  export const CLIENT_BASE_URL = getEnv('CLIENT_BASE_URL');
  
  // JWT keys
  export const JWT_PRIVATE_KEY_PATH = getEnv('JWT_PRIVATE_KEY_PATH');
  export const JWT_PUBLIC_KEY_PATH = getEnv('JWT_PUBLIC_KEY_PATH');

// Admin
export const ADMIN_EMAIL = getEnv('ADMIN_EMAIL');
export const ADMIN_PASSWORD = getEnv('ADMIN_PASSWORD');
  
  // Cloudinary
  export const CLOUDINARY_CLOUD_NAME = getEnv('CLOUDINARY_CLOUD_NAME');
  export const CLOUDINARY_API_KEY = getEnv('CLOUDINARY_API_KEY');
  export const CLOUDINARY_API_SECRET = getEnv('CLOUDINARY_API_SECRET');
  
  // Zego Cloud
  export const ZEGO_APP_ID = getEnv('ZEGO_APP_ID');
  export const ZEGO_SERVER_SECRET = getEnv('ZEGO_SERVER_SECRET');
  