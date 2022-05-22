import { ip } from 'address';
import { build, type BuildOptions } from 'esbuild';
import { readJson } from 'fs-extra';
import { fork, type ChildProcess } from 'child_process';

let childProcess: ChildProcess | null = null;

const startChildProcess = () => {
  if (!childProcess) {
    childProcess = fork('./build/index.js', {
      execArgv: ['--experimental-loader=@pipcook/boa/esm/loader.mjs'],
    });
  }
};

const stopChildProcess = () => {
  if (childProcess) {
    childProcess.kill();
    childProcess = null;
  }
};

const buildOptions: BuildOptions = {
  bundle: true,
  define: {},
  entryPoints: ['./src/index.ts'],
  external: [
    '@pipcook/boa',
    'co-body',
    'formidable',
    'fs-extra',
    'py:numpy',
    'py:scipy.optimize',
    'py:tensorflow.keras',
    'type-is',
  ],
  format: 'esm',
  inject: [],
  loader: {},
  minify: false,
  minifyWhitespace: false,
  minifyIdentifiers: false,
  minifySyntax: false,
  outdir: './build/',
  platform: 'node',
  sourcemap: false,
  splitting: true,
  target: 'node14',
  watch: {
    onRebuild: () => {
      stopChildProcess();
      startChildProcess();
    },
  },
  write: true,
};

(async () => {
  const { name } = await readJson('package.json');
  await build(buildOptions);
  startChildProcess();
  const appName = `\x1b[1m${name}\x1b[22m`;
  const protocol = 'http';
  const port = 3001;
  const outputs = [
    { protocol, hostname: ip('lo') || '', port },
    { protocol, hostname: ip() || '', port },
  ]
    .filter((value, index) => {
      if (index === 0) return true;
      const lan = value.hostname;
      return /^10[.]|^172[.](1[6-9]|2[0-9]|3[0-1])[.]|^192[.]168[.]/.test(lan);
    })
    .map((output, index) => ({
      label:
        index === 0
          ? '\x1b[1mLocal:            \x1b[22m'
          : '\x1b[1mOn Your Network:  \x1b[22m',
      protocol: output.protocol,
      hostname: output.hostname,
      port: `\x1b[1m${output.port}\x1b[22m`,
    }));
  const only = outputs.length === 1;
  globalThis.console.log('\x1b[32mCompiled successfully!\x1b[39m');
  globalThis.console.log();
  globalThis.console.log(`You can now aceess ${appName} via HTTP requests.`);
  globalThis.console.log();
  for (const { label, protocol, hostname, port } of outputs) {
    globalThis.console.log(
      `  ${only ? '' : label}${protocol}://${hostname}:${port}`,
    );
  }
  globalThis.console.log();
})();
