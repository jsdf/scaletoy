import React from 'react';
import {useState, useEffect} from 'react';

import * as Tonal from '@tonaljs/tonal';

import MidiDeviceSelector from './MidiDeviceSelector';
import {Synth} from './Synth';
import {getMessageType} from './midiparse';

// Define a function that takes a list of notes and returns the detected chord
function detectChord(notes) {
  // Convert the notes to pitch classes (C, D, E, etc.)
  const pitchClasses = notes.map((note) => Tonal.Note.pc(note));

  // Use the `Chord.detect` function to detect the chord
  const detectedChord = Tonal.Chord.detect(pitchClasses);

  // Return the detected chord
  return detectedChord;
}

export default function ChordRecogniser({audioApi}) {
  const [midiIn, setMidiIn] = useState(null);

  const [chord, setChord] = useState(null);
  const [pressedKeys, setPressedKeys] = useState(() => []);

  useEffect(() => {
    if (midiIn == null) {
      return;
    }
    midiIn.onmidimessage = (message) => {
      if (audioApi) {
        audioApi.dx7.onMidi(message.data);
      }

      const msgType = getMessageType(message.data[0]);
      switch (msgType) {
        case 'noteOn': {
          const note = Tonal.Note.fromMidi(message.data[1]);
          setPressedKeys((s) => (s.includes(note) ? s : s.concat(note)));
          break;
        }
        case 'noteOff': {
          const note = Tonal.Note.fromMidi(message.data[1]);
          setPressedKeys((s) =>
            s.filter((playingNote) => playingNote !== note)
          );
          break;
        }
        default:
          break;
      }
    };
    return () => {
      midiIn.onmidimessage = null;
    };
  }, [midiIn, audioApi]);

  return (
    <div>
      <Synth />
      <div>
        <MidiDeviceSelector
          type="input"
          selectedPort={midiIn}
          onChange={setMidiIn}
        />
      </div>
      <div>notes: {pressedKeys.join(' ')}</div>
      <div>chord: {chord}</div>
    </div>
  );
}
