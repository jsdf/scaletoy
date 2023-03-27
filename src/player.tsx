import React from 'react';
import * as Tonal from '@tonaljs/tonal';

const NOTE_ON = 0x90;
const NOTE_OFF = 0x80;
const velocityMidi = 80;

function addEvents(events, newEvents) {
  const updatedEvents = events.concat(newEvents);
  updatedEvents.sort((a, b) => a.time - b.time);
  return updatedEvents;
}

function onTick(events, audioApi, onMidi) {
  let i = 0;
  for (; i < events.length; i++) {
    const nextEvent = events[i];
    if (nextEvent.time > audioApi.actx.currentTime) {
      break;
    }

    onMidi(nextEvent.message);
  }

  return i === 0 ? events : events.slice(i);
}
function playNoteOnOff(events, noteName, start, end) {
  const noteMidi = Tonal.note(noteName).midi;

  let updatedEvents = events;
  return addEvents(updatedEvents, [
    {
      message: [NOTE_ON, noteMidi, velocityMidi],
      time: start,
    },
    {
      message: [NOTE_OFF, noteMidi, velocityMidi],
      time: end,
    },
  ]);
}

export function usePlayerTick(audioApi, onMidi, setEvents) {
  React.useEffect(() => {
    // start event-consuming interval
    const id = setInterval(() => {
      setEvents((events) => {
        const updated = onTick(events, audioApi, onMidi);
        // onTick can only remove events
        if (updated.length === events.length) {
          return events;
        }
        return updated;
      });
    }, 1);
    return () => {
      clearInterval(id);
    };
  }, [onMidi, audioApi, setEvents]);
}

export function usePlayNotes(setEvents, audioApi, bpm) {
  const playNotes = React.useCallback(
    (notes) => {
      console.log(notes);
      setEvents((events) => {
        let updatedEvents = events;
        const currentTime = audioApi.actx.currentTime;
        const beatDurationSeconds = (1 / bpm) * 60;
        let lastStartTimeOffset = 0;
        notes.forEach((noteName) => {
          lastStartTimeOffset += beatDurationSeconds;

          updatedEvents = playNoteOnOff(
            updatedEvents,
            noteName,
            currentTime + lastStartTimeOffset,
            currentTime + lastStartTimeOffset + beatDurationSeconds
          );
        });

        return updatedEvents;
      });
    },
    [setEvents, audioApi, bpm]
  );
  return playNotes;
}
