import React from 'react';

export default function Checkbox({label, checked, onChange}) {
  return (
    <label>
      <input
        type="checkbox"
        onChange={React.useCallback(() => onChange((s) => !s), [onChange])}
        checked={checked}
      />
      {label}
    </label>
  );
}
