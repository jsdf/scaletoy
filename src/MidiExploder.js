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

function clamp(val, min, max) {
  return Math.max(Math.min(val, max), min);
}

function getOffsetInTarget(e) {
  const rect = e.currentTarget.getBoundingClientRect();

  return {
    x: clamp(e.pageX - (rect.x + window.scrollX), 0, rect.width),
    y: clamp(e.pageY - (rect.y + window.scrollY), 0, rect.height),
  };
}

function collision(a, b) {
  // work out the corners (x1,x2,y1,y1) of each rectangle
  // top left
  let ax1 = a.left;
  let ay1 = a.top;
  // bottom right
  let ax2 = a.left + a.width;
  let ay2 = a.top + a.height;
  // top left
  let bx1 = b.left;
  let by1 = b.top;
  // bottom right
  let bx2 = b.left + b.width;
  let by2 = b.top + b.height;

  // test rectangular overlap
  return !(ax1 > bx2 || bx1 > ax2 || ay1 > by2 || by1 > ay2);
}

function getSelectionBox(state) {
  const startX = Math.min(state.start.x, state.end.x);
  const startY = Math.min(state.start.y, state.end.y);
  const endX = Math.max(state.start.x, state.end.x);
  const endY = Math.max(state.start.y, state.end.y);
  return {
    left: startX,
    top: startY,
    width: endX - startX,
    height: endY - startY,
  };
}

function PianoRollTrack({
  midi,
  extents,
  track,
  trackIdx,
  tracksWidth,
  midiRange,
  selectedNotes,
  setSelectedNotes,
}) {
  const selectionRef = React.useRef({
    start: {x: 0, y: 0},
    end: {x: 0, y: 0},
    dragging: false,
  });

  const selectionElRef = React.useRef(null);

  function updateSelectionEl() {
    const el = selectionElRef.current;
    const state = selectionRef.current;
    if (el && state) {
      el.style.visibility = state.dragging ? 'visible' : 'hidden';

      const box = getSelectionBox(state);

      el.style.left = box.left + 'px';
      el.style.top = box.top + 'px';
      el.style.width = box.width + 'px';
      el.style.height = box.height + 'px';
    }
  }

  const getNoteLayout = React.useCallback(
    ev => {
      return {
        left: (ev.ticks / midi.header.ppq) * PIANOROLL_QUARTER_WIDTH,
        top: (midiRange - (ev.midi - extents.minNote)) * PIANOROLL_NOTE_HEIGHT,
        width: (ev.durationTicks / midi.header.ppq) * PIANOROLL_QUARTER_WIDTH,
        height: PIANOROLL_NOTE_HEIGHT,
      };
    },
    [midi.header.ppq, extents.minNote, midiRange]
  );

  const selectNotes = React.useCallback(() => {
    const state = selectionRef.current;
    if (state) {
      const box = getSelectionBox(state);

      const selectedNotes = track.notes.filter(ev => {
        const layout = getNoteLayout(ev);

        return collision(layout, box);
      });

      setSelectedNotes(new Set(selectedNotes));
    }
  }, [track, getNoteLayout]);

  const onMouseDown = React.useCallback(e => {
    selectionRef.current = {
      start: getOffsetInTarget(e),
      end: getOffsetInTarget(e),
      dragging: true,
    };
    updateSelectionEl();
  }, []);

  const onMouseMove = React.useCallback(e => {
    const state = selectionRef.current;
    if (state && state.dragging) {
      state.end = getOffsetInTarget(e);
      updateSelectionEl();
    }
  }, []);

  const onMouseUp = React.useCallback(() => {
    const state = selectionRef.current;
    if (state && state.dragging) {
      state.dragging = false;
      selectNotes();
    }
    updateSelectionEl();
  }, [selectNotes]);

  return (
    <div
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      style={{
        height: (midiRange + 1) * PIANOROLL_NOTE_HEIGHT + 1,
        width: tracksWidth,
        position: 'relative',
        borderBottom: 'solid #555 1px',
      }}
    >
      {' '}
      {[...Array(midiRange + 1).keys()].map(offset => {
        const midi = midiRange - offset + extents.minNote;
        const noteName = Midi.midiToNoteName(midi);
        return (
          <div
            key={'track' + trackIdx + 'row' + offset}
            style={{
              height: PIANOROLL_NOTE_HEIGHT,
              background: Tonal.note(noteName).acc === '' ? 'darkgrey' : 'grey',
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
              {noteName}
            </div>
          </div>
        );
      })}
      {track.notes.map((ev, evIdx) => (
        <div
          key={'track' + trackIdx + 'note' + evIdx}
          style={{
            ...getNoteLayout(ev),
            background: selectedNotes.has(ev) ? 'red' : '#459',
            border: 'solid 1px darkblue ',
            position: 'absolute',
          }}
        ></div>
      ))}
      <div
        ref={selectionElRef}
        style={{
          background: `rgba(200,200,200,0.3)`,
          border: 'solid 1px white',
          position: 'absolute',
        }}
      />
    </div>
  );
}

function TracksView({midi, selectedNotes, setSelectedNotes}) {
  const trackExtents = React.useMemo(() => {
    return midi.tracks.map(t => {
      return t.notes.length === 0
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
  }, [trackExtents, midi.header.ppq]);

  return (
    <div style={{textAlign: 'left'}}>
      {midi.tracks.map((track, trackIdx) => {
        const extents = trackExtents[trackIdx];
        const midiRange = extents.maxNote - extents.minNote;
        return (
          <details key={trackIdx} open>
            <summary>Track {trackIdx + 1}</summary>
            <PianoRollTrack
              {...{
                midi,
                extents,
                track,
                trackIdx,
                tracksWidth,
                midiRange,
                selectedNotes,
                setSelectedNotes,
              }}
            />
          </details>
        );
      })}
    </div>
  );
}

function SelectionInfo({scaleData, selectedNotes, notePlayer}) {
  const selectedNotesSet = [
    ...new Set([...selectedNotes].map(note => note.name)),
  ];

  const selectedNotesAbstractMidi = selectedNotesSet
    .map(noteName => Tonal.note(`${Tonal.note(noteName).pc}0`).midi)
    .sort();

  const matchingScales = scaleData.keyScales.filter(scale => {
    for (const noteMidi of selectedNotesAbstractMidi) {
      if (!scale.notesAbstractMidi.has(noteMidi)) {
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
            <TracksView
              midi={midiFile}
              {...{selectedNotes, setSelectedNotes}}
            />
          </div>
          <div style={{width: '33%', overflow: 'hidden'}}>
            <SelectionInfo {...{scaleData, selectedNotes, notePlayer}} />
          </div>
        </div>
      )}
    </div>
  );
}
