import React from 'react';
import {Midi} from '@tonejs/midi';
import downloadFile from './downloadFile';
import * as Tonal from '@tonaljs/tonal';

export default function({history, beatDurationSeconds, bpm, strumming}) {
  const exportHistory = React.useCallback(() => {
    // create a new midi file
    const midi = new Midi();
    midi.header.setTempo(bpm);
    // add a track
    const track = midi.addTrack();

    history.forEach((chordData, eventIdx) => {
      const chordNotes = chordData.chordNotesForOctave;
      const beatStart = eventIdx * beatDurationSeconds * 2;
      const strummingSeconds = strumming / 1000;

      chordNotes.forEach((noteName, i) => {
        const strumDelay = i * strummingSeconds;

        track.addNote({
          midi: Tonal.note(noteName).midi,
          // seconds
          time: beatStart + strumDelay,
          duration: beatDurationSeconds + strumDelay,
        });
      });
    });

    const blob = new Blob([midi.toArray()], {type: 'audio/midi'});
    downloadFile(blob, 'export.mid');
  }, [history]);

  return <button onClick={exportHistory}>export midi</button>;
}
