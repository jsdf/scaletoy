import Tone from 'tone/Tone/core/Tone';
import Sampler from 'tone/Tone/instrument/Sampler';
import Frequency from 'tone/Tone/type/Frequency';
import { Instrument } from './AudioAPI';

function createDX7(): Promise<Instrument> {
  return new Promise((resolve) => {
    const sampler = new Sampler(
      {
        C3: require('./samples/dexed-epiano-C2.m4a'),
        'D#3': require('./samples/dexed-epiano-Ds2.m4a'),
        'F#3': require('./samples/dexed-epiano-Fs2.m4a'),
        A3: require('./samples/dexed-epiano-A2.m4a'),
      },
      function () {
        console.log('samples loaded');
      }
    ).toMaster();

    const dx7: Instrument = {
      connect(destinationNode: AudioNode, output?: number, input?: number): AudioNode {
        sampler.connect(destinationNode);
        return destinationNode;
      },
      disconnect(destinationNode?: AudioNode) {
        sampler.disconnect(destinationNode);
      },
      onMidi([type, note, velo]) {
        switch (type) {
          case 0x90:
            sampler.triggerAttack(
              new Frequency(note, 'midi'),
              Tone.context.currentTime,
              velo / 127
            );
            break;
          case 0x80:
            sampler.triggerRelease(
              new Frequency(note, 'midi'),
              Tone.context.currentTime,
              velo / 127
            );
            break;
        }
      },
      setPatch(patch) {
        // not implemented
      },
    };

    resolve(dx7);
  });
}

export async function sampledDX7(actx: AudioContext): Promise<Instrument> {
  Tone.setContext(actx);
  const dx7 = await createDX7();
  return dx7;
}
