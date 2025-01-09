import axios from 'axios';
import { BASE_URL } from '../constants/env';
    
const axiosreq = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
  withCredentials:true
});

axiosreq.interceptors.request.use((config)=>{
  if(config.data instanceof FormData){
    config.headers['Content-Type'] = 'multipart/form-data'
  }else{
    config.headers['Content-Type'] = 'application/json'
  }

  return config;
})

export default axiosreq;