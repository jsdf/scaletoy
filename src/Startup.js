// @flow
import React from 'react';
import useQueryParam, {QUERY_PARAM_FORMATS} from './useQueryParam';
import './App.css';
import App from './App';

const USE_SAMPLED_DX7 = Boolean(
  new URL(document.location.href).searchParams.get('sampled')
);

function nonnull<T>(v: ?T): T {
  if (v == null) {
    throw new Error('unexpected null');
  }
  return v;
}

function Theme() {
  const [darkMode, setDarkMode] = React.useState(false);

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
          onChange={() => setDarkMode(s => !s)}
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
    nonnull(document.querySelector('.dx7')).style.visibility = 'visible';
    setStartedAudio(true);
  }, [setStartedAudio]);

  React.useEffect(() => {
    async function initSampled() {
      const {sampledDX7} = await import('./sampledDX7');

      sampledDX7().then(({dx7, actx}) => {
        window.initDX7Shim(dx7, actx);
      });
    }
    window.onDX7Init = (dx7, actx) => {
      if (!dx7) {
        // fall back to sampled
        return initSampled();
      }
      const newAudioApi = {
        dx7,
        actx,
      };

      setAudioApi(newAudioApi);
      if (actx.state === 'running') {
        onStart();
      }
    };
    if (USE_SAMPLED_DX7) {
      initSampled();
    } else {
      window.initDX7(process.env.PUBLIC_URL);
    }
  }, []);

  const Route = useRouting();
  if (audioApi && startedAudio) {
    return (
      <React.Suspense fallback={<div>loading...</div>}>
        <div>
          {<Route {...{audioApi}} />}
          <Theme />
        </div>
      </React.Suspense>
    );
  }

  return (
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
  );
}

export default Startup;
