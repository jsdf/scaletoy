import React from 'react';

function saveData(blob, fileName) {
  var a = document.createElement('a');
  document.body.appendChild(a);
  a.style = 'display: none';

  const url = URL.createObjectURL(blob);
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
  a.remove();
}

function makeNewRecorder(actx, inputNode) {
  const chunks = [];
  const dest = actx.createMediaStreamDestination();
  const mediaRecorder = new MediaRecorder(dest.stream);
  inputNode.connect(dest);

  mediaRecorder.ondataavailable = function(evt) {
    // push each chunk (blobs) in an array
    chunks.push(evt.data);
  };

  mediaRecorder.onstop = function(evt) {
    // Make blob out of our blobs, and open it.
    var blob = new Blob(chunks, {type: 'audio/ogg; codecs=opus'});
    const audioEl = document.createElement('audio');

    const fileName = 'audio.ogg';

    saveData(blob, fileName);
  };

  return mediaRecorder;
}

export default React.memo(function Recorder(props) {
  const recorderRef = React.useRef(
    makeNewRecorder(props.actx, props.inputNode)
  );

  const [recording, setRecording] = React.useState(false);

  const toggleRecording = React.useCallback(() => setRecording(s => !s), [
    setRecording,
  ]);

  React.useEffect(() => {
    if (recording) {
      recorderRef.current.start();
    } else {
      if (recorderRef.current.state !== 'inactive') {
        recorderRef.current.stop();
        recorderRef.current = makeNewRecorder(props.actx, props.inputNode);
      }
    }
  }, [recording]);

  return (
    <button onClick={toggleRecording}>
      {recording ? 'stop recording' : 'record audio'}
    </button>
  );
});
