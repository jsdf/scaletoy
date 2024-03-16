import React, { useMemo } from 'react';
import { useState, useEffect } from 'react';

import * as Tonal from '@tonaljs/tonal';

import MidiDeviceSelector from './MidiDeviceSelector';
import { loadSynth, loadSynthInstance, Synth, useSynthLayer } from './Synth';
import { getMessageType } from './midiparse';
import { AudioAPI } from './AudioAPI';
import useLocalStorage from './useLocalStorage';
import useValueObserver from './useValueObserver';

// Define a function that takes a list of notes and returns the detected chord
function detectChord(notes: Array<string>) {
  // Convert the notes to pitch classes (C, D, E, etc.)
  const pitchClasses = notes.map((note) => Tonal.Note.pitchClass(note));

  // Use the `Chord.detect` function to detect the chord
  const detectedChord = Tonal.Chord.detect(pitchClasses);

  // Return the detected chord
  return detectedChord;
}

export default function ChordRecogniser({ audioApi }: { audioApi: AudioAPI }) {
  const [midiIn, setMidiIn] = useState<WebMidi.MIDIInput | null>(null);
  const [lastSelectedPortID, setLastSelectedPortID] = useLocalStorage<string | null>('ChordRecogniser-lastSelectedPortID', null)
  useValueObserver(midiIn, (value, prevValue) => {
    setLastSelectedPortID(value?.id ?? null)
  })


  const [pressedKeys, setPressedKeys] = useState<string[]>(() => []);
  const chord = useMemo(() => detectChord(pressedKeys), [pressedKeys])

  const layer2AudioApi = useSynthLayer(audioApi.actx)

  useEffect(() => {
    if (midiIn == null) {
      return;
    }
    midiIn.onmidimessage = (message) => {
      if (audioApi) {
        audioApi.dx7?.onMidi(message.data);
      }
      if (layer2AudioApi) {
        layer2AudioApi.dx7?.onMidi(message.data);
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
      if (midiIn) {
        midiIn.onmidimessage = () => { };
      }
    };
  }, [midiIn, audioApi, layer2AudioApi]);

  return (
    <div>
      <Synth audioApi={audioApi} />
      {layer2AudioApi && <Synth audioApi={layer2AudioApi} />}
      <div>
        <MidiDeviceSelector
          type="input"
          selectedPort={midiIn}
          onChange={setMidiIn}
          initialPortID={lastSelectedPortID}
        />
      </div>
      <div>notes: {pressedKeys.join(' ')}</div>
      <div>chord: {chord}</div>
    </div>
  );
}
