import React from 'react';
import simplifyEnharmonics from './simplifyEnharmonics';
import useKeyboardInteractions from './useKeyboardInteractions';
import styles from './keyboardStyles';

function range(size, startAt = 0) {
  return [...Array(size).keys()].map((i) => i + startAt);
}

const whiteNotes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const notesWithSharps = new Set(['C', 'D', 'F', 'G', 'A']);

const highlightTypeColors = {
  scale: '#4287f5',
  chord: 'orange',
};

function Keyboard(props: {
  highlightKeys: Array<string>;
  startOctave: number;
  octaves: number;
  highlightType: string;
  notePlayer: Object;
}) {
  const numKeys = whiteNotes.length * props.octaves;
  const keys = [];

  const {highlightKeys, highlightType, notePlayer} = props;

  const highlightKeysSharpified = React.useMemo(
    () => (highlightKeys ? highlightKeys.map(simplifyEnharmonics) : null),
    [highlightKeys]
  );

  const {pressedKeys, makeHandlers} = useKeyboardInteractions({notePlayer});

  range(props.octaves, props.startOctave).forEach((octave, octaveOffset) => {
    whiteNotes.forEach((note, noteOffset) => {
      const noteName = note + octave;
      const noteNameSharp = note + '#' + octave;
      keys.push(
        <div
          key={noteName}
          {...makeHandlers(noteName)}
          style={{
            ...styles.whiteKey,
            ...(highlightKeysSharpified &&
            highlightKeysSharpified.includes(noteName)
              ? {background: highlightTypeColors[highlightType]}
              : null),
            ...(pressedKeys.has(noteName) ? styles.pressed : null),
            left:
              (octaveOffset * whiteNotes.length + noteOffset) *
              (styles.whiteKey.width - 1),
          }}
        >
          <div style={styles.noteLabel}>{note === 'C' ? noteName : note}</div>
        </div>
      );

      if (notesWithSharps.has(note)) {
        keys.push(
          <div
            key={noteNameSharp}
            {...makeHandlers(noteNameSharp)}
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
