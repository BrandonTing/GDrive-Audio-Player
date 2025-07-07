import { useEffect } from 'react';
import { loadGapi } from '../utils/gapiLoader';

export function useLoadGapi() {
  useEffect(() => {
    // 動態載入 gapi.js
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/api.js';
    script.async = true;
    script.defer = true;

    script.onload = () => {
      loadGapi();
    };

    script.onerror = () => {
      console.error('Failed to load gapi.js');
    };

    document.body.appendChild(script);
  }, []);
}
