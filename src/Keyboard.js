import React from 'react';
import * as Tonal from '@tonaljs/tonal';
import * as Note from '@tonaljs/note';

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
    marginTop: 16,
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

const highlightTypeColors = {
  scale: '#4287f5',
  chord: 'orange',
};

function Keyboard(props: {
  highlightKeys: Array<string>,
  startOctave: number,
  octaves: number,
  highlightType: string,
}) {
  const numKeys = whiteNotes.length * props.octaves;
  const keys = [];

  const {highlightKeys, highlightType} = props;

  const highlightKeysSharpified = React.useMemo(
    () =>
      highlightKeys
        ? highlightKeys.map(noteName => {
            if (Tonal.note(noteName).acc === 'b') {
              return Note.enharmonic(noteName);
            }

            return noteName;
          })
        : null,
    [highlightKeys]
  );

  range(props.octaves, props.startOctave).forEach((octave, octaveOffset) => {
    whiteNotes.forEach((note, noteOffset) => {
      const noteName = note + octave;
      const noteNameSharp = note + '#' + octave;
      keys.push(
        <div
          key={noteName}
          style={{
            ...styles.whiteKey,
            ...(highlightKeysSharpified &&
            highlightKeysSharpified.includes(noteName)
              ? {background: highlightTypeColors[highlightType]}
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
              ...(highlightKeysSharpified &&
              highlightKeysSharpified.includes(noteNameSharp)
                ? {background: highlightTypeColors[highlightType]}
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
