import React from 'react';

import {useRef, useEffect, useState, useCallback} from 'react';

import MidiDeviceSelector from './MidiDeviceSelector';

import Select from './Select';

const publicUrl = process.env.PUBLIC_URL;

const USE_SAMPLED_DX7 = Boolean(
  new URL(document.location.href).searchParams.get('sampled')
);

const banklist = [
  'rom1a.syx',
  'rom1b.syx',
  'rom2a.syx',
  'rom2b.syx',
  'rom3a.syx',
  'rom3b.syx',
  'rom4a.syx',
  'rom4b.syx',
  'eno.syx',
];

function extractName(
  data,
  offset = 118 // 118 for packed, 145 for unpacked
) {
  let name = '';
  for (let n = 0; n < 10; n++) {
    let c = data[n + offset];
    switch (c) {
      case 92:
        c = 'Y';
        break; // yen
      case 126:
        c = '>';
        break; // >>
      case 127:
        c = '<';
        break; // <<
      default:
        if (c < 32 || c > 127) c = 32;
        break;
    }
    name += String.fromCharCode(c);
  }
  return name;
}

function loadBank(filename) {
  var url = publicUrl + '/wam/dx7/presets/' + filename;
  return new Promise((resolve, reject) => {
    fetch(url).then((resp) => {
      resp.arrayBuffer().then((data) => {
        // -- packed bank with sysex frame (32 patches)
        if (data.byteLength != 4104) reject();
        const patches = [];
        data = new Uint8Array(data);
        data = data.subarray(6, 4102);
        for (var i = 0; i < 32; i++) {
          var offset = i * 128;
          var voice = data.subarray(offset, offset + 128);
          var name = extractName(voice);
          patches.push({name, voice});
        }
        resolve(patches);
      });
    });
  });
}

function initDX7(done) {
  const errHandler = (e) => {
    console.error(e);
    debugger;
  };

  var controllerScripts = [
    publicUrl + '/wam/wamsdk/wam-controller.js',
    publicUrl + '/wam/dx7/dx7-awn.js',
  ];

  var actx = new AudioContext();

  /* global AWPF, DX7 */
  AWPF.polyfill(actx, controllerScripts)
    .then(function() {
      if (AWPF.isAudioWorkletPolyfilled) {
        done(null, actx);
        return;
      }
      DX7.importScripts(publicUrl, actx)
        .then(() => {
          const dx7 = new DX7(actx, {samplesPerBuffer: 256});
          var gainNode = actx.createGain();

          dx7.connect(gainNode);
          // TODO implement volume control
          // gainNode.gain.setValueAtTime(0.2, actx.currentTime);

          gainNode.connect(actx.destination);

          done(dx7, actx);
        })
        .catch(errHandler);
    })
    .catch(errHandler);
}

export default function Synth({onLoaded}) {
  const audioApiRef = useRef(null);
  const [midiIn, setMidiIn] = React.useState(null);

  const [bank, setBank] = useState(banklist[0]);
  const [bankData, setBankData] = useState(null);
  const [patch, setPatch] = useState('E.PIANO 1 ');

  const mountedRef = useRef(true);
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const changeBankRef = useRef();
  if (!changeBankRef.current) {
    changeBankRef.current = (bank) => {
      loadBank(bank).then((bankData) => {
        if (!mountedRef.current) return;
        setBankData(bankData);

        if (!bankData.find((p) => p.name === patch)) {
          setPatch(bankData[0].name);
        }
      });
    };
  }

  useEffect(() => {
    changeBankRef.current(bank);
  }, [bank]);

  useEffect(() => {
    if (midiIn == null) {
      return;
    }
    midiIn.onmidimessage = (message) => {
      if (audioApiRef.current) {
        audioApiRef.current.dx7.onMidi(message.data);
      }
    };
    return () => {
      midiIn.onmidimessage = null;
    };
  }, [midiIn]);

  useEffect(() => {
    if (!audioApiRef.current) {
      function done(audioApi) {
        if (!mountedRef.current) return;
        audioApiRef.current = audioApi;
        changeBankRef.current(banklist[0]);
        onLoaded(audioApi);
      }
      async function loadSampled() {
        const {sampledDX7} = await import('./sampledDX7');
        const audioApi = await sampledDX7();
        done(audioApi);
      }
      if (USE_SAMPLED_DX7) {
        loadSampled();
      } else {
        initDX7((dx7, actx) => {
          if (!dx7) {
            // fall back to sampled
            loadSampled();
          } else {
            done({dx7, actx});
          }
        });
      }
    } else {
      onLoaded(audioApiRef.current);
    }
  }, [onLoaded]);

  useEffect(() => {
    if (!patch || !bankData) {
      return;
    }
    const newPatchData = bankData.find((p) => p.name === patch) || bankData[0];
    if (newPatchData && audioApiRef.current) {
      audioApiRef.current.dx7.setPatch(newPatchData.voice);
    }
  }, [patch, bankData]);

  return (
    <div className="dx7">
      <details open>
        <summary>synthesizer</summary>
        <div id="content">
          <div id="topbar">
            <div>webDX7</div>
            <div className="right">
              <div className="control">
                <Select
                  label="bank"
                  options={banklist}
                  value={bank}
                  onChange={(value) => setBank(value)}
                />
              </div>

              <div className="control">
                <Select
                  label="patch"
                  options={bankData ? bankData.map((patch) => patch.name) : []}
                  value={patch}
                  onChange={(value) => setPatch(value)}
                />
              </div>

              <div className="control">
                <MidiDeviceSelector
                  type="input"
                  selectedPort={midiIn}
                  onChange={setMidiIn}
                />
              </div>
            </div>
          </div>
        </div>
      </details>
    </div>
  );
}
