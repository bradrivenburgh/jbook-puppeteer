import 'bulmaswatch/superhero/bulmaswatch.min.css'
import * as esbuild from 'esbuild-wasm';
import { useState, useEffect, useRef } from 'react';
import { unpkgPathPlugin } from './plugins/unpkg-path-plugins';
import { fetchPlugin } from './plugins/fetch-plugin';
import CodeEditor from './components/code-editor';

const App = () => {
  const [input, setInput] = useState('');
  const serviceRef = useRef<any>(null);
  const iframe = useRef<any>(null);

  const startService = async () => {
    serviceRef.current = await esbuild.startService({
      worker: true,
      wasmURL: 'https://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm',
    });
  };

  useEffect(() => {
    startService();
  }, []);

  const onClick = async () => {
    if (!serviceRef.current) {
      return;
    }

    iframe.current.srcdoc = html;

    const result = await serviceRef.current.build({
      entryPoints: ['index.js'], // first file to be bundled in application
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin(), fetchPlugin(input)],
      define: {
        'process.env.NODE_ENV': '"production"', // define variable as "production" str
        global: 'window', // replace instances of 'global' var with 'window' var (browser global)
      },
    });

    iframe.current.contentWindow.postMessage(result.outputFiles[0].text, '*');
  };

  const html = `
    <html>
      <head>
      </head>
      <body>
        <div id="root"></div>
        <script>
          window.addEventListener('message', (event) => {
            try {
              eval(event.data);
            } catch (error) {
              const root = document.querySelector('#root');
              root.innerHTML = '<div style="color: red;"> <h4>Runtime Error</h4>' + error + '</div>';
              console.error(error)
            }
          }, false)
        </script>
      </body>
    </html>
  `;

  return (
    <div>
      <CodeEditor
        onChange={(value) => setInput(value)}
        initialValue="document.querySelector('#root').innerHTML = 'Hello World';"
      />
      {/* <textarea onChange={(e) => setInput(e.target.value)} value={input} /> */}
      <div>
        <button id='submit' onClick={onClick}>
          Submit
        </button>
      </div>
      <iframe
        ref={iframe}
        srcDoc={html}
        sandbox='allow-scripts'
        title='codeOutput'
        name='codeOutput'
      />
    </div>
  );
};

export default App;
