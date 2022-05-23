import { build, type BuildOptions } from 'esbuild';
import filesize from 'filesize';
import { copy, emptyDir, readFileSync } from 'fs-extra';
import { basename, dirname, sep } from 'path';
import { gzipSync } from 'zlib';

const buildOptions: BuildOptions = {
  bundle: true,
  define: {
    'process.env.PUBLIC_URL': JSON.stringify(
      process.env.PUBLIC_URL || '/static/',
    ),
  },
  entryPoints: ['./src/index.tsx', './src/service-worker.ts'],
  external: [],
  format: 'esm',
  inject: ['./scripts/react-shim.ts'],
  loader: {
    '.ts': 'tsx',
    '.avif': 'file',
    '.bmp': 'file',
    '.gif': 'file',
    '.jpg': 'file',
    '.jpeg': 'file',
    '.png': 'file',
    '.webp': 'file',
    '.svg': 'file',
    '.glsl': 'text',
  },
  minify: true,
  minifyWhitespace: true,
  minifyIdentifiers: true,
  minifySyntax: true,
  outdir: './dist/static/',
  platform: 'browser',
  sourcemap: true,
  splitting: true,
  target: 'es6',
  watch: false,
  write: true,
  metafile: true,
  publicPath: '/static/',
  sourceRoot: '/static/',
};

(async () => {
  await emptyDir('dist');
  await copy('public', 'dist');
  const { errors, metafile, warnings } = await build(buildOptions);
  for (const error of errors) globalThis.console.error(error);
  for (const warning of warnings) globalThis.console.warn(warning);
  if (errors.length === 0 && warnings.length === 0) {
    const outputs = Reflect.ownKeys(metafile.outputs)
      .filter<string>((output): output is string => {
        return typeof output === 'string' && !output.endsWith('.map');
      })
      .map((output) => ({
        gzipSize: gzipSync(readFileSync(output)).length,
        dirName: dirname(output) + sep,
        baseName: basename(output),
      }))
      .sort((a, b) => {
        return b.gzipSize - a.gzipSize;
      })
      .map((output) => ({
        gzipSize: filesize(output.gzipSize),
        dirName: `\x1b[2m${output.dirName}\x1b[22m`,
        baseName: `\x1b[36m${output.baseName}\x1b[39m`,
      }));
    const length = Math.max(...outputs.map((output) => output.gzipSize.length));
    globalThis.console.log('\x1b[32mCompiled successfully.\x1b[39m');
    globalThis.console.log();
    globalThis.console.log('File sizes after gzip:');
    globalThis.console.log();
    for (const { gzipSize, dirName, baseName } of outputs) {
      globalThis.console.log(
        `  ${gzipSize.padEnd(length, ' ')}  ${dirName}${baseName}`,
      );
    }
    globalThis.console.log();
    globalThis.console.log(
      'The \x1b[36mdist\x1b[39m folder is ready to be deployed.',
    );
  }
})();
