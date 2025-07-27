// src/utils/audio.ts
import { Howl, Howler } from 'howler';

// Define the sound URLs
const SOUND_URLS = {
  'kick': 'https://raw.githubusercontent.com/Tonejs/Tone.js/master/examples/audio/505/kick.wav',
  'snare': 'https://raw.githubusercontent.com/Tonejs/Tone.js/master/examples/audio/505/snare.wav',
  'hihat': 'https://raw.githubusercontent.com/Tonejs/Tone.js/master/examples/audio/505/hh.wav',
  'clap': 'https://raw.githubusercontent.com/Tonejs/Tone.js/master/examples/audio/505/clap.wav',
  'openhat': 'https://raw.githubusercontent.com/Tonejs/Tone.js/master/examples/audio/505/ohh.wav',
  'perc': 'https://raw.githubusercontent.com/Tonejs/Tone.js/master/examples/audio/505/perc.wav',
  'bass': 'https://raw.githubusercontent.com/Tonejs/Tone.js/master/examples/audio/505/bass.wav',
  'synth': 'https://raw.githubusercontent.com/Tonejs/Tone.js/master/examples/audio/505/synth.wav',
};

// Cache for loaded sounds
const soundCache: { [key: string]: Howl } = {};

// Function to load a single audio sample
const loadSample = (name: string, url: string): Promise<Howl> => {
  return new Promise((resolve, reject) => {
    if (soundCache[name]) {
      resolve(soundCache[name]);
      return;
    }

    const sound = new Howl({
      src: [url],
      html5: true,
      preload: true,
      onload: () => {
        soundCache[name] = sound;
        resolve(sound);
      },
      onend: () => {
        // Optional: clean up or log when sound ends
      },
      onplayerror: (id, error) => {
        console.error(`Error playing sound ${name} (ID: ${id}):`, error);
        reject(new Error(`Error playing sound ${name}: ${error}`));
      },
      onloaderror: (id, error) => {
        console.error(`Error loading sound ${name} (ID: ${id}):`, error);
        reject(new Error(`Error loading sound ${name}: ${error}`));
      },
    });
  });
};

// Function to load all audio samples
export const loadAllSamples = async (): Promise<void> => {
  try {
    const promises = Object.entries(SOUND_URLS).map(([name, url]) =>
      loadSample(name, url)
    );
    await Promise.all(promises);
    console.log('All audio samples loaded successfully.');
  } catch (error) {
    console.error('Error loading audio samples:', error);
  }
};

// Function to play a sound
export const playSound = (name: string, volume: number = 1, rate: number = 1): void => {
  const sound = soundCache[name];
  if (sound) {
    try {
      sound.volume(volume);
      sound.rate(rate);
      sound.play();
    } catch (error) {
      console.error(`Failed to play sound ${name}:`, error);
    }
  } else {
    console.warn(`Sound ${name} not loaded.`);
  }
};

// Function to stop a sound
export const stopSound = (name: string): void => {
  const sound = soundCache[name];
  if (sound) {
    sound.stop();
  }
};

// Function to set global volume
export const setGlobalVolume = (volume: number): void => {
  Howler.volume(volume);
};

// Function to get global volume
export const getGlobalVolume = (): number => {
  return Howler.volume();
};

// Function to unload all sounds (clear cache)
export const unloadAllSounds = (): void => {
  for (const key in soundCache) {
    if (soundCache[key]) {
      soundCache[key].unload();
      delete soundCache[key];
    }
  }
  console.log('All audio samples unloaded.');
};

// Function to get the duration of a loaded sound
export const getSoundDuration = (name: string): number => {
  const sound = soundCache[name];
  return sound ? sound.duration() : 0;
};

// Function to get the current playback position of a sound
export const getSoundCurrentTime = (name: string): number => {
  const sound = soundCache[name];
  return 0; 
};

// Function to seek to a specific position in a sound
export const seekSound = (name: string, seekTime: number): void => {
  const sound = soundCache[name];
  if (sound) {
    sound.seek(seekTime);
  }
};

// Function to check if a sound is currently playing
export const isSoundPlaying = (name: string): boolean => {
  const sound = soundCache[name];
  return sound ? sound.playing() : false;
};

// Function to fade a sound in or out
export const fadeSound = (name: string, from: number, to: number, duration: number): void => {
  const sound = soundCache[name];
  if (sound) {
    sound.fade(from, to, duration);
  }
};

// Function to loop a sound
export const loopSound = (name: string, loop: boolean): void => {
  const sound = soundCache[name];
  if (sound) {
    sound.loop(loop);
  }
};

// Function to get the total duration of all loaded sounds (for debugging/info)
export const getTotalDurationOfAllSounds = (): number => {
  let totalDuration = 0; // Fixed: renamed from 'total' to 'totalDuration' for clarity
  
  try {
    for (const key in soundCache) {
      if (soundCache[key]) {
        const duration = soundCache[key].duration();
        if (typeof duration === 'number' && !isNaN(duration)) {
          totalDuration += duration;
        }
      }
    }
  } catch (error) {
    console.error('Error calculating total duration:', error);
    return 0;
  }
  
  return totalDuration;
};