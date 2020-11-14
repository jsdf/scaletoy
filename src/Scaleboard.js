import React from 'react';
import simplifyEnharmonics from './simplifyEnharmonics';

// tonic, dominant, submediant, mediant, supertonic, leading tone, subdominant
const scaleDegreeImportance = [1, 5, 6, 3, 2, 7];

function range(size, startAt = 0) {
  return [...Array(size).keys()].map((i) => i + startAt);
}

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
    cursor: 'pointer',
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
  tonicKey: {
    background: '#ccc',
  },
  noteLabel: {
    width: 20,
    marginTop: 70,
    fontSize: 10,
  },
  highlighted: {
    background: 'orange',
  },
};

const highlightTypeColors = {
  scale: '#4287f5',
  chord: 'orange',
};

function atStartOfOctave(note) {
  return note[0] > 'B';
}

function Scaleboard(props: {
  highlightKeys: Array<string>;
  startOctave: number;
  octaves: number;
  highlightType: string;
  notePlayer: Object;
  scalePitchClasses: Array<string>;
  showScaleDegrees: boolean;
  scaleSteps: number;
}) {
  const numKeys = props.scaleSteps * props.octaves;
  const keys = [];

  const {highlightKeys, highlightType, notePlayer} = props;

  const highlightKeysSharpified = React.useMemo(
    () => (highlightKeys ? highlightKeys.map(simplifyEnharmonics) : null),
    [highlightKeys]
  );

  function makeHandlers(noteName) {
    return {
      onMouseOver: (e) => {
        if (e.buttons > 0) {
          notePlayer.triggerAttack(noteName);
        }
      },
      onMouseDown: () => notePlayer.triggerAttack(noteName),
      onMouseUp: () => notePlayer.triggerRelease(noteName),
      onMouseOut: () => notePlayer.triggerRelease(noteName),
    };
  }

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
  range(props.octaves, props.startOctave).forEach((octave, octaveOffset) => {
    simplifiedPitchClassesForImportance
      .slice()
      .sort((a, b) => {
        if (atStartOfOctave(a) === atStartOfOctave(b)) {
          return a < b ? -1 : 1;
        }

        return atStartOfOctave(a) ? -1 : 1;
      })
      .forEach((note, noteOffset) => {
        const noteName = note + octave;
        keys.push(
          <div
            key={noteName}
            {...makeHandlers(noteName)}
            style={{
              ...styles.whiteKey,
              ...(note === props.scalePitchClasses[0] ? styles.tonicKey : null),
              ...(highlightKeysSharpified &&
              highlightKeysSharpified.includes(noteName)
                ? {background: highlightTypeColors[highlightType]}
                : null),
              left:
                (octaveOffset * simplifiedPitchClassesForImportance.length +
                  noteOffset) *
                (styles.whiteKey.width - 1),
            }}
          >
            <div style={styles.noteLabel}>
              {props.showScaleDegrees ? notesScaleDegrees.get(note) : noteName}
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
