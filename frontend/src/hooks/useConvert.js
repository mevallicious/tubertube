import { useState } from 'react';

export const useConvert = () => {
  const [videoInfo, setVideoInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Replace this with your actual Render URL when you deploy
  const API_BASE_URL ='http://localhost:3000/api/v1/convert';

  const fetchInfo = async (url) => {
    if (!url) return;
    
    setLoading(true);
    setError(null);
    setVideoInfo(null);

    try {
      const response = await fetch(`${API_BASE_URL}/info`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to fetch video information');
      }

      setVideoInfo(result.data);
      
    } catch (err) {
      console.error('[useConvert Error]:', err);
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const downloadAudio = (downloadUrl) => {
    if (!downloadUrl) return;

    const link = document.createElement('a');
    link.href = downloadUrl;
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');
    
  
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return { 
    videoInfo, 
    loading, 
    error, 
    fetchInfo, 
    downloadAudio 
  };
};