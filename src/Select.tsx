import React from 'react';

export default function Select({label, options, type, value, onChange}) {
  return (
    <label>
      {label}:{' '}
      <select
        value={value}
        onChange={React.useCallback(
          (event) =>
            onChange(
              type === 'number'
                ? parseFloat(event.currentTarget.value)
                : event.currentTarget.value
            ),
          [onChange, type]
        )}
      >
        {options.map((key) => {
          return (
            <option key={key} value={key}>
              {key}
            </option>
          );
        })}
      </select>
    </label>
  );
}
