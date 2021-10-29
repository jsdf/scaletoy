// @flow
import React from 'react';
import useQueryParam, {QUERY_PARAM_FORMATS} from './useQueryParam';
import useLocalStorage from './useLocalStorage';
import './App.css';
import App from './App';
import Synth from './Synth';

function nonnull<T>(v: ?T): T {
  if (v == null) {
    throw new Error('unexpected null');
  }
  return v;
}

function Theme() {
  const [darkMode, setDarkMode] = useLocalStorage('darkMode', false);

  React.useEffect(() => {
    if (darkMode) {
      nonnull(document.documentElement).classList.add('dark-mode');
    } else {
      nonnull(document.documentElement).classList.remove('dark-mode');
    }
  }, [darkMode]);

  return (
    <div style={{position: 'absolute', top: 0, right: 0}}>
      <label>
        dark mode:{' '}
        <input
          type="checkbox"
          checked={darkMode}
          onChange={() => setDarkMode((s) => !s)}
        />
      </label>
    </div>
  );
}

function useRouting() {
  const [route] = useQueryParam(
    'route',
    'chordpalette',
    QUERY_PARAM_FORMATS.string
  );

  switch (route) {
    case 'exploder':
      return React.lazy(() => import('./MidiExploder'));
    case 'chordpalette':
    default:
      return App;
  }
}

function Startup() {
  const [startedAudio, setStartedAudio] = React.useState(false);
  const [audioApi, setAudioApi] = React.useState(null);

  const onStart = React.useCallback(() => {
    nonnull(document.querySelector('.intro')).style.display = 'none';

    setStartedAudio(true);
  }, [setStartedAudio]);

  const onInitSynth = React.useCallback(
    (newAudioApi) => {
      setAudioApi(newAudioApi);
      if (newAudioApi.actx.state === 'running') {
        onStart();
      }
    },
    [onStart]
  );
  const synth = <Synth onLoaded={onInitSynth} />;

  const Route = useRouting();
  if (audioApi && startedAudio) {
    return (
      <>
        {synth}
        <React.Suspense fallback={<div>loading...</div>}>
          <div>
            <Route {...{audioApi}} />
            <Theme />
          </div>
        </React.Suspense>
      </>
    );
  }

  return (
    <>
      {synth}
      <div className="App">
        {audioApi ? (
          <button
            style={{fontSize: 42, borderRadius: 9, cursor: 'pointer'}}
            onClick={() => {
              audioApi.actx.resume();
              onStart();
            }}
          >
            start
          </button>
        ) : (
          'loading...'
        )}
      </div>
    </>
  );
}

export default Startup;
