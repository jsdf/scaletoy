import React from 'react';

export default function Range({
  label,
  min,
  max,
  step,
  value,
  formatValue,
  showValue,
  onChange,
}) {
  return (
    <label>
      {label}:{' '}
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={React.useCallback(
          (e) => {
            onChange(parseInt(e.currentTarget.value));
          },
          [onChange]
        )}
      />
      {showValue && (
        <>
          {' '}
          <input
            type="number"
            value={formatValue ? formatValue(value) : value}
            readOnly
          />
        </>
      )}
    </label>
  );
}
