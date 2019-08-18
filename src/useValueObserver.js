import React from 'react';

export default function useValueObserver(
  currentValue,
  onChange: (value, prevValue) => void
) {
  const valueRef = React.useRef(currentValue);

  React.useEffect(() => {
    const prevValue = valueRef.current;
    valueRef.current = currentValue;

    if (prevValue !== currentValue) {
      onChange(currentValue, prevValue);
    }
  }, [currentValue, onChange]);
}
