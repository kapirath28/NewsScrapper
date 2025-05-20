const fs = require('fs');
const { exec } = require('child_process');

// Install required packages
console.log('Installing required packages...');
exec('npm install tone', (error) => {
  if (error) {
    console.error('Error installing packages:', error);
    return;
  }

  const { Tone } = require('tone');

  // Create pop sound
  const popSound = new Tone.Synth({
    oscillator: { type: 'sine' },
    envelope: {
      attack: 0.001,
      decay: 0.1,
      sustain: 0,
      release: 0.1
    }
  }).toDestination();

  // Create swipe sound
  const swipeSound = new Tone.Noise({
    type: 'white',
    envelope: {
      attack: 0.005,
      decay: 0.1,
      sustain: 0,
      release: 0.1
    }
  }).toDestination();

  // Create switch sound
  const switchSound = new Tone.MetalSynth({
    frequency: 200,
    envelope: {
      attack: 0.001,
      decay: 0.1,
      sustain: 0,
      release: 0.1
    },
    harmonicity: 5.1,
    modulationIndex: 32,
    resonance: 4000,
    octaves: 1.5
  }).toDestination();

  // Generate and save sounds
  const generateSounds = async () => {
    // Pop sound
    popSound.triggerAttackRelease('C6', '0.1');
    await Tone.Offline(() => {
      popSound.triggerAttackRelease('C6', '0.1');
    }, 0.3);

    // Swipe sound
    swipeSound.start();
    await Tone.Offline(() => {
      swipeSound.start();
    }, 0.3);

    // Switch sound
    switchSound.triggerAttackRelease('C4', '0.1');
    await Tone.Offline(() => {
      switchSound.triggerAttackRelease('C4', '0.1');
    }, 0.3);

    console.log('Sound effects generated successfully!');
    process.exit(0);
  };

  generateSounds().catch(console.error);
}); 