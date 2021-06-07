import * as esbuild from 'esbuild-wasm';
import axios from 'axios';
import localforage from 'localforage';

const fileCache = localforage.createInstance({
  name: 'filecache',
});

export const fetchPlugin = (inputCode: string) => {
  return {
    name: 'fetch-plugin',
    setup(build: esbuild.PluginBuild) {
      // event listener "onLoad", when esbuild tries to load a file
      // again, we're hijacking the path again and returning an object instead of a file
      build.onLoad({ filter: /.*/ }, async (args: any) => {
        if (args.path === 'index.js') {
          // this object is returned instead of index.js
          return {
            loader: 'jsx',
            contents: inputCode,
          };
        }

        // Implemented with axios library.  I like it better because
        // it's much more compact and .get() doesn't require you to know
        // if the format of the data being returned (text vs. JSON)

        // Checked to see if we have already fetched this file
        // and if it is in the cache
        const cachedResult = await fileCache.getItem<esbuild.OnLoadResult>(
          args.path
        );

        // if so, return it immediately
        if (cachedResult) {
          return cachedResult;
        }

        const { data, request } = await axios.get(args.path);

        const result: esbuild.OnLoadResult = {
          loader: 'jsx',
          contents: data,
          resolveDir: new URL('./', request.responseURL).pathname,
        };

        // store response in cache
        await fileCache.setItem(args.path, result);

        return result;

        // Implemented with fetch API

        // let data;
        // await fetch(args.path)
        //   .then((response) => {
        //     if (!response.ok) {
        //       return;
        //     } else {
        //       return response.text();
        //     }
        //   })
        //   .then((responseText) => {
        //     data = responseText;
        //   })
        //   .catch((e) => console.log(e.message));

        // return {
        //   loader: 'jsx',
        //   contents: data,
        // };
      });
    },
  };
};
