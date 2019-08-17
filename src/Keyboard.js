import React from 'react';

function range(size, startAt = 0) {
  return [...Array(size).keys()].map(i => i + startAt);
}

const startOctave = 3;
const octaves = 2;
const whiteNotes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const notesWithSharps = new Set(['C', 'D', 'F', 'G', 'A']);

const styles = {
  container: {
    textAlign: 'center',
  },
  keyboard: {
    display: 'inline-block',
    position: 'relative',
    height: 70,
    marginTop: 20,
  },
  whiteKey: {
    position: 'absolute',
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    width: 20,
    height: 70,
    background: 'white',
    border: 'solid 1px black',
    zIndex: 0,
  },
  noteLabel: {
    width: 20,
    marginTop: -20,
  },
  blackKey: {
    position: 'absolute',
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
    width: 9,
    height: 50,
    background: 'black',

    zIndex: 1,
  },
};

export default function Keyboard() {
  const numKeys = whiteNotes.length * octaves;
  const keys = [];

  range(octaves, startOctave).forEach((octave, octaveOffset) => {
    whiteNotes.forEach((note, noteOffset) => {
      keys.push(
        <div
          key={note + octave}
          style={{
            ...styles.whiteKey,
            left:
              (octaveOffset * whiteNotes.length + noteOffset) *
              (styles.whiteKey.width - 1),
          }}
        >
          <div style={styles.noteLabel}>{note + octave}</div>
        </div>
      );

      if (notesWithSharps.has(note)) {
        keys.push(
          <div
            key={note + '#' + octave}
            style={{
              ...styles.blackKey,
              left:
                (octaveOffset * whiteNotes.length + noteOffset + 1) *
                  (styles.whiteKey.width - 1) -
                (styles.blackKey.width - 1) / 2,
            }}
          />
        );
      }
    });
  });
  return (
    <div style={styles.container}>
      <div style={{...styles.keyboard, width: numKeys * styles.whiteKey.width}}>
        {keys}
      </div>
    </div>
  );
}
