// @flow
import React from 'react';
import * as ToneJSMidi from '@tonejs/midi';
import * as Tonal from '@tonaljs/tonal';
import * as Scale from '@tonaljs/scale';
import * as Note from '@tonaljs/note';
import * as Midi from '@tonaljs/midi';
import * as ScaleDictionary from '@tonaljs/scale-dictionary';
import useLocalStorage from './useLocalStorage';
import useQueryParam, {QUERY_PARAM_FORMATS} from './useQueryParam';
import useValueObserver from './useValueObserver';
import Keyboard from './Keyboard';
import PianoRoll from './PianoRoll';

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

function SelectionInfo({scaleData, selectedNotes, notePlayer}) {
  const selectedNotesSet = [
    ...new Set([...selectedNotes].map(note => Tonal.note(note.name).pc)),
  ];

  const matchingScales = scaleData.keyScales.filter(scale => {
    for (const noteName of selectedNotesSet) {
      if (!scale.notes.includes(noteName)) {
        return false;
      }
      return true;
    }
  });
  return (
    <div>
      <div>Notes: {selectedNotesSet.join(', ')}</div>
      <div>
        Matching Scales:
        <br />{' '}
        {matchingScales.map(scale => {
          const scaleNotes = reifyScaleNotesWithOctave(scale, octave);
          return (
            <div key={scale.name}>
              {scale.name}
              <br />

              <Keyboard
                highlightKeys={scaleNotes}
                startOctave={octave}
                octaves={3}
                highlightType={'scale'}
                notePlayer={notePlayer}
              />
            </div>
          );
        })}
      </div>
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

  const scaleNotes = reifyScaleNotesWithOctave(scale, octave);

  const keyScales = ScaleDictionary.entries()
    .map(scaleDef => Scale.scale(`${key} ${scaleDef.name}`))
    .map(scale => ({
      ...scale,
      notesAbstractMidi: new Set(
        scale.notes.map(noteName => Tonal.note(`${noteName}0`).midi).sort()
      ),
    }));

  return {scaleNotes, key, keyScales};
}

function usePersistedMidiFile() {
  const [midiJSONObj, setMidiJSONObj] = useLocalStorage(
    'MidiExploderPersistence',
    null
  );

  const midiFile = React.useMemo(() => {
    if (midiJSONObj != null) {
      try {
        const midiFile = new ToneJSMidi.Midi();
        midiFile.fromJSON(midiJSONObj);
        return midiFile;
      } catch (err) {
        console.error('failed to load midi file', err);
        return null;
      }
    }
  }, [midiJSONObj]);

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

  const [selectedNotes, setSelectedNotes] = React.useState(new Set());

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
      {midiFile != null && (
        <div style={{display: 'flex'}}>
          <div style={{overflow: 'hidden', width: '66%'}}>
            <PianoRoll midi={midiFile} {...{selectedNotes, setSelectedNotes}} />
          </div>
          <div style={{width: '33%', overflow: 'hidden'}}>
            <SelectionInfo {...{scaleData, selectedNotes, notePlayer}} />
          </div>
        </div>
      )}
    </div>
  );
}
