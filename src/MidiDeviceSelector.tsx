import React from 'react';

function getPorts(access: WebMidi.MIDIAccess, type: WebMidi.MIDIPortType) {
  return type === 'input' ?
    Array.from(access.inputs.values()) :
    Array.from(access.outputs.values());
}

export default function MidiDeviceSelector<TMidiPort extends (WebMidi.MIDIInput | WebMidi.MIDIOutput)>({
  type,
  onChange,
  selectedPort,
  initialPortID
}: {
  type: WebMidi.MIDIPortType,
  onChange: (port: TMidiPort | null) => void
  selectedPort: TMidiPort | null
  initialPortID?: string | null
}) {
  const [availablePorts, setAvailablePorts] = React.useState<TMidiPort[]>([]);

  React.useEffect(() => {
    if (!navigator.requestMIDIAccess) {
      return;
    }
    navigator.requestMIDIAccess().then((access) => {
      const ports =
        getPorts(access, type);
      setAvailablePorts(ports as TMidiPort[]);
      if (initialPortID != null) {
        const initial = (ports as TMidiPort[]).find(port => port.id === initialPortID)
        if (initial) {
          onChange(initial)
        }
      }

      access.onstatechange = function (e) {
        setAvailablePorts(
          getPorts(access, type) as TMidiPort[]
        );
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
        value={selectedPort ? availablePorts.indexOf(selectedPort) : 0}
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
