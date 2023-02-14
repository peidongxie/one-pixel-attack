import { build, type BuildOptions } from 'esbuild';
import { filesize } from 'filesize';
import { emptyDirSync, readFileSync } from 'fs-extra';
import { basename, dirname, sep } from 'path';

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
  minify: true,
  // Source maps
  sourcemap: false,
  // Build metadata
  metafile: true,
  // Logging
  color: true,
  // Plugins
  plugins: [],
};

(async () => {
  // prepare
  emptyDirSync('build');
  // build
  const {
    errors,
    metafile: { outputs },
    warnings,
  } = await build(buildOptions);
  // log
  if (errors.length && warnings.length) {
    for (const error of errors) globalThis.console.error(error);
    for (const warning of warnings) globalThis.console.warn(warning);
    return;
  }
  const descriptions = Reflect.ownKeys(outputs)
    .filter<string>((output): output is string => {
      return typeof output === 'string' && !output.endsWith('.map');
    })
    .map((output) => ({
      size: readFileSync(output).length,
      dirName: dirname(output) + sep,
      baseName: basename(output),
    }))
    .sort((a, b) => {
      return b.size - a.size;
    })
    .map((description) => ({
      size: filesize(description.size) as string,
      dirName: `\x1b[2m${description.dirName}\x1b[22m`,
      baseName: `\x1b[36m${description.baseName}\x1b[39m`,
    }));
  const length = Math.max(
    ...descriptions.map((description) => description.size.length),
  );
  globalThis.console.log('\x1b[32mCompiled successfully.\x1b[39m');
  globalThis.console.log();
  globalThis.console.log('File sizes:');
  globalThis.console.log();
  for (const { size, dirName, baseName } of descriptions) {
    globalThis.console.log(
      `  ${size.padEnd(length, ' ')}  ${dirName}${baseName}`,
    );
  }
  globalThis.console.log();
})();
