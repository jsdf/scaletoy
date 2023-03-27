import React from 'react';
import Checkbox from './Checkbox';

export default function Sticky({
  children,
  className,
  name,
  sticky,
  onSetSticky,
}) {
  return (
    <div
      className={className}
      style={
        sticky
          ? {position: 'sticky', top: -1, zIndex: 2}
          : {position: 'relative'}
      }
    >
      {children}
      <div style={{position: 'absolute', top: 1, right: 1}}>
        <Checkbox
          label="sticky"
          onChange={React.useCallback(
            (enabled) => {
              onSetSticky(name, enabled);
            },
            [onSetSticky, name]
          )}
          checked={sticky}
          align="right"
        />
      </div>
    </div>
  );
}
