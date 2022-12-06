import React from 'react';
import * as ToneJSMidi from '@tonejs/midi';
import * as Tonal from '@tonaljs/tonal';
import * as Scale from '@tonaljs/scale';
import * as Note from '@tonaljs/note';
import * as Midi from '@tonaljs/midi';
import * as Chord from '@tonaljs/chord';
import * as ScaleDictionary from '@tonaljs/scale-dictionary';
import useLocalStorage from './useLocalStorage';
import useQueryParam, {QUERY_PARAM_FORMATS} from './useQueryParam';
import useValueObserver from './useValueObserver';
import Keyboard from './Keyboard';
import PianoRoll from './PianoRoll';
import Details from './Details';
import simplifyEnharmonics from './simplifyEnharmonics';
import Checkbox from './Checkbox';

const NOTE_ON = 0x90;
const NOTE_OFF = 0x80;
const velocityMidi = 80;

function addEvents(events, newEvents) {
  const updatedEvents = events.concat(newEvents);
  updatedEvents.sort((a, b) => a.time - b.time);
  return updatedEvents;
}

function onTick(events, audioApi, onMidi) {
  let i = 0;
  for (; i < events.length; i++) {
    const nextEvent = events[i];
    if (nextEvent.time > audioApi.actx.currentTime) {
      break;
    }

    onMidi(nextEvent.message);
  }

  return i === 0 ? events : events.slice(i);
}
function playNoteOnOff(events, noteName, start, end) {
  const noteMidi = Tonal.note(noteName).midi;

  let updatedEvents = events;
  return addEvents(updatedEvents, [
    {
      message: [NOTE_ON, noteMidi, velocityMidi],
      time: start,
    },
    {
      message: [NOTE_OFF, noteMidi, velocityMidi],
      time: end,
    },
  ]);
}
export default function TextPlayer({audioApi}) {
  const [textContent, setTextContent] = useLocalStorage(
    'textplayer-content',
    'G3 E3 A3'
  );
  const [bpm, setBpm] = useLocalStorage('textplayer-bpm', 140);

  const [events, setEvents] = React.useState([]);

  const onMidi = React.useMemo(() => {
    if (audioApi.dx7) {
      return (message) => audioApi.dx7.onMidi(message);
    }
    return (message) => {};
  }, [audioApi]);

  React.useEffect(() => {
    // start event-consuming interval
    const id = setInterval(() => {
      setEvents((events) => {
        const updated = onTick(events, audioApi, onMidi);
        // onTick can only remove events
        if (updated.length === events.length) {
          return events;
        }
        return updated;
      });
    }, 1);
    return () => {
      clearInterval(id);
    };
  }, [onMidi, audioApi]);

  const playNotes = React.useCallback(
    (notes) => {
      console.log(notes);
      setEvents((events) => {
        let updatedEvents = events;
        const currentTime = audioApi.actx.currentTime;
        const beatDurationSeconds = (1 / bpm) * 60;
        let lastStartTimeOffset = 0;
        notes.forEach((noteName) => {
          lastStartTimeOffset += beatDurationSeconds;

          updatedEvents = playNoteOnOff(
            updatedEvents,
            noteName,
            currentTime + lastStartTimeOffset,
            currentTime + lastStartTimeOffset + beatDurationSeconds
          );
        });

        return updatedEvents;
      });
    },
    [setEvents, audioApi, bpm]
  );

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
