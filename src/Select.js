import React from 'react';

export default function Select({label, options, value, onChange}) {
  return (
    <label>
      {label}:{' '}
      <select
        value={value}
        onChange={React.useCallback(
          (event) => onChange(event.currentTarget.value),
          [onChange]
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
