import React from 'react';

import {useRef} from 'react';

const SHOW_NOTE_NAMES = true;
const SHOW_NOTE_OCTS = true;
const SHOW_FULL_CHORD_NAMES = false;

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
  height: SHOW_FULL_CHORD_NAMES ? 62 : 46,
  overflow: 'hidden',
  textAlign: 'center',
};

export default React.memo(function ChordButton({
  chordData,
  playChord,
  endChord,
  source,
  octave,
  strumming,
  strumMode,
  selected,
  showScaleDegrees,
  onMouseOver,
}) {
  let noteNames = null;

  const chordStartedRef = useRef(false);

  if (SHOW_NOTE_NAMES) {
    if (showScaleDegrees) {
      noteNames = (
        <div>
          <small>
            {chordData.chord ? chordData.chord.intervals.join() : ''}
          </small>
        </div>
      );
    } else {
      noteNames = (
        <div>
          <small>
            {SHOW_NOTE_OCTS
              ? chordData.chordNotesForOctave.join()
              : chordData.chord.notes.join()}
          </small>
        </div>
      );
    }
  }

  return (
    <div
      style={{
        ...buttonStyle,
        background: chordTypeColors[chordData.chordType] || '#ccc',
        border: '1px solid',
        borderColor: selected ? 'rgba(0,0,0,0.2)' : 'transparent',
      }}
      onMouseDown={() => {
        chordStartedRef.current = true;
        playChord(chordData, strumming, strumMode, source);
        console.log(chordData);
      }}
      onMouseUp={() => {
        if (chordStartedRef.current) {
          endChord(chordData, strumming, strumMode, source);
        }
        chordStartedRef.current = false;
      }}
      onMouseEnter={(e) => {
        if (e.buttons > 0) {
          chordStartedRef.current = true;
          playChord(chordData, strumming, strumMode, source);
        }
        onMouseOver(chordData.chordNotesForOctave);
      }}
      onMouseLeave={(e) => {
        if (e.buttons > 0) {
          if (chordStartedRef.current) {
            endChord(chordData, strumming, strumMode, source);
          }
          chordStartedRef.current = false;
        }
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
        {noteNames}
      </div>
    </div>
  );
});
