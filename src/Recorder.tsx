import React from 'react';
import downloadFile from './downloadFile';

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

    const fileName = 'audio.ogg';

    downloadFile(blob, fileName);
  };

  return mediaRecorder;
}

function Recorder(props) {
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
}

function ShimRecorder(props) {
  if (typeof MediaRecorder == 'undefined') {
    return <button disabled>[recording not available]</button>;
  }

  return <Recorder {...props} />;
}

export default React.memo(ShimRecorder);
