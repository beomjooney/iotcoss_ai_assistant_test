import { useRef, useState } from 'react';
import videojs from 'video.js';
type Player = videojs.Player;

export function useVideoPlay() {
  const [videos, setVideos] = useState<Player | null>(null);
  const youtubePlayer = useRef<any>(null);

  const handleVideoPlay = (e: any) => {
    const type = e.target ? 'youtube' : 'videojs';
    if (videos) {
      videos.pause();
      videos.hasStarted(false);
      videos.currentTime(0);
    }
    if (youtubePlayer.current?.stopVideo) {
      (youtubePlayer.current.h.id !== e.target?.h.id || !e.target) && youtubePlayer.current.stopVideo();
    }

    if (type === 'videojs') {
      setVideos(() => e);
      youtubePlayer.current = null;
    } else {
      youtubePlayer.current = e.target;
      setVideos(() => null);
    }
  };

  return { videos, youtubePlayer, handleVideoPlay };
}
