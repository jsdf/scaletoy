import React from 'react';

import Vector2 from './Vector2';
import {zoomInAtPointClamped} from './viewport';

const Controls = React.memo(function Controls({
  mode,
  onModeChange,
  viewportState,
  getDefaultViewportState,
  onViewportStateChange,
  viewportDimensions,
  minZoom,
  maxZoom,
}) {
  return (
    <>
      {['select', 'pan'].map((value) => (
        <button
          key={value}
          style={{
            background: value === mode ? '#fff' : '#ccc',
          }}
          onClick={() => onModeChange(value)}
        >
          {value}
        </button>
      ))}
      <label style={{fontSize: 24}}>
        ⬌
        <input
          type="range"
          value={viewportState.zoom.x}
          min={minZoom ? minZoom.x : 0.5}
          max={maxZoom ? maxZoom.x : 10}
          step={0.01}
          onChange={(e) =>
            onViewportStateChange((s) => {
              const updatedZoom = s.zoom.clone();
              updatedZoom.x = parseFloat(e.target.value);

              const zoomPos = new Vector2({
                x: viewportDimensions.width / 2,
                y: viewportDimensions.height / 2,
              });

              return zoomInAtPointClamped(
                s,
                zoomPos,
                updatedZoom,
                minZoom,
                maxZoom
              );
            })
          }
        />
      </label>
      <label style={{fontSize: 24}}>
        ⬍
        <input
          type="range"
          value={viewportState.zoom.y}
          min={minZoom ? minZoom.y : 0.5}
          max={maxZoom ? maxZoom.y : 10}
          step={0.01}
          onChange={(e) =>
            onViewportStateChange((s) => {
              const updatedZoom = s.zoom.clone();
              updatedZoom.y = parseFloat(e.target.value);

              const zoomPos = new Vector2({
                x: viewportDimensions.width / 2,
                y: viewportDimensions.height / 2,
              });

              return zoomInAtPointClamped(
                s,
                zoomPos,
                updatedZoom,
                minZoom,
                maxZoom
              );
            })
          }
        />
      </label>
      {getDefaultViewportState && (
        <button
          onClick={() => onViewportStateChange(getDefaultViewportState())}
        >
          reset
        </button>
      )}
    </>
  );
});

export default Controls;
