import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://www.googleapis.com/drive/v3',
});

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('google_access_token');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default axiosInstance;
