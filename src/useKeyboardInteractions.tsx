import React from 'react';

export default function useKeyboardInteractions({notePlayer}) {
  const [pressedKeys, setPressedKeys] = React.useState(() => new Set());

  const pressedKeysRef = React.useRef(new Set());

  const pressedKeysAPI = React.useMemo(() => {
    return {
      setKeyPressed(noteName) {
        const prev = pressedKeysRef.current;

        if (!prev.has(noteName)) {
          notePlayer.triggerAttack(noteName);
          const updated = new Set(prev).add(noteName);
          pressedKeysRef.current = updated;
          setPressedKeys(updated);
        }
      },
      setKeyReleased(noteName) {
        const prev = pressedKeysRef.current;

        if (prev.has(noteName)) {
          const updated = new Set(prev);
          updated.delete(noteName);
          pressedKeysRef.current = updated;
          setPressedKeys(updated);
          notePlayer.triggerRelease(noteName);
        }
      },
    };
  }, [setPressedKeys, notePlayer]);

  function makeHandlers(noteName) {
    return {
      onMouseOver: (e) => {
        if (e.buttons > 0) {
          pressedKeysAPI.setKeyPressed(noteName);
        }
      },
      onMouseDown: () => {
        pressedKeysAPI.setKeyPressed(noteName);
      },
      onMouseUp: () => {
        pressedKeysAPI.setKeyReleased(noteName);
      },
      onMouseOut: () => {
        pressedKeysAPI.setKeyReleased(noteName);
      },
    };
  }

  return {pressedKeys, pressedKeysAPI, makeHandlers};
}
