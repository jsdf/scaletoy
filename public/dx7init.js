function initDX7(publicUrl) {
  var banklist = ['ROM1A.SYX', 'ENO.SYX'];

  const errHandler = e => {
    console.error(e);
    debugger;
  };

  var controllerScripts = [
    publicUrl + '/wam/wamsdk/wam-controller.js',
    publicUrl + '/wam/dx7/dx7-awn.js',
  ];

  var actx = new AudioContext();
  AWPF.polyfill(actx, controllerScripts)
    .then(function() {
      if (AWPF.isAudioWorkletPolyfilled) {
        // document.getElementById('unsupported').style.display = 'block';
        document.querySelector('.dx7').style.display = 'none';

        onDX7Init(null, actx);
        return;
      }
      DX7.importScripts(publicUrl, actx)
        .then(() => {
          window.dx7 = new DX7(actx, {samplesPerBuffer: 256});
          var gainNode = actx.createGain();

          dx7.connect(gainNode);
          // TODO implement volume control
          // gainNode.gain.setValueAtTime(0.2, actx.currentTime);

          gainNode.connect(actx.destination);

          initGUI(new DX7Library(banklist, publicUrl), dx7);
          initMidi(dx7);

          onDX7Init(dx7, actx);
        })
        .catch(errHandler);
    })
    .catch(errHandler);
}

function initShimGUI(instrument) {
  // -- midi keyboard
  var velo = 80;
  var midikeys = new QwertyHancock({
    container: document.getElementById('keys'),
    width: this.width,
    height: 60,
    margin: 0,
    octaves: 6,
    startNote: 'C2',
    oct: 4,
    whiteNotesColour: 'white',
    blackNotesColour: 'black',
    activeColour: 'orange',
  });
  midikeys.keyDown = (note, name) => instrument.onMidi([0x90, note, velo]);
  midikeys.keyUp = (note, name) => instrument.onMidi([0x80, note, velo]);
}

function initDX7Shim(dx7, actx) {
  initShimGUI(dx7);
  initMidi(dx7);
  onDX7Init(dx7, actx);
}
