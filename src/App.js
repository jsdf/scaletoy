import React from 'react';
import logo from './logo.svg';
import './App.css';
import * as Tonal from '@tonaljs/tonal';
import * as Scale from '@tonaljs/scale';
import * as Chord from '@tonaljs/chord';

/* global initDX7 */

function transposeByOctaves(note, shift) {
  return `${note.pc}${note.oct + shift}`;
}

function getChordsBySize(chords, key) {
  return chords
    .map(chordType => Chord.chord(`${key}${chordType}`))
    .sort((a, b) => a.intervals.length - b.intervals.length)
    .map(chord => `${chord.tonic}${chord.aliases[0]}`);
}

const majorScaleChordTypes = [
  'major',
  'minor',
  'minor',
  'major',
  'major',
  'minor',
  'diminished',
];

const scalePosName = ['I', 'ii', 'iii', 'VI', 'V', 'vi', 'vii*'];

function getMajorScaleChords(key) {
  return Scale.scale(key + ' major').notes.map((pc, pos) =>
    getChordsBySize(Scale.scaleChords(majorScaleChordTypes[pos]), pc)
  );
}

function makeScaleDependentData(key = 'c') {
  const scaleType = 'major';
  const scalePitchClasses = Scale.scale(`${key} ${scaleType}`).notes;
  const scalePosChords = new Map(
    getMajorScaleChords(key).map((chordNames, pos) => {
      return [
        pos,

        chordNames
          .map(chordName => {
            const chord = Chord.chord(chordName);
            return {
              chord,
              chordName,
              size:
                chord.intervals.length * (chord.quality === 'Unknown' ? -1 : 1),
            };
          })
          .filter(chordData => chordData.chord.quality !== 'Unknown'),
      ];
    })
  );

  const sizes = new Set();

  scalePosChords.forEach((chordDatas, pos) => {
    chordDatas.forEach(chordData => {
      sizes.add(chordData.size);
    });
  });

  return {
    scaleType,
    key,
    scalePitchClasses,
    scalePosChords,
    sizes: Array.from(sizes).sort((a, b) => a - b),
  };
}

const buttonStyle = {
  border: 'solid 1px #ccc',
  // height: 40,
  display: 'block',
  width: '100%',
  cursor: 'pointer',
};

const bpm = 90;
const beatDurationSeconds = (1 / bpm) * 60;

const NOTE_ON = 0x90;
const NOTE_OFF = 0x80;
const velocityMidi = 80;

const TEST_PLAY_SCALE = false;

function onTick(events, dx7api) {
  let i = 0;
  for (; i < events.length; i++) {
    const nextEvent = events[i];
    if (nextEvent.time > dx7api.actx.currentTime) {
      break;
    }

    dx7api.dx7.onMidi(nextEvent.message);
  }

  return i === 0 ? events : events.slice(i);
}

function playNote(events, noteName, start, end) {
  const noteMidi = Tonal.note(noteName).midi;

  let updatedEvents = events;
  // end any upcoming events for this key
  events.forEach(ev => {
    if (ev.message[1] == noteMidi) {
      ev.time = start - 0.01;
      ev.message[0] = NOTE_OFF;
    }
  });
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

function addEvents(events, newEvents) {
  const updatedEvents = events.concat(newEvents);
  updatedEvents.sort((a, b) => a.time - b.time);
  return updatedEvents;
}

function makeOctaveScaleNoteSequence() {
  const scaleNotes = Scale.scale('c4 major').notes;

  scaleNotes.push(transposeByOctaves(Tonal.note(scaleNotes[0]), 1));

  return scaleNotes;
}

function App() {
  const dx7Ref = React.useRef(null);
  const resumeAudio = React.useCallback(
    () => dx7Ref.current && dx7Ref.current.actx.resume(),
    [dx7Ref.current]
  );
  const suspendAudio = React.useCallback(
    () => dx7Ref.current && dx7Ref.current.actx.suspend(),
    [dx7Ref.current]
  );

  const [scaleData, setScaleData] = React.useState(makeScaleDependentData('c'));

  const [events, setEvents] = React.useState([]);

  const playScale = React.useCallback(() => {
    setEvents(events => {
      const actx = dx7Ref.current ? dx7Ref.current.actx : null;
      if (actx == null) {
        return;
      }
      let updatedEvents = events;
      const scaleNotes = makeOctaveScaleNoteSequence();
      const currentTime = actx.currentTime;

      let lastStartTimeOffset = 0;
      scaleNotes.forEach(noteName => {
        lastStartTimeOffset += beatDurationSeconds;

        updatedEvents = playNote(
          updatedEvents,
          noteName,
          currentTime + lastStartTimeOffset,
          currentTime + lastStartTimeOffset + beatDurationSeconds
        );
      });

      return updatedEvents;
    });
  });

  const playChord = React.useCallback((chordNotes, octave) => {
    setEvents(events => {
      const actx = dx7Ref.current ? dx7Ref.current.actx : null;
      if (actx == null) {
        return;
      }
      let updatedEvents = events;

      const currentTime = actx.currentTime;

      chordNotes.forEach((noteName, i) => {
        updatedEvents = playNote(
          updatedEvents,
          noteName + octave,
          currentTime + i * (20 / 1000),
          currentTime + beatDurationSeconds
        );
      });

      return updatedEvents;
    });
  });

  const [lastChord, setLastChord] = React.useState(null);
  const [octave, setOctave] = React.useState(4);

  React.useEffect(() => {
    window.onDX7Init = (dx7, actx) => {
      const dx7api = {
        dx7,
        actx,
      };
      dx7Ref.current = dx7api;

      setInterval(() => {
        setEvents(events => onTick(events, dx7api));
      }, 1);

      if (TEST_PLAY_SCALE) {
        const scaleNotes = makeOctaveScaleNoteSequence();

        let currentNoteIndex = 0;
        let prevNoteIndex = null;

        setInterval(() => {
          if (prevNoteIndex != null) {
            dx7.onMidi([
              NOTE_OFF,
              Tonal.note(scaleNotes[prevNoteIndex]).midi,
              velocityMidi,
            ]);
          }

          dx7.onMidi([
            NOTE_ON,
            Tonal.note(scaleNotes[currentNoteIndex]).midi,
            velocityMidi,
          ]);
          prevNoteIndex = currentNoteIndex;

          currentNoteIndex = (currentNoteIndex + 1) % scaleNotes.length;
          // currentNoteIndex = Math.floor(Math.random() * scaleNotes.length);
        }, beatDurationSeconds * 1000);
      }
    };
    initDX7();
  }, []);

  return (
    <div className="App">
      <button onClick={resumeAudio}>start audio</button>
      <button onClick={suspendAudio}>pause audio</button>
      <div>
        <button onClick={playScale}>play scale</button>
        <br />
        key:{' '}
        <select
          value={scaleData.key}
          onChange={event =>
            setScaleData(makeScaleDependentData(event.currentTarget.value))
          }
        >
          {['a', 'b', 'c', 'd', 'e', 'f', 'g'].map(key => (
            <option key={key} value={key}>
              {key}
            </option>
          ))}
        </select>{' '}
        octave:{' '}
        <select
          value={octave}
          onChange={event => setOctave(parseInt(event.currentTarget.value))}
        >
          {[1, 2, 3, 4, 5, 6, 7].map(key => (
            <option key={key} value={key}>
              {key}
            </option>
          ))}
        </select>{' '}
        scale notes:{' '}
        {Array.from(scaleData.scalePosChords.keys())
          .map(k => scaleData.scalePitchClasses[k])
          .join()}
      </div>

      {scaleData.sizes.map((size, sizeIndex) => (
        <div>
          {false && <div style={{flex: 1}}>{size}</div>}
          <br />
          <div key={size} style={{display: 'flex'}}>
            {Array.from(scaleData.scalePosChords).map(([pos, chordDatas]) => {
              return (
                <div key={pos} style={{flex: 1}}>
                  {sizeIndex === 0 && <div>{scalePosName[pos]}</div>}

                  {chordDatas
                    .filter(chordData => chordData.size === size)
                    .map((chordData, i) => (
                      <div key={i}>
                        <div
                          style={{
                            ...buttonStyle,
                            background:
                              chordData.chordName === lastChord
                                ? 'lightgrey'
                                : null,
                          }}
                          onClick={() => {
                            playChord(chordData.chord.notes, octave);
                            setLastChord(chordData.chordName);
                            console.log(chordData);
                          }}
                        >
                          {chordData.chordName}
                          {true && (
                            <>
                              <br />
                              <small>{chordData.chord.notes.join()}</small>
                            </>
                          )}
                          {false && (
                            <>
                              <br />
                              <small>{chordData.chord.name}</small>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <pre style={{height: 300, overflow: 'scroll'}}>
        {events.map(ev => JSON.stringify(ev)).join('\n')}
      </pre>
    </div>
  );
}

export default App;
