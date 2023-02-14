import { ip } from 'address';
import { fork, type ChildProcess } from 'child_process';
import { context, type BuildOptions } from 'esbuild';
import { readJsonSync } from 'fs-extra';

const buildOptions: BuildOptions & { metafile: true } = {
  // General options
  bundle: true,
  platform: 'node',
  tsconfig: 'tsconfig.json',
  // Input
  entryPoints: ['src/index.ts'],
  // Output contents
  format: 'esm',
  splitting: true,
  // Output location
  chunkNames: 'chunks/[hash]',
  outdir: 'build',
  write: true,
  // Path resolution
  external: [
    '@dest-toolkit/http-server',
    '@pipcook/boa',
    'py://numpy',
    'py://scipy.optimize',
    'py://tensorflow.keras',
  ],
  // Transformation
  target: 'es2018',
  // Optimization
  minify: false,
  // Source maps
  sourcemap: false,
  // Build metadata
  metafile: true,
  // Logging
  color: true,
  // Plugins
  plugins: [
    {
      name: 'dev',
      setup(build) {
        let childProcess: ChildProcess | null = null;
        build.onEnd(() => {
          childProcess?.kill();
          childProcess = fork('build/index.js', {
            execArgv: ['--experimental-loader=./scripts/loader.js'],
          });
        });
      },
    },
  ],
};

(async () => {
  // build & watch
  const ctx = await context(buildOptions);
  await ctx.watch();
  // log
  const name = readJsonSync('package.json').name;
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
