import React from 'react';

export default function MidiOutput({onChangeOutput, selectedOutput}) {
  const [outputs, setOutputs] = React.useState([]);

  React.useEffect(() => {
    if (!navigator.requestMIDIAccess) {
      return;
    }
    navigator.requestMIDIAccess().then(access => {
      setOutputs(Array.from(access.outputs.values()));

      access.onstatechange = function(e) {
        setOutputs(Array.from(access.outputs.values()));
      };
    });
  }, []);

  return (
    <label>
      midi out:{' '}
      <select
        onChange={e => {
          onChangeOutput(outputs[parseInt(e.currentTarget.value)]);
        }}
        value={outputs.indexOf(selectedOutput)}
      >
        <option key={-1} value={-1}>
          (none)
        </option>
        {outputs.map((output, i) => (
          <option key={i} value={i}>
            {output.name}
          </option>
        ))}
      </select>
    </label>
  );
}
