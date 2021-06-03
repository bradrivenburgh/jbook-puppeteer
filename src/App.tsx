import * as esbuild from 'esbuild-wasm';
import { useState, useEffect, useRef } from 'react';

const App = () => {
  const [input, setInput] = useState('');
  const [code, setCode] = useState('');
  const serviceRef = useRef<any>(null);

  const startService = async () => {
    serviceRef.current = await esbuild.startService({
      worker: true,
      wasmURL: '/esbuild.wasm',
    });
  };

  useEffect(() => {
    startService();
  }, []);

  const onClick = async () => {
    if (!serviceRef.current) {
      return;
    }

    const result = await serviceRef.current.transform(input, {
      loader: 'jsx',
      target: 'es2015',
    });

    console.log(result)
    setCode(result.code);
  };

  return (
    <div>
      <textarea onChange={(e) => setInput(e.target.value)} value={input} />
      <div>
        <button onClick={onClick}>Submit</button>
      </div>
      <pre data-testid='code'>{code}</pre>
    </div>
  );
};

export default App;
