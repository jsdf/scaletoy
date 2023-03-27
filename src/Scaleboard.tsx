import React from 'react';
import simplifyEnharmonics from './simplifyEnharmonics';
import useKeyboardInteractions from './useKeyboardInteractions';
import keyboardStyles from './keyboardStyles';

// tonic, dominant, submediant, mediant, supertonic, leading tone, subdominant
const scaleDegreeImportance = [1, 5, 6, 3, 2, 7];

function range(size, startAt = 0) {
  return [...Array(size).keys()].map((i) => i + startAt);
}

const styles = {
  ...keyboardStyles,
  tonicKey: {
    background: '#ccc',
  },
  noteLabel: {
    width: 20,
    marginTop: 70,
    fontSize: 10,
  },
};

const highlightTypeColors = {
  scale: '#4287f5',
  chord: 'orange',
};

const qwerty = "asdfghjkl;'".split('');

function wrap(kX, kLowerBound, kUpperBound) {
  let range_size = kUpperBound - kLowerBound + 1;

  if (kX < kLowerBound)
    kX += range_size * ((kLowerBound - kX) / range_size + 1);

  return kLowerBound + ((kX - kLowerBound) % range_size);
}

function getQwertyOffset(key) {
  const index = qwerty.indexOf(key);
  if (index > -1) {
    return index;
  }
  return null;
}

function atStartOfOctave(note) {
  return note[0] > 'B';
}

const highlightType = 'chord';

function Scaleboard(props: {
  highlightKeys: Array<string>,
  startOctave: number,
  octaves: number,
  notePlayer: Object,
  scalePitchClasses: Array<string>,
  showScaleDegrees: boolean,
  scaleSteps: number,
  setOctave: (s) => void,
}) {
  const numKeys = props.scaleSteps * props.octaves;
  const keys = [];

  const {highlightKeys, notePlayer} = props;

  const highlightKeysSharpified = React.useMemo(
    () => (highlightKeys ? highlightKeys.map(simplifyEnharmonics) : null),
    [highlightKeys]
  );

  const {pressedKeys, pressedKeysAPI, makeHandlers} = useKeyboardInteractions({
    notePlayer,
  });

  const {
    simplifiedPitchClasses,
    importance,
    simplifiedPitchClassesForImportance,
    notesScaleDegrees,
    sortedPitchClassesForImportance,
  } = React.useMemo(() => {
    const simplifiedPitchClasses = props.scalePitchClasses.map(
      simplifyEnharmonics
    );
    const importance = scaleDegreeImportance.slice(0, props.scaleSteps);

    const simplifiedPitchClassesForImportance = importance.map(
      (i) => simplifiedPitchClasses[i - 1]
    );

    const notesScaleDegrees = new Map(
      scaleDegreeImportance.map((scaleDegree) => [
        simplifiedPitchClasses[scaleDegree - 1],
        scaleDegree,
      ])
    );

    const sortedPitchClassesForImportance = simplifiedPitchClassesForImportance
      .slice()
      .sort((a, b) => {
        if (atStartOfOctave(a) === atStartOfOctave(b)) {
          return a < b ? -1 : 1;
        }

        return atStartOfOctave(a) ? -1 : 1;
      });

    return {
      simplifiedPitchClasses,
      importance,
      simplifiedPitchClassesForImportance,
      notesScaleDegrees,
      sortedPitchClassesForImportance,
    };
  }, [props.scalePitchClasses, props.scaleSteps]);

  const qwertyToNoteName = React.useCallback(
    (key) => {
      const qwertyOffset = getQwertyOffset(key);
      if (qwertyOffset == null) {
        return null;
      }

      const pitchClass =
        sortedPitchClassesForImportance[
          qwertyOffset % sortedPitchClassesForImportance.length
        ];

      return (
        pitchClass +
        Math.min(
          7,
          Math.max(
            0,
            props.startOctave +
              Math.floor(qwertyOffset / sortedPitchClassesForImportance.length)
          )
        )
      );
    },
    [sortedPitchClassesForImportance, props.startOctave]
  );

  React.useEffect(() => {
    const qwertyHandlers = {
      onKeyDown(e) {
        const noteName = qwertyToNoteName(e.key);
        if (noteName != null) {
          pressedKeysAPI.setKeyPressed(noteName);
        }
        switch (e.key) {
          case 'z':
            props.setOctave((s) => Math.max(s - 1, 0));
            break;
          case 'x':
            props.setOctave((s) => Math.min(s + 1, 7));
            break;
        }
      },
      onKeyUp(e) {
        const noteName = qwertyToNoteName(e.key);
        if (noteName != null) {
          pressedKeysAPI.setKeyReleased(noteName);
        }
      },
    };

    document.addEventListener('keydown', qwertyHandlers.onKeyDown);
    document.addEventListener('keyup', qwertyHandlers.onKeyUp);
    return () => {
      document.removeEventListener('keydown', qwertyHandlers.onKeyDown);
      document.removeEventListener('keyup', qwertyHandlers.onKeyUp);
    };
  }, [pressedKeysAPI, qwertyToNoteName, props.setOctave]);

  range(props.octaves, props.startOctave).forEach((octave, octaveOffset) => {
    sortedPitchClassesForImportance.forEach((note, noteOffset) => {
      const noteName = note + octave;
      const isTonic = note === props.scalePitchClasses[0];
      keys.push(
        <div
          key={noteName}
          {...makeHandlers(noteName)}
          style={{
            ...styles.whiteKey,
            ...(isTonic ? styles.tonicKey : null),
            ...(highlightKeysSharpified &&
            highlightKeysSharpified.includes(noteName)
              ? {background: highlightTypeColors[highlightType]}
              : null),
            ...(pressedKeys.has(noteName) ? styles.pressed : null),
            left:
              (octaveOffset * simplifiedPitchClassesForImportance.length +
                noteOffset) *
              (styles.whiteKey.width - 1),
          }}
        >
          <div style={styles.noteLabel}>
            {props.showScaleDegrees
              ? notesScaleDegrees.get(note)
              : isTonic
              ? noteName
              : note}
          </div>
        </div>
      );
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

export default React.memo(Scaleboard);
