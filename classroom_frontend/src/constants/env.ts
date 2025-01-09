const getEnv =(key:string,defaultValue?: string):string  =>{
    const value = import.meta.env[key] || defaultValue;
    
    if(value == undefined){
        throw new Error(`missing env variable ${key}`)
    }
    return value;
}

export const BASE_URL = getEnv("VITE_BASE_URL")
export const GOOGLE_AUTH_CLIENT_ID = getEnv("VITE_GOOGLE_AUTH_CLIENT_ID");
export const APP_URL = getEnv('VITE_APP_URL');
export const ZEGO_APP_ID = getEnv('VITE_ZEGO_APP_ID')
export const ZEGO_SERVER_SECRET = getEnv('VITE_ZEGO_SERVER_SECRET')