// @flow
import React from 'react';
import * as Midi from '@tonaljs/midi';
import * as Tonal from '@tonaljs/tonal';

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

export default function Piano(props: {
  midi: Object,
  selectedNotes: Set<Object>,
  setSelectedNotes: (Set<Object>) => void,
}) {
  const {midi, selectedNotes, setSelectedNotes} = props;
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
