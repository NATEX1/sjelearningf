import axios from "axios";
import React, { useRef, useState, useEffect } from "react";
import {
  MdForward10,
  MdFullscreen,
  MdOutlineReplay10,
  MdPlayArrow,
  MdPause,
  MdVolumeUp,
  MdVolumeOff,
} from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const VideoPlayer = ({ src, onPlay, onEnded }) => {
  const { setUser } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const progressRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(100);
  const [progress, setProgress] = useState(0);
  const [isProgressDragging, setIsProgressDragging] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [timeoutId, setTimeoutId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMetadataLoaded, setIsMetadataLoaded] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check for mobile devices
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    // Initial check
    checkMobile();
    
    // Add resize listener
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleMetadataLoaded = () => {
    setIsMetadataLoaded(true);
    setDuration(videoRef.current.duration);
  };

  const handleCanPlay = () => {
    setIsLoading(false);
  };

  const handleVideoClick = () => {
    const video = videoRef.current;
    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleForward = () => {
    videoRef.current.currentTime += 10;
  };

  const handleReplay = () => {
    videoRef.current.currentTime -= 10;
  };

  const handleProgressUpdate = () => {
    const video = videoRef.current;
    const progressValue = (video.currentTime / video.duration) * 100;

    if (!isProgressDragging) {
      setProgress(progressValue);
      setCurrentTime(video.currentTime);
    }
  };

  const handleMouseDownProgress = (e) => {
    setIsProgressDragging(true);
    updateProgress(e);
  };

  const handleTouchStartProgress = (e) => {
    setIsProgressDragging(true);
    updateTouchProgress(e);
  };

  const handleMouseMoveProgress = (e) => {
    if (isProgressDragging) {
      updateProgress(e);
    }
  };

  const handleTouchMoveProgress = (e) => {
    if (isProgressDragging) {
      updateTouchProgress(e);
    }
  };

  const handleMouseUpProgress = () => {
    setIsProgressDragging(false);
  };

  const handleTouchEndProgress = () => {
    setIsProgressDragging(false);
  };

  const updateProgress = (e) => {
    const progressBar = progressRef.current;
    if (progressBar) {
      const rect = progressBar.getBoundingClientRect();
      const clickPosition = (e.clientX - rect.left) / progressBar.offsetWidth;
      const newTime = clickPosition * videoRef.current.duration;

      setProgress(clickPosition * 100);
      videoRef.current.currentTime = newTime;
    }
  };

  const updateTouchProgress = (e) => {
    const progressBar = progressRef.current;
    if (progressBar && e.touches && e.touches[0]) {
      const rect = progressBar.getBoundingClientRect();
      const touchPosition = (e.touches[0].clientX - rect.left) / progressBar.offsetWidth;
      const newTime = touchPosition * videoRef.current.duration;

      setProgress(touchPosition * 100);
      videoRef.current.currentTime = newTime;
    }
  };

  // Handle mouse and touch events for progress bar
  useEffect(() => {
    const progressBar = progressRef.current;

    progressBar.addEventListener("mousedown", handleMouseDownProgress);
    progressBar.addEventListener("mousemove", handleMouseMoveProgress);
    progressBar.addEventListener("mouseup", handleMouseUpProgress);
    progressBar.addEventListener("mouseleave", handleMouseUpProgress);
    
    // Touch events
    progressBar.addEventListener("touchstart", handleTouchStartProgress);
    progressBar.addEventListener("touchmove", handleTouchMoveProgress);
    progressBar.addEventListener("touchend", handleTouchEndProgress);

    return () => {
      progressBar.removeEventListener("mousedown", handleMouseDownProgress);
      progressBar.removeEventListener("mousemove", handleMouseMoveProgress);
      progressBar.removeEventListener("mouseup", handleMouseUpProgress);
      progressBar.removeEventListener("mouseleave", handleMouseUpProgress);
      
      // Remove touch events
      progressBar.removeEventListener("touchstart", handleTouchStartProgress);
      progressBar.removeEventListener("touchmove", handleTouchMoveProgress);
      progressBar.removeEventListener("touchend", handleTouchEndProgress);
    };
  }, [isProgressDragging]);

  const handleVolumeChange = (e) => {
    const volumeValue = e.target.value;
    videoRef.current.volume = volumeValue / 100;
    setVolume(volumeValue);
  };

  const toggleMute = () => {
    if (volume > 0) {
      videoRef.current.volume = 0;
      setVolume(0);
    } else {
      videoRef.current.volume = 1;
      setVolume(100);
    }
  };

  const handleFullscreen = () => {
    const player = playerRef.current;
    if (!isFullscreen) {
      if (player.requestFullscreen) {
        player.requestFullscreen();
      } else if (player.webkitRequestFullscreen) { // Safari
        player.webkitRequestFullscreen();
      } else if (player.msRequestFullscreen) { // IE11
        player.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) { // Safari
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) { // IE11
        document.msExitFullscreen();
      }
    }
  };

  const onFullscreenChange = () => {
    const isFullscreenNow = 
      !!document.fullscreenElement || 
      !!document.webkitFullscreenElement || 
      !!document.msFullscreenElement;
    setIsFullscreen(isFullscreenNow);
    setControlsVisible(!isFullscreenNow);
  };

  const resetControlsTimeout = () => {
    if (timeoutId) clearTimeout(timeoutId);
    setTimeoutId(setTimeout(() => setControlsVisible(false), 3000));
  };

  const handleMouseEnter = () => {
    setControlsVisible(true);
    resetControlsTimeout();
  };

  const handleMouseMove = () => {
    setControlsVisible(true);
    resetControlsTimeout();
  };

  const handleMouseLeave = () => {
    setControlsVisible(false);
    if (timeoutId) clearTimeout(timeoutId);
  };

  const handleTouch = () => {
    setControlsVisible(!controlsVisible);
  };

  useEffect(() => {
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [timeoutId]);

  useEffect(() => {
    document.addEventListener("fullscreenchange", onFullscreenChange);
    document.addEventListener("webkitfullscreenchange", onFullscreenChange);
    document.addEventListener("msfullscreenchange", onFullscreenChange);
    
    return () => {
      document.removeEventListener("fullscreenchange", onFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", onFullscreenChange);
      document.removeEventListener("msfullscreenchange", onFullscreenChange);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;

    const handleWaiting = () => setIsLoading(true);
    const handleSeeking = () => setIsLoading(true);
    const handleSeeked = () => setIsLoading(false);

    video.addEventListener("waiting", handleWaiting);
    video.addEventListener("seeking", handleSeeking);
    video.addEventListener("seeked", handleSeeked);

    return () => {
      video.removeEventListener("waiting", handleWaiting);
      video.removeEventListener("seeking", handleSeeking);
      video.removeEventListener("seeked", handleSeeked);
    };
  }, []);

  useEffect(() => {
    if (duration - currentTime <= 10 && !isPopupVisible) {
      setIsPopupVisible(true);
    } else if (duration - currentTime > 10 && isPopupVisible) {
      setIsPopupVisible(false);
    }
  }, [currentTime, duration]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();

      if (key === " " || key === "k") {
        e.preventDefault();
        handleVideoClick();
      } else if (key === "arrowright") {
        handleForward();
      } else if (key === "arrowleft") {
        handleReplay();
      } else if (key === "arrowup") {
        e.preventDefault();
        if (volume < 100) {
          const newVolume = volume + 10;
          setVolume(newVolume);
          videoRef.current.volume = newVolume / 100;
        }
      } else if (key === "arrowdown") {
        e.preventDefault();
        if (volume > 0) {
          const newVolume = volume - 10;
          setVolume(newVolume);
          videoRef.current.volume = newVolume / 100;
        }
      } else if (key === "f") {
        handleFullscreen();
      } else if (key === "m") {
        toggleMute();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [volume, isPlaying]);

  const goToExercise = async () => {
    try {
      const response = await axios.put(
        `http://localhost:8000/api/lessons/history/${id}`,
        {
          status: "เสร็จสิ้น",
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setUser(response.data.user);
      navigate(`exercises`);
    } catch (error) {
      console.error("Error updating lesson status:", error);
    }
  };

  return (
    <div
      className={`video-player group relative bg-black w-full ${
        isFullscreen ? "fullscreen" : ""
      } ${controlsVisible ? "" : "cursor-none"}`}
      ref={playerRef}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchStart={isMobile ? handleTouch : undefined}
    >
      {(isLoading || !isMetadataLoaded) && (
        <div className="flex justify-center items-center absolute h-full w-full">
          <div className="text-center">
            <span className="loading loading-bars loading-lg text-white mb-4"></span>
          </div>
        </div>
      )}

      {controlsVisible && !isLoading && (
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 z-50">
          <button
            onClick={handleVideoClick}
            className="bg-black bg-opacity-50 rounded-full p-2"
          >
            {!isPlaying ? (
              <MdPlayArrow size={32} color="white" />
            ) : (
              <MdPause size={32} color="white" />
            )}
          </button>
        </div>
      )}

      {isPopupVisible && !isLoading && (
        <div
          className={`absolute ${
            controlsVisible ? "bottom-16" : "bottom-2"
          } transition-all duration-300 right-2 flex items-center justify-center z-[999]`}
        >
          <div>
            <button
              onClick={goToExercise}
              className="border border-white rounded text-white px-4 py-2 text-sm"
            >
              แบบฝึกหัด
            </button>
          </div>
        </div>
      )}

      <video
        ref={videoRef}
        src={src}
        onTimeUpdate={handleProgressUpdate}
        onEnded={onEnded}
        onPlay={onPlay}
        onLoadedData={handleCanPlay}
        onLoadedMetadata={handleMetadataLoaded}
        className={`${
          isFullscreen 
            ? "h-full w-full" 
            : "w-full h-auto max-h-[85vh] aspect-video"
        }`}
        autoPlay
        playsInline // Important for iOS
      ></video>

      <div
        className={`controls absolute bottom-0 left-0 w-full bg-black bg-opacity-75 text-white transition-all duration-300 ${
          controlsVisible ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div
          className="progress-bar bg-gray-700 h-1 mb-1 cursor-pointer relative"
          onMouseDown={handleMouseDownProgress}
          onMouseMove={handleMouseMoveProgress}
          onMouseUp={handleMouseUpProgress}
          onTouchStart={handleTouchStartProgress}
          onTouchMove={handleTouchMoveProgress}
          onTouchEnd={handleTouchEndProgress}
          ref={progressRef}
        >
          <div
            className="bg-purple-600 h-full relative"
            style={{ width: `${progress}%` }}
          >
            <span
              className={`${
                !controlsVisible ? "hidden" : ""
              } absolute -right-2 top-1/2 transform -translate-y-1/2 group-hover:size-3 bg-purple-600 rounded-full transition-all duration-300`}
            ></span>
          </div>
        </div>

        <div className="controls-area p-1 flex justify-between items-center flex-wrap">
          <div className="controls-left flex items-center gap-1 sm:gap-2">
            <button onClick={handleReplay} className="p-1">
              <MdOutlineReplay10 size={isMobile ? 20 : 24} />
            </button>
            <button onClick={handleVideoClick} className="p-1">
              {isPlaying ? 
                <MdPause size={isMobile ? 20 : 24} /> : 
                <MdPlayArrow size={isMobile ? 20 : 24} />
              }
            </button>
            <button onClick={handleForward} className="p-1">
              <MdForward10 size={isMobile ? 20 : 24} />
            </button>
            
            <div className={`volume-control custom-volume-bar flex items-center gap-1 sm:gap-2 ${isMobile ? 'hidden sm:flex' : ''}`}>
              <button onClick={toggleMute}>
                {volume > 0 ? (
                  <MdVolumeUp size={isMobile ? 20 : 24} />
                ) : (
                  <MdVolumeOff size={isMobile ? 20 : 24} />
                )}
              </button>
              <input
                type="range"
                min={0}
                max={100}
                value={volume}
                onChange={handleVolumeChange}
                className="w-16 sm:w-24"
              />
            </div>
          </div>

          <div className="controls-right flex items-center gap-2 sm:gap-4 text-xs sm:text-sm">
            <span>
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
            <button onClick={handleFullscreen} className="p-1">
              <MdFullscreen size={isMobile ? 20 : 24} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;