import { useState } from 'react';
import { FiVolume2, FiVolumeX } from 'react-icons/fi';
import { SoundManager } from '../utils/sounds';

export default function SoundToggle() {
  const [isMuted, setIsMuted] = useState(SoundManager.isMuted());

  const toggleSound = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    SoundManager.setMuted(newMuted);
    
    // Play the switch sound only when unmuting
    if (!newMuted) {
      SoundManager.play(SoundManager.Sounds.SWITCH);
    }
  };

  return (
    <button 
      className="sound-toggle"
      onClick={toggleSound}
      aria-label={`${isMuted ? 'Unmute' : 'Mute'} sound effects`}
    >
      <span className="icon">
        {isMuted ? <FiVolumeX /> : <FiVolume2 />}
      </span>
    </button>
  );
} 