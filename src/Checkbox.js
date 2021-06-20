import React from 'react';

export default function Checkbox({label, checked, onChange, align}) {
  return (
    <label>
      {align === 'right' && label}
      <input
        type="checkbox"
        onChange={React.useCallback(() => onChange(!checked), [
          checked,
          onChange,
        ])}
        checked={checked}
      />
      {align !== 'right' && label}
    </label>
  );
}
