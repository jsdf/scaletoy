import React from 'react';
import {Midi} from '@tonejs/midi';
import * as Tonal from '@tonaljs/tonal';

import useLocalStorage from './useLocalStorage';

function usePersistedMidiFile() {
  const [midiJSONObj, setMidiJSONObj] = useLocalStorage(
    'MidiExploderPersistence',
    null
  );

  let midiFile = null;

  if (midiJSONObj != null) {
    try {
      midiFile = new Midi();
      midiFile.fromJSON(midiJSONObj);
    } catch (err) {
      console.error('failed to load midi file', err);
      midiFile = null;
    }
  }

  return [
    midiFile,
    midiFile => {
      setMidiJSONObj(midiFile.toJSON());
    },
  ];
}

export default function MidiExploder(props) {
  const [midiFile, setMidiFile] = usePersistedMidiFile();

  const handleFiles = React.useCallback(
    e => {
      if (!e.currentTarget.files) return;

      const [file] = e.currentTarget.files;

      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          setMidiFile(new Midi(reader.result));
        };
        console.log({file});
        reader.readAsArrayBuffer(file);
      }
    },
    [setMidiFile]
  );

  return (
    <div className="App">
      <label>
        midi file: <input type="file" onChange={handleFiles} />
      </label>
      <pre style={{textAlign: 'left'}}>
        {midiFile && JSON.stringify(midiFile.toJSON(), null, 2)}
      </pre>
    </div>
  );
}
