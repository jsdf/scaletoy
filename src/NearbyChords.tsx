import React from 'react';
import simplifyEnharmonics from './simplifyEnharmonics';
import ChordButton from './ChordButton';

export default function NearbyChords({
  scaleData,
  playChord,
  endChord,
  strumming,
  strumMode,
  showScaleDegrees,
  setHighlightedKeys,
  lastChord,
}) {
  const content = !lastChord ? null : (
    <>
      {`${lastChord.chord.symbol}` +
        (lastChord.chord.name.length > 2 ? ` (${lastChord.chord.name})` : '')}
      {lastChord.rotations && (
        <div style={{display: 'flex'}}>
          {lastChord.rotations.map((chordData, i) => {
            return (
              <div
                key={i}
                style={{
                  width: `${(1 / 7) * 100}vw`,
                  height: 46,
                  overflow: 'hidden',
                }}
              >
                <ChordButton
                  {...{
                    chordData,
                    playChord,
                    endChord,
                    strumming,
                    strumMode,
                    showScaleDegrees,
                    selected: false,
                    onMouseOver: setHighlightedKeys,
                    source: 'nearby',
                  }}
                />
              </div>
            );
          })}
        </div>
      )}
    </>
  );

  return <div style={{height: 60, overflow: 'hidden'}}>{content}</div>;
}
