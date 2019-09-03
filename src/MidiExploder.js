// @flow
import React from 'react';
import * as ToneJSMidi from '@tonejs/midi';
import * as Tonal from '@tonaljs/tonal';
import * as Scale from '@tonaljs/scale';
import * as Note from '@tonaljs/note';
import * as Midi from '@tonaljs/midi';

import useLocalStorage from './useLocalStorage';
import useQueryParam, {QUERY_PARAM_FORMATS} from './useQueryParam';
import useValueObserver from './useValueObserver';
import Keyboard from './Keyboard';

const keys = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'Bb', 'B'];

const allScales = [
  'major',
  'minor',
  'dorian',
  'lydian',
  'phrygian',
  'ionian',
  'mixolydian',
  'locrian',
];

const octave = 4;
const NOTE_ON = 0x90;
const NOTE_OFF = 0x80;
const velocityMidi = 80;

const PIANOROLL_NOTE_HEIGHT = 10;
const PIANOROLL_QUARTER_WIDTH = 10;

function PianoRoll(props: {midi: ToneJSMidi.Midi}) {
  const {midi} = props;
  const trackExtents = React.useMemo(() => {
    return midi.tracks.map(t => {
      return t.notes.length == 0
        ? {minNote: 0, maxNote: 0, maxTicks: 0}
        : t.notes.reduce(
            (acc, ev) => {
              return {
                minNote: Math.min(acc.minNote, ev.midi),
                maxNote: Math.max(acc.maxNote, ev.midi),
                maxTicks: Math.max(acc.maxTicks, ev.ticks + ev.durationTicks),
              };
            },
            {minNote: 127, maxNote: 0, maxTicks: 0}
          );
    });
  }, [midi.tracks]);

  const tracksWidth = React.useMemo(() => {
    const maxTicks = trackExtents.reduce(
      (acc, ex) => Math.max(ex.maxTicks, acc),
      0
    );
    return (maxTicks / midi.header.ppq) * PIANOROLL_QUARTER_WIDTH;
  }, [trackExtents]);

  return (
    <div
      style={{
        overflowX: 'scroll',
        textAlign: 'left',
      }}
    >
      {midi.tracks.map((track, trackIdx) => {
        const extents = trackExtents[trackIdx];
        const midiRange = extents.maxNote - extents.minNote;
        return (
          <details key={trackIdx} open>
            <summary>Track {trackIdx + 1}</summary>
            <div
              style={{
                height: (midiRange + 1) * PIANOROLL_NOTE_HEIGHT + 1,
                width: tracksWidth,
                position: 'relative',
                borderBottom: 'solid #555 1px',
              }}
            >
              {' '}
              {[...Array(midiRange + 1).keys()].map(offset => (
                <div
                  key={'track' + trackIdx + 'row' + offset}
                  style={{
                    height: PIANOROLL_NOTE_HEIGHT,
                    background:
                      Tonal.note(Midi.midiToNoteName(offset + extents.minNote))
                        .acc === ''
                        ? 'darkgrey'
                        : 'grey',
                    borderTop: 'solid #555 1px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      marginTop: -1,
                      fontSize: 9,
                      fontFamily: 'Lucida Grande',
                    }}
                  >
                    {Midi.midiToNoteName(offset + extents.minNote)}
                  </div>
                </div>
              ))}
              {track.notes.map((ev, evIdx) => (
                <div
                  key={'track' + trackIdx + 'note' + evIdx}
                  style={{
                    left:
                      (ev.ticks / midi.header.ppq) * PIANOROLL_QUARTER_WIDTH,
                    top:
                      (midiRange - (ev.midi - extents.minNote)) *
                      PIANOROLL_NOTE_HEIGHT,
                    width:
                      (ev.durationTicks / midi.header.ppq) *
                      PIANOROLL_QUARTER_WIDTH,
                    height: PIANOROLL_NOTE_HEIGHT,
                    background: '#459',
                    border: 'solid 1px darkblue ',
                    position: 'absolute',
                  }}
                ></div>
              ))}
            </div>
          </details>
        );
      })}
    </div>
  );
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

  return {scaleNotes, key};
}

function usePersistedMidiFile() {
  const [midiJSONObj, setMidiJSONObj] = useLocalStorage(
    'MidiExploderPersistence',
    null
  );

  let midiFile = null;

  if (midiJSONObj != null) {
    try {
      midiFile = new ToneJSMidi.Midi();
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

export default function MidiExploder(props: {
  audioApi: {
    dx7: Object,
  },
}) {
  const {audioApi} = props;
  const [midiFile, setMidiFile] = usePersistedMidiFile();
  const [key, setKey] = useQueryParam('key', 'C', QUERY_PARAM_FORMATS.string);
  const [scaleType, setScaleType] = useQueryParam(
    'scaleType',
    'major',
    QUERY_PARAM_FORMATS.string
  );

  const handleFiles = React.useCallback(
    e => {
      if (!e.currentTarget.files) return;

      const [file] = e.currentTarget.files;

      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          setMidiFile(new ToneJSMidi.Midi(reader.result));
        };
        reader.readAsArrayBuffer(file);
      }
    },
    [setMidiFile]
  );

  const scaleData = React.useMemo(() => makeScaleData(key, scaleType, octave), [
    key,
    scaleType,
  ]);
  const [highlightedKeys, setHighlightedKeys] = React.useState(null);

  const setHighlightedScale = React.useCallback(() => {
    setHighlightedKeys({keys: scaleData.scaleNotes, type: 'scale'});
  }, [scaleData]);

  useValueObserver(scaleData, setHighlightedScale);

  const onMidi = React.useMemo(() => {
    if (audioApi.dx7) {
      return message => audioApi.dx7.onMidi(message);
    }
    return message => {};
  }, [audioApi]);

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

  return (
    <div className="App">
      <label>
        midi file: <input type="file" onChange={handleFiles} />
      </label>

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
        {scaleData.scaleNotes.map(note => Note.simplify(note)).join()}{' '}
      </div>

      <Keyboard
        highlightKeys={highlightedKeys ? highlightedKeys.keys : null}
        startOctave={octave}
        octaves={3}
        highlightType={highlightedKeys ? highlightedKeys.type : 'scale'}
        notePlayer={notePlayer}
      />

      <details open={false} style={{textAlign: 'left'}}>
        <summary>JSON</summary>
        <pre>{midiFile && JSON.stringify(midiFile.toJSON(), null, 2)}</pre>
      </details>
      <PianoRoll midi={midiFile} />
    </div>
  );
}
