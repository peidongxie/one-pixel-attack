import { build } from 'esbuild';
import type { BuildOptions } from 'esbuild';
import filesize from 'filesize';
import { copy, emptyDir, readFileSync } from 'fs-extra';
import { basename, dirname, sep } from 'path';
import { gzipSync } from 'zlib';

const buildOptions: BuildOptions = {
  bundle: true,
  define: {},
  entryPoints: ['src/index.tsx'],
  external: [],
  format: 'esm',
  inject: ['./scripts/react-shim.ts'],
  loader: { '.ts': 'tsx', '.svg': 'file' },
  minify: true,
  minifyWhitespace: true,
  minifyIdentifiers: true,
  minifySyntax: true,
  outdir: 'build/static',
  platform: 'browser',
  sourcemap: true,
  splitting: true,
  target: 'es6',
  watch: false,
  write: true,
  color: true,
  metafile: true,
  publicPath: '/static',
  sourceRoot: '/static',
};

(async () => {
  await emptyDir('build');
  await copy('public', 'build');
  const { errors, metafile, warnings } = await build(buildOptions);
  for (const error of errors) console.error(error);
  for (const warning of warnings) console.warn(warning);
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
    console.log('\x1b[32mCompiled successfully.\x1b[39m');
    console.log();
    console.log('File sizes after gzip:');
    console.log();
    for (const { gzipSize, dirName, baseName } of outputs) {
      console.log(`  ${gzipSize.padEnd(length, ' ')}  ${dirName}${baseName}`);
    }
    console.log();
    console.log('The \x1b[36mbuild\x1b[39m folder is ready to be deployed.');
  }
})();
