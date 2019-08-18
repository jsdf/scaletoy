import React from 'react';

function range(size, startAt = 0) {
  return [...Array(size).keys()].map(i => i + startAt);
}

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
    marginBottom: 20,
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
    marginTop: 70,
  },
  highlighted: {
    background: 'orange',
  },
  blackKey: {
    position: 'absolute',
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
    width: 9,
    height: 50,
    background: 'black',
    border: 'solid 1px black',

    zIndex: 1,
  },
};

function Keyboard(props: {
  highlightKeys: Array<string>,
  startOctave: number,
  octaves: number,
}) {
  const numKeys = whiteNotes.length * props.octaves;
  const keys = [];

  range(props.octaves, props.startOctave).forEach((octave, octaveOffset) => {
    whiteNotes.forEach((note, noteOffset) => {
      const noteName = note + octave;
      const noteNameSharp = note + '#' + octave;
      keys.push(
        <div
          key={noteName}
          style={{
            ...styles.whiteKey,
            ...(props.highlightKeys && props.highlightKeys.includes(noteName)
              ? styles.highlighted
              : null),
            left:
              (octaveOffset * whiteNotes.length + noteOffset) *
              (styles.whiteKey.width - 1),
          }}
        >
          <div style={styles.noteLabel}>{noteName}</div>
        </div>
      );

      if (notesWithSharps.has(note)) {
        keys.push(
          <div
            key={noteNameSharp}
            style={{
              ...styles.blackKey,
              ...(props.highlightKeys &&
              props.highlightKeys.includes(noteNameSharp)
                ? styles.highlighted
                : null),
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

export default React.memo(Keyboard);
