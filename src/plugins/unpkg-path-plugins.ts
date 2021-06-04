import * as esbuild from 'esbuild-wasm';

export const unpkgPathPlugin = () => {
  return {
    name: 'unpkg-path-plugin', //"name" is primarily for debugging
    setup(build: esbuild.PluginBuild) {
      // event listener "onResolve", which figures out the path to the index.js file
      // we're hijacking the path
      build.onResolve({ filter: /.*/ }, async (args: any) => { 
        console.log('onResole', args);
        return { path: args.path, namespace: 'a' };  // path to index.js is given property of args 
      });

      // event listener "onLoad", when esbuild tries to load a file
      // again, we're hijacking the path again and returning an object instead of a file
      build.onLoad({ filter: /.*/ }, async (args: any) => {  
        console.log('onLoad', args);

        if (args.path === 'index.js') {
          // this object is returned instead of index.js
          return {
            loader: 'jsx',
            contents: `
              // esbuild parses import statments and restarts build process: onResolve=>onLoad
              import message from './message'; 
              console.log(message);
            `,
          };
        } 
        // esbuild returns the following when searching for anything but
        // the index.js file
        else {
          return {
            loader: 'jsx',
            contents: 'export default "hi there!"',
          };
        }
      });
    },
  };
};
