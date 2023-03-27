import React from 'react';

export default function useValueObserver<T>(
  currentValue: T,
  onChange: (value: T, prevValue: T) => void
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
