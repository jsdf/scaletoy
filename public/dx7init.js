var actx, dx7;

function initDX7() {
  var banklist = ['ROM1A.SYX', 'ENO.SYX'];

  const errHandler = e => {
    console.error(e);
    debugger;
  };

  var controllerScripts = [
    '/wam/wamsdk/wam-controller.js',
    '/wam/dx7/dx7-awn.js',
  ];

  var actx = new AudioContext();
  AWPF.polyfill(actx, controllerScripts)
    .then(function() {
      if (AWPF.isAudioWorkletPolyfilled)
        document.getElementById('unsupported').style.display = 'block';
      DX7.importScripts(actx)
        .then(() => {
          dx7 = new DX7(actx, {samplesPerBuffer: 256});
          var gainNode = actx.createGain();

          dx7.connect(gainNode);
          // TODO implement volume control
          // gainNode.gain.setValueAtTime(0.2, actx.currentTime);

          gainNode.connect(actx.destination);

          initGUI(new DX7Library(banklist));
          initMidi();

          onDX7Init(dx7, actx);
        })
        .catch(errHandler);
    })
    .catch(errHandler);
}
