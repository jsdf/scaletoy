import Tone from 'tone/Tone/core/Tone';
import Sampler from 'tone/Tone/instrument/Sampler';
import Frequency from 'tone/Tone/type/Frequency';

function createDX7() {
  return new Promise(resolve => {
    const sampler = new Tone.Sampler(
      {
        C3: require('./samples/dexed-epiano-C2.m4a'),
        'D#3': require('./samples/dexed-epiano-Ds2.m4a'),
        'F#3': require('./samples/dexed-epiano-Fs2.m4a'),
        A3: require('./samples/dexed-epiano-A2.m4a'),
      },
      function() {
        console.log('samples loaded');
      }
    ).toMaster();

    const dx7 = {
      connect(dest) {
        sampler.connect(dest);
      },
      disconnect(dest) {
        sampler.disconnect(dest);
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
    };

    resolve(dx7);
  });
}

function getContext() {
  return new Promise(resolve => {
    Tone.getContext(resolve);
  });
}

export async function sampledDX7() {
  const actx = await getContext();
  const dx7 = await createDX7();
  return {
    actx,
    dx7,
  };
}
