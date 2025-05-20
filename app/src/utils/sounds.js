// Create Audio Context
let audioContext;
try {
  audioContext = new (window.AudioContext || window.webkitAudioContext)();
} catch (e) {
  console.warn('Web Audio API is not supported in this browser');
}

// Global mute state
let isMuted = false;

const createPopSound = () => {
  if (!audioContext) return;
  
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
  gainNode.gain.setValueAtTime(0, audioContext.currentTime);
  gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01);
  gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.1);
  
  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.1);
};

const createSwipeSound = () => {
  if (!audioContext) return;
  
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
  oscillator.frequency.linearRampToValueAtTime(600, audioContext.currentTime + 0.1);
  gainNode.gain.setValueAtTime(0, audioContext.currentTime);
  gainNode.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + 0.02);
  gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.1);
  
  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.1);
};

const createSwitchSound = () => {
  if (!audioContext) return;
  
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.type = 'square';
  oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
  oscillator.frequency.linearRampToValueAtTime(400, audioContext.currentTime + 0.1);
  gainNode.gain.setValueAtTime(0, audioContext.currentTime);
  gainNode.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + 0.02);
  gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.1);
  
  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.1);
};

export const SoundManager = {
  // Play a sound effect
  play: (soundName) => {
    if (isMuted || !audioContext) return;
    
    // Resume audio context if it's suspended (browser autoplay policy)
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }
    
    switch (soundName) {
      case 'POP':
        createPopSound();
        break;
      case 'SWIPE':
        createSwipeSound();
        break;
      case 'SWITCH':
        createSwitchSound();
        break;
    }
  },

  // Set global mute state
  setMuted: (muted) => {
    isMuted = muted;
  },

  // Get current mute state
  isMuted: () => isMuted,

  // Sound effect names
  Sounds: {
    POP: 'POP',
    SWIPE: 'SWIPE',
    SWITCH: 'SWITCH'
  }
}; 