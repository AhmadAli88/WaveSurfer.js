/*eslint-disable*/
import { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { Card, CardContent, CardHeader, Button, Slider } from '@mui/material';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  ZoomIn, 
  ZoomOut,
  Download,
  Repeat,
} from 'lucide-react';

const AudioWaveform = () => {
  const wavesurferRef = useRef(null);
  const waveformRef = useRef(null);

  // State management
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [zoom, setZoom] = useState(50);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoop, setIsLoop] = useState(false);
  const [speed, setSpeed] = useState(1);

  useEffect(() => {
    // Initialize WaveSurfer
    wavesurferRef.current = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: '#4a9eff',
      progressColor: '#1e429f',
      cursorColor: '#1e429f',
      barWidth: 2,
      height: 100,
    });

    // Load audio file
    wavesurferRef.current.load('/src/assets/audio/1.mp3');

    wavesurferRef.current.on('ready', () => {
      setDuration(wavesurferRef.current.getDuration());
      setIsLoading(false);
    });

    return () => wavesurferRef.current.destroy();
  }, []);

  // Handlers
  const handlePlayPause = () => {
    if (isPlaying) {
      wavesurferRef.current.pause();
    } else {
      wavesurferRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (_, newValue) => {
    wavesurferRef.current.setVolume(newValue);
    setVolume(newValue);
    setIsMuted(newValue === 0);
  };

  const toggleMute = () => {
    if (isMuted) {
      wavesurferRef.current.setVolume(volume);
      setIsMuted(false);
    } else {
      wavesurferRef.current.setVolume(0);
      setIsMuted(true);
    }
  };

  const handleSkipForward = () => {
    wavesurferRef.current.skipForward(5);
  };

  const handleSkipBackward = () => {
    wavesurferRef.current.skipBackward(5);
  };

  const handleZoom = (_, newValue) => {
    wavesurferRef.current.zoom(newValue);
    setZoom(newValue);
  };

  const handleSpeedChange = (newSpeed) => {
    wavesurferRef.current.setPlaybackRate(newSpeed);
    setSpeed(newSpeed);
  };

  const toggleLoop = () => {
    setIsLoop(!isLoop);
  };

  const handleDownload = () => {
    const audioUrl = wavesurferRef.current.getMediaElement().src;
    const link = document.createElement('a');
    link.href = audioUrl;
    link.download = 'audio.mp3';
    link.click();
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader title="Audio Waveform" />
        <CardContent>
          <div ref={waveformRef} className="w-full" />

          <div className="flex justify-between mt-2 text-sm">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>

          <div className="flex items-center justify-center space-x-4 mt-4">
            <Button onClick={handleSkipBackward}>
              <SkipBack className="w-6 h-6" />
            </Button>

            <Button onClick={handlePlayPause}>
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            </Button>

            <Button onClick={handleSkipForward}>
              <SkipForward className="w-6 h-6" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader title="Audio Controls" />
        <CardContent>
          <div className="flex items-center space-x-4">
            <Button onClick={toggleMute}>
              {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
            </Button>
            <Slider
              value={volume}
              max={1}
              step={0.1}
              onChange={handleVolumeChange}
            />
            <Button onClick={toggleLoop} color={isLoop ? 'primary' : 'default'}>
              <Repeat className="w-6 h-6" />
            </Button>
            <Button onClick={handleDownload}>
              <Download className="w-6 h-6" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader title="Playback Speed" />
        <CardContent>
          <div className="flex space-x-2">
            {[0.5, 1, 1.5, 2].map((rate) => (
              <Button
                key={rate}
                onClick={() => handleSpeedChange(rate)}
                variant={speed === rate ? 'contained' : 'outlined'}
              >
                {rate}x
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader title="Zoom Control" />
        <CardContent>
          <div className="flex items-center space-x-4">
            <ZoomOut className="w-6 h-6" />
            <Slider
              value={zoom}
              min={10}
              max={100}
              step={10}
              onChange={handleZoom}
            />
            <ZoomIn className="w-6 h-6" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AudioWaveform;


