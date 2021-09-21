import { build } from 'esbuild';
import type { BuildOptions } from 'esbuild';
import { emptyDir } from 'fs-extra';
import { fork } from 'child_process';
import type { ChildProcess } from 'child_process';

let childProcess: ChildProcess | null = null;

const startChildProcess = () => {
  if (!childProcess) {
    childProcess = fork('./dist/index.js');
    console.info('Service is up');
  }
};

const stopChildProcess = () => {
  if (childProcess) {
    childProcess.kill();
    childProcess = null;
    console.info('Service is down');
  }
};

const buildOptions: BuildOptions = {
  bundle: true,
  define: {},
  entryPoints: ['./src/index.ts'],
  external: ['co-body', 'type-is'],
  format: 'cjs', // esm
  inject: [],
  loader: {},
  minify: false,
  minifyWhitespace: false,
  minifyIdentifiers: false,
  minifySyntax: false,
  outdir: './dist/',
  platform: 'node',
  sourcemap: false,
  splitting: false, // true
  target: 'es6',
  watch: {
    onRebuild: () => {
      stopChildProcess();
      startChildProcess();
    },
  },
  write: true,
};

(async () => {
  await emptyDir('build');
  await build(buildOptions);
  startChildProcess();
})();
