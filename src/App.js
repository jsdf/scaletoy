import React from 'react';
import logo from './logo.svg';
import './App.css';
import * as Tonal from '@tonaljs/tonal';
import * as Scale from '@tonaljs/scale';
import * as Chord from '@tonaljs/chord';
import * as Note from '@tonaljs/note';
import Recorder from './Recorder';
import useQueryParam, {QUERY_PARAM_FORMATS} from './useQueryParam';
import useValueObserver from './useValueObserver';
import MidiOutput from './MidiOutput';
import Keyboard from './Keyboard';
import MidiExport from './MidiExport';

const SHOW_NOTE_NAMES = true;
const SHOW_NOTE_OCTS = true;
const SHOW_FULL_CHORD_NAMES = false;
const SIZE_ASC = true;
const SHOW_HISTORY = true;
const USE_SAMPLED_DX7 = Boolean(
  new URL(document.location).searchParams.get('sampled')
);

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

const scaleTypesChordPatterns = {
  major: ['major', 'minor', 'minor', 'major', 'major', 'minor', 'diminished'],
  minor: ['minor', 'diminished', 'major', 'minor', 'minor', 'major', 'major'],
  dorian: ['minor', 'minor', 'major', 'major', 'minor', 'diminished', 'major'],
  lydian: ['major', 'major', 'minor', 'diminished', 'major', 'minor', 'minor'],
  phrygian: [
    'minor',
    'major',
    'major',
    'minor',
    'diminished',
    'major',
    'minor',
  ],
  ionian: ['major', 'minor', 'minor', 'major', 'major', 'minor', 'diminished'],
  mixolydian: [
    'major',
    'minor',
    'diminished',
    'major',
    'minor',
    'minor',
    'major',
  ],
  locrian: ['diminished', 'major', 'minor', 'minor', 'major', 'major', 'minor'],
};

const allScales = Object.keys(scaleTypesChordPatterns);

const romanNumerals = ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii'];
// const scaleTypesPosNames = {
//   major: ['I', 'ii', 'iii', 'VI', 'V', 'vi', 'vii*'],
//   minor: ['i', 'ii*', 'III', 'iv', 'v', 'VI', 'VII'],
// };
const scaleTypesPosNames = Object.keys(scaleTypesChordPatterns).reduce(
  (acc, scaleName) => {
    const pattern = scaleTypesChordPatterns[scaleName];

    acc[scaleName] = pattern.map((scaleType, i) => {
      const pos = romanNumerals[i];

      switch (scaleType) {
        case 'major':
          return pos.toUpperCase();
        case 'minor':
          return pos;
        case 'diminished':
          return pos + '\xB0';
        default:
          throw new Error(`unknown scaleType '${scaleType}'`);
      }
    });

    return acc;
  },
  {}
);

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

function onTick(events, audioApi, midiOut) {
  let i = 0;
  for (; i < events.length; i++) {
    const nextEvent = events[i];
    if (nextEvent.time > audioApi.actx.currentTime) {
      break;
    }

    if (midiOut) {
      if (!midiOut.send) {
        debugger;
      }
      midiOut.send(nextEvent.message);
    } else if (audioApi.dx7) {
      audioApi.dx7.onMidi(nextEvent.message);
    }
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
    Note.simplify(Tonal.transpose(tonicReified, interval))
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

  const chordDatasByName = new Map(
    Array.from(scalePosChords.values).map(chordData => [
      chordData.chordName,
      chordData,
    ])
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
    chordDatasByName,
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
  textAlign: 'center',
};

const flexColContainer = {
  display: 'flex',
};
const flexCol = {
  flex: 1,
};

const ChordButton = React.memo(
  ({
    chordData,
    playChord,
    setLastChord,
    octave,
    strumming,
    selected,
    onMouseOver,
  }) => {
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
        onMouseOver={() => {
          onMouseOver(chordData.chordNotesForOctave);
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

function App({audioApi}) {
  const resumeAudio = React.useCallback(() => audioApi.actx.resume(), [
    audioApi,
  ]);
  const suspendAudio = React.useCallback(() => audioApi.actx.suspend(), [
    audioApi,
  ]);

  const [key, setKey] = useQueryParam('key', 'C', QUERY_PARAM_FORMATS.string);
  const [strumming, setStrumming] = useQueryParam(
    'strumming',
    strummingTimes[2],
    QUERY_PARAM_FORMATS.integer
  );

  const [includeExtra, setIncludeExtra] = useQueryParam(
    'includeExtra',
    false,
    QUERY_PARAM_FORMATS.boolean
  );
  const [lastChord, setLastChord] = React.useState(null);
  const [octave, setOctave] = useQueryParam(
    'octave',
    4,
    QUERY_PARAM_FORMATS.integer
  );
  const [scaleType, setScaleType] = useQueryParam(
    'scaleType',
    'major',
    QUERY_PARAM_FORMATS.string
  );

  const [highlightedKeys, setHighlightedKeys] = React.useState(null);
  const setHighlightedChord = React.useCallback(keys =>
    setHighlightedKeys({keys, type: 'chord'})
  );

  const [history, setHistory] = React.useState([]);
  const clearHistory = React.useCallback(() => setHistory([]), [setHistory]);

  const scaleData = React.useMemo(() => makeScaleData(key, scaleType, octave), [
    key,
    scaleType,
    octave,
  ]);
  const setHighlightedScale = React.useCallback(() => {
    setHighlightedKeys({keys: scaleData.scaleNotes, type: 'scale'});
  }, [scaleData]);

  const toggleExtra = React.useCallback(() => setIncludeExtra(s => !s));

  const [events, setEvents] = React.useState([]);
  const [midiOut, setMidiOut] = React.useState(null);

  const playScale = React.useCallback(() => {
    setEvents(events => {
      let updatedEvents = events;
      const scaleNotes = scaleData.scaleNotes.slice();
      scaleNotes.push(Tonal.transpose(scaleNotes[0], '8P'));
      const currentTime = audioApi.actx.currentTime;
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

      setHistory(s => s.concat(chordData));
    },
    [setEvents, audioApi]
  );

  useValueObserver(scaleData, setHighlightedScale);

  // startup
  React.useEffect(() => {
    // start event-consuming interval
    const id = setInterval(() => {
      setEvents(events => onTick(events, audioApi, midiOut));
    }, 1);
    return () => {
      clearInterval(id);
    };
  }, [midiOut]);

  return (
    <div className="App">
      <button onClick={suspendAudio}>pause audio</button>
      <button onClick={resumeAudio}>resume audio</button>
      {audioApi.dx7 && (
        <Recorder actx={audioApi.actx} inputNode={audioApi.dx7} />
      )}
      <MidiOutput selectedOutput={midiOut} onChangeOutput={setMidiOut} />
      <div onMouseOver={setHighlightedScale}>
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
            {allScales.map(key => (
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
            max={strummingTimes.length - 1}
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

      <Keyboard
        highlightKeys={highlightedKeys ? highlightedKeys.keys : null}
        startOctave={octave}
        octaves={3}
        highlightType={highlightedKeys ? highlightedKeys.type : 'scale'}
      />

      {SHOW_HISTORY && (
        <div style={{textAlign: 'left'}}>
          <details>
            <summary style={{textAlign: 'left'}}>
              <div style={{display: 'initial'}}>history/export</div>
            </summary>
            <div style={{padding: '8px 0'}}>
              <MidiExport
                bpm={bpm}
                history={history}
                strumming={strumming}
                beatDurationSeconds={beatDurationSeconds}
              />
              <button onClick={clearHistory}>clear history</button>
            </div>
            <div style={{width: `90vw`, overflow: 'auto', display: 'flex'}}>
              {history
                .slice()
                .reverse()
                .map((chordData, i) => (
                  <div key={i} style={{width: `${(1 / 7) * 100}vw`}}>
                    <ChordButton
                      {...{
                        chordData,
                        playChord,
                        setLastChord: () => {},
                        octave,
                        strumming,
                        selected: false,
                        onMouseOver: setHighlightedChord,
                      }}
                    />
                  </div>
                ))}
              {history.length === 0 && (
                <div>played chords will appear here</div>
              )}
            </div>
          </details>
        </div>
      )}

      <div style={flexColContainer}>
        <div style={flexCol}>
          {scaleData.sizes
            .filter(size => (includeExtra ? true : size > 0))
            .sort((a, b) => (SIZE_ASC ? a - b : b - a))
            .map((size, sizeIndex) => (
              <div key={sizeIndex}>
                {false && <div style={{flex: 1}}>{size}</div>}
                <br />
                <div key={size} style={{display: 'flex'}}>
                  {Array.from(scaleData.scalePosChords).map(
                    ([pos, chordDatas]) => {
                      return (
                        <div key={pos} style={{flex: 1}}>
                          {sizeIndex === 0 && (
                            <div>{scaleTypesPosNames[scaleType][pos]}</div>
                          )}

                          {chordDatas
                            .filter(chordData => chordData.size === size)
                            // silly heuristic for simpler chords
                            .sort(
                              (a, b) => a.chordName.length - b.chordName.length
                            )
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
                                  onMouseOver: setHighlightedChord,
                                }}
                              />
                            ))}
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>
      <pre style={{height: 300, overflow: 'auto'}}>
        {events.map(ev => JSON.stringify(ev)).join('\n')}
      </pre>
    </div>
  );
}

function Theme() {
  const [darkMode, setDarkMode] = React.useState(false);

  React.useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }
  }, [darkMode]);

  return (
    <div style={{position: 'absolute', top: 0, right: 0}}>
      <label>
        dark mode:{' '}
        <input
          type="checkbox"
          checked={darkMode}
          onChange={() => setDarkMode(s => !s)}
        />
      </label>
    </div>
  );
}

const CAN_AUTOPLAY_AUDIO = new AudioContext().state == 'running';

function Startup() {
  const [startedAudio, setStartedAudio] = React.useState(false);
  const [audioApi, setAudioApi] = React.useState(null);

  const onStart = React.useCallback(() => {
    document.querySelector('.dx7').style.visibility = 'visible';
    setStartedAudio(true);
  }, [setStartedAudio]);

  React.useEffect(() => {
    async function initSampled() {
      const {sampledDX7} = await import('./sampledDX7');

      sampledDX7().then(({dx7, actx}) => {
        window.initDX7Shim(dx7, actx);
      });
    }
    window.onDX7Init = (dx7, actx) => {
      if (!dx7) {
        // fall back to sampled
        return initSampled();
      }
      const newAudioApi = {
        dx7,
        actx,
      };

      setAudioApi(newAudioApi);
      if (actx.state === 'running') {
        onStart();
      }
    };
    if (USE_SAMPLED_DX7) {
      initSampled();
    } else {
      window.initDX7(process.env.PUBLIC_URL);
    }
  }, []);

  if (audioApi && startedAudio) {
    return (
      <div>
        <App audioApi={audioApi} />
        <Theme />
      </div>
    );
  }

  return (
    <div className="App">
      {audioApi ? (
        <button
          style={{fontSize: 42, borderRadius: 9, cursor: 'pointer'}}
          onClick={() => {
            audioApi.actx.resume();
            onStart();
          }}
        >
          start
        </button>
      ) : (
        'loading'
      )}
    </div>
  );
}

export default Startup;
