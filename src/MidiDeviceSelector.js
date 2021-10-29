import React from 'react';

export default function MidiDeviceSelector({type, onChange, selectedPort}) {
  const [availablePorts, setAvailablePorts] = React.useState([]);

  const accessType = type == 'input' ? 'inputs' : 'outputs';

  React.useEffect(() => {
    if (!navigator.requestMIDIAccess) {
      return;
    }
    navigator.requestMIDIAccess().then((access) => {
      setAvailablePorts(Array.from(access[accessType].values()));

      access.onstatechange = function(e) {
        setAvailablePorts(Array.from(access[accessType].values()));
      };
    });
  }, []);

  return (
    <label>
      midi {type == 'input' ? 'in' : 'out'}:{' '}
      <select
        onChange={(e) => {
          onChange(availablePorts[parseInt(e.currentTarget.value)]);
        }}
        value={availablePorts.indexOf(selectedPort)}
      >
        <option key={-1} value={-1}>
          (none)
        </option>
        {availablePorts.map((port, i) => (
          <option key={i} value={i}>
            {port.name}
          </option>
        ))}
      </select>
    </label>
  );
}
