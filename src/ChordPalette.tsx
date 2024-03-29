import React from 'react';
import {knuthShuffle} from 'knuth-shuffle';
import * as Tonal from '@tonaljs/tonal';
import * as Interval from '@tonaljs/interval';

import * as Scale from '@tonaljs/scale';
import * as Chord from '@tonaljs/chord';
import * as Note from '@tonaljs/note';
import Recorder from './Recorder';
import useQueryParam, {QUERY_PARAM_FORMATS} from './useQueryParam';
import useValueObserver from './useValueObserver';
import MidiDeviceSelector from './MidiDeviceSelector';
import Keyboard from './Keyboard';
import Scaleboard from './Scaleboard';
import MidiExport from './MidiExport';
import Details from './Details';
import Select from './Select';
import Range from './Range';
import Checkbox from './Checkbox';
import ChordButton from './ChordButton';
import Sticky from './Sticky';
import simplifyEnharmonics from './simplifyEnharmonics';
import NearbyChords from './NearbyChords';
import {Synth} from './Synth';

const SIZE_ASC = true;
const SHOW_HISTORY = true;

const strummingTimes = [0, 10, 30, 50, 75, 100, 150, 200];
const strummingTimesIndex = {};
strummingTimes.forEach((v, i) => {
  strummingTimesIndex[v] = i;
});

function range(size, startAt = 0) {
  return [...Array(size).keys()].map((i) => i + startAt);
}
function transposeByOctaves(note, shift) {
  return `${note.pc}${note.oct + shift}`;
}

function getChordsBySize(chords, pc) {
  return chords
    .map((chordType) => Chord.get(`${pc}${chordType}`))
    .sort((a, b) => a.intervals.length - b.intervals.length)
    .map((chord) => `${chord.tonic}${chord.aliases[0]}`);
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
      const degreeRoman = romanNumerals[i];

      switch (scaleType) {
        case 'major':
          return degreeRoman.toUpperCase();
        case 'minor':
          return degreeRoman;
        case 'diminished':
          return degreeRoman + '\xB0';
        default:
          throw new Error(`unknown scaleType '${scaleType}'`);
      }
    });

    return acc;
  },
  {}
);

function getScaleChords(key, scaleType) {
  return Scale.scale(key + ' ' + scaleType).notes.map((pc, degree) =>
    getChordsBySize(
      Scale.scaleChords(scaleTypesChordPatterns[scaleType][degree]),
      simplifyEnharmonics(pc)
    )
  );
}

const bpm = 140;
const beatDurationSeconds = (1 / bpm) * 60;

const NOTE_ON = 0x90;
const NOTE_OFF = 0x80;
const velocityMidi = 80;

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
  // end any upcoming events for this key
  events.forEach((ev) => {
    if (ev.message[1] === noteMidi) {
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
function playNoteOn(events, noteName, time) {
  const noteMidi = Tonal.note(noteName).midi;

  let updatedEvents = events;
  return addEvents(updatedEvents, [
    {
      message: [NOTE_ON, noteMidi, velocityMidi],
      time: time,
    },
  ]);
}
function playNoteOff(events, noteName, time) {
  const noteMidi = Tonal.note(noteName).midi;

  let updatedEvents = events;
  return addEvents(updatedEvents, [
    {
      message: [NOTE_OFF, noteMidi, velocityMidi],
      time: time,
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
  const chordData = Chord.get(chordName);
  const tonicReified = chordData.tonic + octave;
  const notes = chordData.intervals.map((interval) =>
    Tonal.transpose(tonicReified, interval)
  );
  return notes;
}

// we need to make sure that the tonic is from the correct octave when the
// scale spans multiple octaves
function getReifiedNotesForChordForScale(chordName, scalePitchClassesNotesMap) {
  const chordData = Chord.get(chordName);
  const tonicReified = scalePitchClassesNotesMap[chordData.tonic];
  const notes = chordData.intervals.map((interval) =>
    Note.simplify(Tonal.transpose(tonicReified, interval))
  );
  return notes;
}

function reifyScaleNotesWithOctave(scale, octave) {
  return scale.intervals.map((interval) =>
    Tonal.transpose(`${scale.tonic}${octave}`, interval)
  );
}

function makeChordData(
  chordName,
  chordTonic,
  degree,
  scaleType,
  scalePitchClassesNotesMap,
  scaleNotesDegreeMap,
  startOctave
) {
  const chordAbstract = Chord.get(chordName);

  const chord = Chord.getChord(
    chordName.slice(chordAbstract.tonic.length),
    chordTonic,
    chordTonic
  );
  const chordNotesForOctave = getReifiedNotesForChordForScale(
    chordName,
    scalePitchClassesNotesMap
  );

  const rotations = [];
  for (let rot = 0; rot < chordNotesForOctave.length; rot++) {
    const maxInterval = Interval.num(
      chord.intervals[chord.intervals.length - 1]
    );

    // this method will not correctly invert larger chords
    if (maxInterval >= 7) break;
    const rotationTonic = chord.tonic;

    const rotChordName = chord.symbol.slice(Tonal.note(chord.tonic).pc.length);
    const rotatedChord = Chord.getChord(
      rotChordName,
      rotationTonic,
      chordNotesForOctave[rot] // root
    );
    if (rotatedChord.empty) {
      // dunno how to invert this
      break;
    }
    rotations.push({
      chordName: chord.symbol,
      chord: rotatedChord,
      chordNotesForOctave: rotatedChord.intervals.map((interval) =>
        simplifyEnharmonics(Tonal.transpose(rotatedChord.tonic, interval))
      ),
    });
  }

  return {
    degree,
    chord,
    chordType: scaleTypesChordPatterns[scaleType][degree],
    chordNotesForOctave,
    pitchClasses: chord.notes,
    chordName,
    rotations,
    size: chord.intervals.length * (chord.quality === 'Unknown' ? -1 : 1),
  };
}
function makeScaleData(key, scaleType, octave) {
  const scale = Scale.scale(`${key} ${scaleType}`);
  const scalePitchClasses = scale.notes;

  const scaleNotes = reifyScaleNotesWithOctave(scale, octave);
  const scaleNotesDegreeMap = {};
  const scalePitchClassesNotesMap = {};
  scaleNotes.forEach((noteName, degree) => {
    scaleNotesDegreeMap[noteName] = degree;
    scalePitchClassesNotesMap[
      simplifyEnharmonics(Tonal.note(noteName).pc)
    ] = noteName;
  });

  const startOctave = Tonal.note(scaleNotes[0]).oct;

  const scaleDegreeChords = new Map(
    getScaleChords(key, scaleType).map((chordNames, degree) => {
      return [
        degree,
        chordNames.map((chordName) =>
          makeChordData(
            chordName,
            scaleNotes[degree],
            degree,
            scaleType,
            scalePitchClassesNotesMap,
            scaleNotesDegreeMap,
            startOctave
          )
        ),
      ];
    })
  );

  const sizes = new Set();
  scaleDegreeChords.forEach((chordDatas, degree) => {
    chordDatas.forEach((chordData) => {
      sizes.add(chordData.size);
    });
  });

  return {
    scaleType,
    key,
    scalePitchClasses,
    scaleDegreeChords,
    scaleNotes,
    sizes: Array.from(sizes).sort((a, b) => a - b),
  };
}

const flexColContainer = {
  display: 'flex',
};
const flexCol = {
  flex: 1,
};
const alignLeft = {
  textAlign: 'left',
};
const alignCenter = {textAlign: 'center'};

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

  const [strumMode, setStrumMode] = useQueryParam(
    'strumMode',
    'up',
    QUERY_PARAM_FORMATS.string
  );

  const [includeExtra, setIncludeExtra] = useQueryParam(
    'includeExtra',
    false,
    QUERY_PARAM_FORMATS.boolean
  );
  const [oneShot, setOneShot] = useQueryParam(
    'oneShot',
    true,
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
  const [showScaleDegrees, setShowScaleDegrees] = useQueryParam(
    'showScaleDegrees',
    true,
    QUERY_PARAM_FORMATS.boolean
  );

  const [scaleSteps, setScaleSteps] = useQueryParam(
    'scaleSteps',
    7,
    QUERY_PARAM_FORMATS.integer
  );
  const [chordPaletteOctaves, setChordPaletteOctaves] = useQueryParam(
    'chordPaletteOctaves',
    1,
    QUERY_PARAM_FORMATS.integer
  );

  const [history, setHistory] = React.useState([]);
  const clearHistory = React.useCallback(() => setHistory([]), [setHistory]);

  const scaleData = React.useMemo(() => makeScaleData(key, scaleType, octave), [
    key,
    scaleType,
    octave,
  ]);

  const [highlightedKeys, setHighlightedKeys] = React.useState(null);
  const [highlightedScale, setHighlightedScale] = React.useState(null);

  const setHighlightedScaleToCurrentScale = React.useCallback(
    () => setHighlightedScale(scaleData.scalePitchClasses),
    [scaleData.scalePitchClasses]
  );

  const chordDataByOctave = React.useMemo(() => {
    return range(chordPaletteOctaves).map((octaveOffset) => {
      return makeScaleData(key, scaleType, octave + octaveOffset);
    });
  }, [key, scaleType, octave, chordPaletteOctaves]);

  const [events, setEvents] = React.useState([]);
  const [midiOut, setMidiOut] = React.useState(null);
  const [stickySection, setStickySection] = React.useState(null);
  const onSetSticky = React.useCallback(
    (name, enabled) => {
      setStickySection((s) => (enabled ? name : null));
    },
    [setStickySection]
  );

  const playScale = React.useCallback(() => {
    setEvents((events) => {
      let updatedEvents = events;
      const scaleNotes = scaleData.scaleNotes.slice();
      scaleNotes.push(Tonal.transpose(scaleNotes[0], '8P'));
      const currentTime = audioApi.actx.currentTime;
      let lastStartTimeOffset = 0;
      scaleNotes.forEach((noteName) => {
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
  }, [setEvents, audioApi, scaleData]);

  const playChord = React.useCallback(
    (chordData, strumming, strumMode, source) => {
      const chordNotes = chordData.chordNotesForOctave;

      setEvents((events) => {
        let updatedEvents = events;

        const currentTime = audioApi.actx.currentTime;

        let notes = chordNotes.slice();

        if (strumMode === 'down') {
          notes.reverse();
        } else if (strumMode === 'random') {
          knuthShuffle(notes);
        }

        notes.forEach((noteName, i) => {
          const strumDelay = i * (strumming / 1000);
          if (oneShot) {
            updatedEvents = playNoteOnOff(
              updatedEvents,
              noteName,
              currentTime + strumDelay,
              currentTime + beatDurationSeconds + i * (strumming / 1000)
            );
          } else {
            updatedEvents = playNoteOn(
              updatedEvents,
              noteName,
              currentTime + strumDelay
            );
          }
        });

        return updatedEvents;
      });

      if (source !== 'history' && source !== 'nearby') {
        setHistory((s) => s.concat(chordData));
        setLastChord(chordData);
      }
    },
    [setEvents, audioApi, oneShot]
  );

  const endChord = React.useCallback(
    (chordData, strumming, strumMode, source) => {
      if (oneShot) return;
      const chordNotes = chordData.chordNotesForOctave;

      setEvents((events) => {
        let updatedEvents = events;

        const currentTime = audioApi.actx.currentTime;

        let notes = chordNotes.slice();

        notes.forEach((noteName, i) => {
          const noteMidi = Tonal.note(noteName).midi;
          updatedEvents = playNoteOff(
            updatedEvents,
            noteName,
            currentTime
          ).filter(
            // remove any future note on for this note (e.g. strumming delayed starts)
            (event) => {
              const [status, data1] = event.message;
              return !(status === NOTE_ON && data1 === noteMidi);
            }
          );
        });

        return updatedEvents;
      });
    },
    [setEvents, audioApi, oneShot]
  );

  useValueObserver(scaleData, setHighlightedScaleToCurrentScale);
  React.useEffect(() => {
    setHighlightedScaleToCurrentScale();
  }, []);

  const onMidi = React.useMemo(() => {
    if (midiOut) {
      if (!midiOut.send) {
        debugger;
      }
      return (message) => midiOut.send(message);
    } else if (audioApi.dx7) {
      return (message) => audioApi.dx7.onMidi(message);
    }
    return (message) => {};
  }, [audioApi, midiOut]);

  const notePlayer = React.useMemo(() => {
    return {
      triggerAttack(noteName) {
        onMidi([NOTE_ON, Tonal.note(noteName).midi, velocityMidi]);
      },
      triggerRelease(noteName) {
        onMidi([NOTE_OFF, Tonal.note(noteName).midi, velocityMidi]);
      },
    };
  }, [onMidi]);

  // startup
  React.useEffect(() => {
    // start event-consuming interval
    const id = setInterval(() => {
      setEvents((events) => onTick(events, audioApi, onMidi));
    }, 1);
    return () => {
      clearInterval(id);
    };
  }, [onMidi, audioApi]);

  const controlsSection = (
    <div>
      <button onClick={suspendAudio}>pause audio</button>
      <button onClick={resumeAudio}>resume audio</button>
      {audioApi.dx7 && (
        <Recorder actx={audioApi.actx} inputNode={audioApi.dx7} />
      )}
      <MidiDeviceSelector
        type="output"
        selectedPort={midiOut}
        onChange={setMidiOut}
      />
      <div>
        <Select
          label="key"
          options={keys}
          value={scaleData.key}
          onChange={setKey}
        />{' '}
        <Select
          label="octave"
          type="number"
          options={[1, 2, 3, 4, 5, 6, 7]}
          value={octave}
          onChange={setOctave}
        />{' '}
        <Select
          label="scale type"
          options={allScales}
          value={scaleType}
          onChange={setScaleType}
        />{' '}
        <label>scale notes: </label>
        {scaleData.scaleNotes.map((note) => Note.simplify(note)).join()}{' '}
        <button onClick={playScale}>play scale</button>{' '}
        <Checkbox
          label="show notes as scale degrees"
          onChange={setShowScaleDegrees}
          checked={showScaleDegrees}
        />
      </div>
    </div>
  );

  const scaleKeyboardSection = (
    <Sticky
      name="scaleKeyboardSection"
      onSetSticky={onSetSticky}
      sticky={stickySection === 'scaleKeyboardSection'}
      className="background"
    >
      <Details summary="scale keyboard" startOpen={true}>
        <Select
          label="scale steps"
          options={[1, 2, 3, 4, 5, 6, 7]}
          type="number"
          value={scaleSteps}
          onChange={setScaleSteps}
        />
        <Scaleboard
          scalePitchClasses={scaleData.scalePitchClasses}
          highlightKeys={highlightedKeys}
          setOctave={setOctave}
          startOctave={Math.max(0, octave - 1)}
          octaves={5}
          notePlayer={notePlayer}
          showScaleDegrees={showScaleDegrees}
          scaleSteps={scaleSteps}
        />
      </Details>
    </Sticky>
  );

  const chromaticKeyboardSection = (
    <Sticky
      name="chromaticKeyboardSection"
      onSetSticky={onSetSticky}
      sticky={stickySection === 'chromaticKeyboardSection'}
      className="background"
    >
      <Details summary="keyboard" startOpen={true}>
        <Keyboard
          highlightKeys={highlightedKeys}
          highlightScale={highlightedScale}
          startOctave={Math.max(0, octave - 1)}
          octaves={5}
          notePlayer={notePlayer}
        />
      </Details>
    </Sticky>
  );

  const nearbyChordsSection = (
    <Sticky
      name="nearbyChordsSection"
      onSetSticky={onSetSticky}
      sticky={stickySection === 'nearbyChordsSection'}
      className="background"
    >
      <Details summary="nearby chords" startOpen={true}>
        <NearbyChords
          {...{
            scaleData,
            playChord,
            endChord,
            strumming,
            strumMode,
            showScaleDegrees,
            setHighlightedKeys,
            lastChord,
          }}
        />
      </Details>
    </Sticky>
  );

  const historySection = SHOW_HISTORY && (
    <div style={alignLeft}>
      <details>
        <summary style={alignLeft}>
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
                    endChord,
                    strumming,
                    strumMode,
                    showScaleDegrees,
                    selected: false,
                    onMouseOver: setHighlightedKeys,
                    source: 'history',
                  }}
                />
              </div>
            ))}
          {history.length === 0 && <div>played chords will appear here</div>}
        </div>
      </details>
    </div>
  );

  const chordPaletteSection = (
    <Details summary="chord palette" startOpen={true}>
      <Range
        label="strumming"
        min={0}
        max={strummingTimes.length - 1}
        value={strummingTimesIndex[strumming]}
        onChange={(value) => {
          setStrumming(strummingTimes[value]);
        }}
      />
      <Select
        label="strum mode"
        options={['up', 'down', 'random']}
        value={strumMode}
        onChange={setStrumMode}
      />{' '}
      <Select
        label="octaves"
        type="number"
        options={[1, 2]}
        value={chordPaletteOctaves}
        onChange={setChordPaletteOctaves}
      />{' '}
      <Checkbox
        label="include extra chords"
        onChange={setIncludeExtra}
        checked={includeExtra}
      />{' '}
      <Checkbox label="oneshot" onChange={setOneShot} checked={oneShot} />
      <div style={{...flexColContainer, ...alignCenter}}>
        {chordDataByOctave.map((scaleData, index) => {
          return (
            <div style={flexCol} key={index}>
              {scaleData.sizes
                .filter((size) => (includeExtra ? true : size > 0))
                .sort((a, b) => (SIZE_ASC ? a - b : b - a))
                .map((size, sizeIndex) => (
                  <div key={sizeIndex}>
                    {false && <div style={{flex: 1}}>{size}</div>}
                    <br />
                    <div key={size} style={{display: 'flex'}}>
                      {Array.from(scaleData.scaleDegreeChords).map(
                        ([degree, chordDatas]) => {
                          return (
                            <div key={degree} style={{flex: 1}}>
                              {sizeIndex === 0 && (
                                <div>
                                  {scaleTypesPosNames[scaleType][degree]}
                                </div>
                              )}

                              {chordDatas
                                .filter((chordData) => chordData.size === size)
                                // silly heuristic for simpler chords
                                .sort(
                                  (a, b) =>
                                    a.chordName.length - b.chordName.length
                                )
                                .map((chordData, i) => (
                                  <ChordButton
                                    key={i}
                                    {...{
                                      chordData,
                                      playChord,
                                      endChord,
                                      source: 'grid',
                                      strumming,
                                      strumMode,
                                      showScaleDegrees,
                                      selected:
                                        lastChord &&
                                        chordData.chordName ===
                                          lastChord.chordName,
                                      onMouseOver: setHighlightedKeys,
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
          );
        })}
      </div>
    </Details>
  );

  const midiEventLogSection = (
    <Details summary="midi events">
      <pre style={{height: 300, overflow: 'auto'}}>
        {events.map((ev) => JSON.stringify(ev)).join('\n')}
      </pre>
    </Details>
  );

  return (
    <div className="App" style={alignLeft}>
      <Synth audioApi={audioApi} connectToMidiIn />;{controlsSection}
      {scaleKeyboardSection}
      {chromaticKeyboardSection}
      {nearbyChordsSection}
      {historySection}
      {chordPaletteSection}
      {midiEventLogSection}
    </div>
  );
}

export default App;
