// @flow
import React from 'react';
import * as Midi from '@tonaljs/midi';
import * as Tonal from '@tonaljs/tonal';
import Details from './Details';
import simplifyEnharmonics from './simplifyEnharmonics';

const PIANOROLL_NOTE_HEIGHT = 10;
const PIANOROLL_QUARTER_WIDTH = 10;
const SCROLLBAR_HEIGHT = 10;

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
  zoom,
  scaleNotes,
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
    (ev) => {
      return {
        left: (ev.ticks / midi.header.ppq) * PIANOROLL_QUARTER_WIDTH * zoom,
        top: (midiRange - (ev.midi - extents.minNote)) * PIANOROLL_NOTE_HEIGHT,
        width:
          (ev.durationTicks / midi.header.ppq) * PIANOROLL_QUARTER_WIDTH * zoom,
        height: PIANOROLL_NOTE_HEIGHT,
      };
    },
    [midi.header.ppq, extents.minNote, midiRange, zoom]
  );

  const selectNotes = React.useCallback(() => {
    const state = selectionRef.current;
    if (state) {
      const box = getSelectionBox(state);

      const selectedNotes = track.notes.filter((ev) => {
        const layout = getNoteLayout(ev);

        return collision(layout, box);
      });

      setSelectedNotes(new Set(selectedNotes));
    }
  }, [track, getNoteLayout, setSelectedNotes]);

  const onMouseDown = React.useCallback((e) => {
    selectionRef.current = {
      start: getOffsetInTarget(e),
      end: getOffsetInTarget(e),
      dragging: true,
    };
    updateSelectionEl();
  }, []);

  const onMouseMove = React.useCallback((e) => {
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
    <div style={{overflowX: 'scroll'}}>
      <div
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        style={{
          height:
            (midiRange + 1) * PIANOROLL_NOTE_HEIGHT + 1 + SCROLLBAR_HEIGHT,
          width: tracksWidth * zoom,
          position: 'relative',
          borderBottom: 'solid #555 1px',
        }}
      >
        {' '}
        {[...Array(midiRange + 1).keys()].map((offset) => {
          const midi = midiRange - offset + extents.minNote;
          const noteName = simplifyEnharmonics(Midi.midiToNoteName(midi));
          const note = simplifyEnharmonics(Tonal.note(noteName).pc);

          return (
            <div
              key={'track' + trackIdx + 'row' + offset}
              style={{
                height: PIANOROLL_NOTE_HEIGHT,
                background: scaleNotes.has(note)
                  ? 'rgba(199,200,0,1)'
                  : (Tonal.note(noteName).acc === ''
                                    ? '#555'
                                    : '#333'),
                borderTop: 'solid #222 1px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  marginTop: -1,
                  fontSize: 9,
                  fontFamily: 'Lucida Grande',
                  position: 'fixed',
                  left: 0,
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
              background: selectedNotes.has(ev) ? 'red' : 'rgba(80,100,255,1)',
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
    </div>
  );
}

export default function Piano(props: {
  midi: Object,
  selectedNotes: Set<Object>,
  setSelectedNotes: (Set<Object>) => void,
  zoom: number,
  scaleNotes: Set<string>,
}) {
  const {midi, selectedNotes, setSelectedNotes, zoom, scaleNotes} = props;
  const trackExtents = React.useMemo(() => {
    return midi.tracks.map((t) => {
      return t.notes.length === 0
        ? {minNote: 0, maxNote: 12, maxTicks: 0}
        : t.notes.reduce(
            (acc, ev) => {
              const minNote = Math.min(acc.minNote, ev.midi);
              return {
                minNote,
                maxNote: Math.max(acc.maxNote, ev.midi, minNote + 12),
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
          <Details
            key={trackIdx}
            startOpen={false}
            summary={
              <>
                Track {trackIdx + 1}:{' '}
                {track.instrument && track.instrument.name}
              </>
            }
          >
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
                zoom,
                scaleNotes,
              }}
            />
          </Details>
        );
      })}
    </div>
  );
}
