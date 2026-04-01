import { useEffect, useRef } from 'react';
import Hls from 'hls.js';

const VideoBackground = () => {
  const videoRef = useRef(null);
  const src = "https://stream.mux.com/NcU3HlHeF7CUL86azTTzpy3Tlb00d6iF3BmCdFslMJYM.m3u8";
//   const poster = "@/assets/bg.png";

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(video);
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src;
    }
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden bg-[#09090b]">
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        // poster={poster}
        className="w-full h-full object-cover opacity-60 scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#09090b]/80 via-transparent to-[#09090b]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_transparent_0%,_rgba(9,9,11,0.4)_70%,_rgba(9,9,11,0.8)_100%)]" />
    </div>
  );
};

export default VideoBackground;
