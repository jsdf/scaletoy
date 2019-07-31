import React from 'react';
import logo from './logo.svg';
import './App.css';
import * as Tonal from '@tonaljs/tonal';
import * as Scale from '@tonaljs/scale';
import * as Chord from '@tonaljs/chord';
import Recorder from './Recorder';
import useLocalStorage from './useLocalStorage';

/* global initDX7 */

const SHOW_NOTE_NAMES = true;
const SHOW_NOTE_OCTS = true;
const SHOW_FULL_CHORD_NAMES = false;
const SIZE_ASC = true;

const strummingTimes = [0, 10, 30, 50, 75, 100, 150, 200];
const strummingTimesIndex = {};
strummingTimes.forEach((v, i) => {
  strummingTimesIndex[v] = i;
});

function transposeByOctaves(note, shift) {
  return `${note.pc}${note.oct + shift}`;
}

function getChordsBySize(chords, key) {
  return chords
    .map(chordType => Chord.chord(`${key}${chordType}`))
    .sort((a, b) => a.intervals.length - b.intervals.length)
    .map(chord => `${chord.tonic}${chord.aliases[0]}`);
}

const keys = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'Bb', 'B'];

const scaleTypesPosNames = {
  major: ['I', 'ii', 'iii', 'VI', 'V', 'vi', 'vii*'],
  minor: ['i', 'ii*', 'III', 'iv', 'v', 'VI', 'VII'],
};

const scaleTypesChordPatterns = {
  major: ['major', 'minor', 'minor', 'major', 'major', 'minor', 'diminished'],
  minor: ['minor', 'diminished', 'major', 'minor', 'minor', 'major', 'major'],
};

function getScaleChords(key, scaleType) {
  return Scale.scale(key + ' ' + scaleType).notes.map((pc, pos) =>
    getChordsBySize(
      Scale.scaleChords(scaleTypesChordPatterns[scaleType][pos]),
      pc
    )
  );
}

const bpm = 140;
const beatDurationSeconds = (1 / bpm) * 60;

const NOTE_ON = 0x90;
const NOTE_OFF = 0x80;
const velocityMidi = 80;

const TEST_PLAY_SCALE = false;

function testPlayScale(audioApi) {
  const scaleNotes = makeOctaveScaleNoteSequence('c', 4, 'major');

  let currentNoteIndex = 0;
  let prevNoteIndex = null;

  setInterval(() => {
    if (prevNoteIndex != null) {
      audioApi.dx7.onMidi([
        NOTE_OFF,
        Tonal.note(scaleNotes[prevNoteIndex]).midi,
        velocityMidi,
      ]);
    }

    audioApi.dx7.onMidi([
      NOTE_ON,
      Tonal.note(scaleNotes[currentNoteIndex]).midi,
      velocityMidi,
    ]);
    prevNoteIndex = currentNoteIndex;

    currentNoteIndex = (currentNoteIndex + 1) % scaleNotes.length;
    // currentNoteIndex = Math.floor(Math.random() * scaleNotes.length);
  }, beatDurationSeconds * 1000);
}

function onTick(events, audioApi) {
  let i = 0;
  for (; i < events.length; i++) {
    const nextEvent = events[i];
    if (nextEvent.time > audioApi.actx.currentTime) {
      break;
    }

    audioApi.dx7.onMidi(nextEvent.message);
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

function makeOctaveScaleNoteSequence(key, octave, scaleType) {
  const scaleNotes = Scale.scale(`${key}${octave} ${scaleType}`).notes;

  scaleNotes.push(transposeByOctaves(Tonal.note(scaleNotes[0]), 1));

  return scaleNotes;
}

// get the notes for a chord, for an octave
function getReifiedNotesForChord(chordName, octave) {
  const chordData = Chord.chord(chordName);
  const tonicReified = chordData.tonic + octave;
  const notes = chordData.intervals.map(interval =>
    Tonal.transpose(tonicReified, interval)
  );
  return notes;
}

// we need to make sure that the tonic is from the correct octave when the
// scale spans multiple octaves
function getReifiedNotesForChordForScale(chordName, scalePitchClassesNotesMap) {
  const chordData = Chord.chord(chordName);
  const tonicReified = scalePitchClassesNotesMap[chordData.tonic];
  const notes = chordData.intervals.map(interval =>
    Tonal.transpose(tonicReified, interval)
  );
  return notes;
}

function reifyScaleNotesWithOctave(scale, octave) {
  return scale.intervals.map(interval =>
    Tonal.transpose(`${scale.tonic}${octave}`, interval)
  );
}

function makeScaleData(key, scaleType, octave) {
  const scale = Scale.scale(`${key} ${scaleType}`);
  const scalePitchClasses = scale.notes;

  const scaleNotes = reifyScaleNotesWithOctave(scale, octave);
  const scalePitchClassesNotesMap = {};
  scaleNotes.forEach(noteName => {
    scalePitchClassesNotesMap[Tonal.note(noteName).pc] = noteName;
  });

  const scalePosChords = new Map(
    getScaleChords(key, scaleType).map((chordNames, pos) => {
      return [
        pos,

        chordNames.map(chordName => {
          const chord = Chord.chord(chordName);
          return {
            pos,
            chord,
            chordType: scaleTypesChordPatterns[scaleType][pos],
            chordNotesForOctave: getReifiedNotesForChordForScale(
              chordName,
              scalePitchClassesNotesMap
            ),
            chordName,
            size:
              chord.intervals.length * (chord.quality === 'Unknown' ? -1 : 1),
          };
        }),
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
    scaleNotes,
    sizes: Array.from(sizes).sort((a, b) => a - b),
  };
}

const chordTypeColors = {
  major: 'rgb(127,199,175)',
  minor: 'rgb(255,158,157)',
  diminished: 'rgb(218,216,167)',
};

const buttonStyle = {
  display: 'block',
  width: '100%',
  cursor: 'pointer',
  color: 'black',
  padding: 4,
  paddingBottom: 8,
  height: 46,
  overflow: 'hidden',
};

const ChordButton = React.memo(
  ({chordData, playChord, setLastChord, octave, strumming, selected}) => {
    return (
      <div
        style={{
          ...buttonStyle,
          background: chordTypeColors[chordData.chordType],
          border: '1px solid',
          borderColor: selected ? 'rgba(0,0,0,0.2)' : 'transparent',
        }}
        onClick={() => {
          playChord(chordData, octave, strumming);
          setLastChord(chordData.chordName);
          console.log(chordData);
        }}
      >
        <div>
          {chordData.chordName}
          {SHOW_FULL_CHORD_NAMES && (
            <div>
              <small>
                {chordData.chord.name.length > 3 ? (
                  chordData.chord.name
                ) : (
                  // bad data, don't show
                  <span>&nbsp;</span>
                )}
              </small>
            </div>
          )}
          {true && (
            <div>
              {SHOW_NOTE_NAMES && SHOW_NOTE_OCTS && (
                <small>{chordData.chordNotesForOctave.join()}</small>
              )}

              {SHOW_NOTE_NAMES && !SHOW_NOTE_OCTS && (
                <small>{chordData.chord.notes.join()}</small>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
);

function App() {
  const [audioApi, setAudioApi] = React.useState(null);
  const resumeAudio = React.useCallback(
    () => audioApi && audioApi.actx.resume(),
    [audioApi]
  );
  const suspendAudio = React.useCallback(
    () => audioApi && audioApi.actx.suspend(),
    [audioApi]
  );

  const [key, setKey] = useLocalStorage('key', 'C');
  const [strumming, setStrumming] = useLocalStorage(
    'strumming',
    strummingTimes[2]
  );

  const [includeExtra, setIncludeExtra] = useLocalStorage(
    'includeExtra',
    false
  );
  const [lastChord, setLastChord] = React.useState(null);
  const [octave, setOctave] = useLocalStorage('octave', 4);
  const [scaleType, setScaleType] = useLocalStorage('scaleType', 'major');

  const scaleData = React.useMemo(() => makeScaleData(key, scaleType, octave), [
    key,
    scaleType,
    octave,
  ]);

  const toggleExtra = React.useCallback(() => setIncludeExtra(s => !s));

  const [events, setEvents] = React.useState([]);

  const playScale = React.useCallback(() => {
    setEvents(events => {
      if (audioApi == null) {
        return events;
      }
      let updatedEvents = events;
      const scaleNotes = scaleData.scaleNotes.slice();
      scaleNotes.push(Tonal.transpose(scaleNotes[0], '8P'));
      const currentTime = audioApi.actx.currentTime;
      debugger;
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
  }, [setEvents, audioApi, scaleData]);

  const playChord = React.useCallback(
    (chordData, octave, strumming) => {
      const chordNotes = chordData.chordNotesForOctave;

      setEvents(events => {
        if (audioApi == null) {
          return events;
        }
        let updatedEvents = events;

        const currentTime = audioApi.actx.currentTime;

        chordNotes.forEach((noteName, i) => {
          const strumDelay = i * (strumming / 1000);
          updatedEvents = playNote(
            updatedEvents,
            noteName,
            currentTime + strumDelay,
            currentTime + beatDurationSeconds + i * (strumming / 1000)
          );
        });

        return updatedEvents;
      });
    },
    [setEvents, audioApi]
  );

  // startup
  React.useEffect(() => {
    window.onDX7Init = (dx7, actx) => {
      const newAudioApi = {
        dx7,
        actx,
      };

      // start event-consuming interval
      setInterval(() => {
        setEvents(events => onTick(events, newAudioApi));
      }, 1);

      if (TEST_PLAY_SCALE) {
        testPlayScale(newAudioApi);
      }

      setAudioApi(newAudioApi);
    };
    initDX7();
  }, []);

  return (
    <div className="App">
      <button onClick={resumeAudio}>start audio</button>
      <button onClick={suspendAudio}>pause audio</button>
      {audioApi && <Recorder actx={audioApi.actx} inputNode={audioApi.dx7} />}
      <div>
        <label>
          key:{' '}
          <select
            value={scaleData.key}
            onChange={event => setKey(event.currentTarget.value)}
          >
            {keys.map(key => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>
        </label>{' '}
        <label>
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
          </select>
        </label>{' '}
        <label>
          scale type:{' '}
          <select
            value={scaleType}
            onChange={event => setScaleType(event.currentTarget.value)}
          >
            {['major', 'minor'].map(key => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>
        </label>{' '}
        <label>scale notes: </label>
        {scaleData.scaleNotes.join()}{' '}
        <button onClick={playScale}>play scale</button>{' '}
        <label>
          strumming:
          <input
            type="range"
            min={0}
            max={9}
            value={strummingTimesIndex[strumming]}
            onChange={e => {
              setStrumming(strummingTimes[parseInt(e.currentTarget.value)]);
            }}
          />{' '}
          <input hidden type="number" value={strumming} readOnly />
        </label>
        <label>
          <input
            type="checkbox"
            onChange={toggleExtra}
            checked={includeExtra}
          />
          include extra chords
        </label>
      </div>

      {scaleData.sizes
        .filter(size => (includeExtra ? true : size > 0))
        .sort((a, b) => (SIZE_ASC ? a - b : b - a))
        .map((size, sizeIndex) => (
          <div key={sizeIndex}>
            {false && <div style={{flex: 1}}>{size}</div>}
            <br />
            <div key={size} style={{display: 'flex'}}>
              {Array.from(scaleData.scalePosChords).map(([pos, chordDatas]) => {
                return (
                  <div key={pos} style={{flex: 1}}>
                    {sizeIndex === 0 && (
                      <div>{scaleTypesPosNames[scaleType][pos]}</div>
                    )}

                    {chordDatas
                      .filter(chordData => chordData.size === size)
                      // silly heuristic for simpler chords
                      .sort((a, b) => a.chordName.length - b.chordName.length)
                      .map((chordData, i) => (
                        <ChordButton
                          key={i}
                          {...{
                            chordData,
                            playChord,
                            setLastChord,
                            octave,
                            strumming,
                            selected: chordData.chordName === lastChord,
                          }}
                        />
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
