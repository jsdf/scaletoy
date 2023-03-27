import React from 'react';
import useLocalStorage from './useLocalStorage';
import {Synth} from './Synth';

import {usePlayerTick, usePlayNotes} from './player';

export default function TextPlayer({audioApi}) {
  const [textContent, setTextContent] = useLocalStorage(
    'textplayer-content',
    'G3 E3 A3'
  );
  const [bpm, setBpm] = useLocalStorage('textplayer-bpm', 140);

  const [events, setEvents] = React.useState([]);

  // hardcoded to use dx7 for now
  const onMidi = React.useMemo(() => {
    if (audioApi.dx7) {
      return (message) => audioApi.dx7.onMidi(message);
    }
    return (message) => {};
  }, [audioApi]);

  usePlayerTick(audioApi, onMidi, setEvents);
  const playNotes = usePlayNotes(setEvents, audioApi, bpm);

  function handleClick() {
    const notes = textContent
      .trim()
      .replace(/[^A-z0-9\s#]/g, '')
      .replace(/\s/g, ' ')
      .split(' ');
    if (notes.length) {
      playNotes(
        notes.map((noteName) => {
          if (noteName.match(/\d$/)) {
            return noteName;
          }
          return noteName + '3'; // default octave
        })
      );
    }
  }

  return (
    <div>
      <Synth />
      <div>
        <textarea
          rows={10}
          cols={80}
          onChange={(e) => setTextContent(e.currentTarget.value)}
          value={textContent}
        />
      </div>
      <div>
        <label>
          tempo:
          <input type="text" readOnly value={bpm} disabled size={5} />
          <input
            type="range"
            value={bpm}
            onChange={(e) => {
              setBpm(parseInt(e.currentTarget.value));
            }}
            min={20}
            max={400}
            step={1}
          />
        </label>
      </div>
      <div>
        <button onClick={handleClick}>play</button>
      </div>
      <pre>{JSON.stringify(events, null, 2)}</pre>
    </div>
  );
}
