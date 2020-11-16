import React from 'react';

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
  height: 46,
  overflow: 'hidden',
  textAlign: 'center',
};

export default React.memo(function ChordButton({
  chordData,
  playChord,
  setLastChord,
  octave,
  strumming,
  strumMode,
  selected,
  showScaleDegrees,
  onMouseOver,
}) {
  let noteNames = null;

  if (SHOW_NOTE_NAMES) {
    if (showScaleDegrees) {
      noteNames = (
        <div>
          <small>
            {chordData.chord.intervals
              // .map((v) => v.replace(/\D*/g, ''))
              .join()}
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
        background: chordTypeColors[chordData.chordType],
        border: '1px solid',
        borderColor: selected ? 'rgba(0,0,0,0.2)' : 'transparent',
      }}
      onMouseDown={() => {
        playChord(chordData, octave, strumming, strumMode);
        setLastChord(chordData.chordName);
        console.log(chordData);
      }}
      onMouseEnter={(e) => {
        if (e.buttons > 0) {
          playChord(chordData, octave, strumming, strumMode);
          setLastChord(chordData.chordName);
        }
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
        {noteNames}
      </div>
    </div>
  );
});
