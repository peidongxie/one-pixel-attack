import { createHash } from 'crypto';
import { build, type BuildOptions } from 'esbuild';
import filesize from 'filesize';
import { copy, emptyDir, readdirSync, readFileSync, statSync } from 'fs-extra';
import { basename, dirname, join, sep } from 'path';
import { gzipSync } from 'zlib';

const buildOptions: BuildOptions = {
  bundle: true,
  define: {
    'process.env.ASSET_PATH': JSON.stringify(
      process.env.ASSET_PATH || '/static',
    ),
    'process.env.PUBLIC_URL': JSON.stringify(process.env.PUBLIC_URL || '/'),
  },
  entryPoints: [],
  external: [],
  format: 'esm',
  inject: [],
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
  outdir: '',
  platform: 'browser',
  sourcemap: true,
  splitting: true,
  target: 'es6',
  watch: false,
  write: true,
  metafile: true,
  publicPath: '',
};

const getPrecacheEntryList = (
  dir: string,
): { revision: string; url: string }[] => {
  const contents = readdirSync(dir);
  return contents
    .map((content) => {
      const path = join(dir, content);
      const stats = statSync(path);
      if (stats.isDirectory()) {
        return getPrecacheEntryList(path);
      } else if (/.(css|html?|js)$/.test(content)) {
        return {
          revision: createHash('md5').update(readFileSync(path)).digest('hex'),
          url: path.substring(path.indexOf('/')),
        };
      } else {
        return null;
      }
    })
    .filter((v) => v !== null)
    .flat();
};

(async () => {
  // prepare
  await emptyDir('dist');
  await copy('public', 'dist');
  // build from index entry
  const indexOptions: BuildOptions = {
    ...buildOptions,
    define: {
      ...buildOptions.define,
      'self.__WB_MANIFEST': JSON.stringify([]),
    },
    entryPoints: ['src/index.tsx'],
    inject: ['scripts/react-shim.ts'],
    outdir: 'dist/static',
    publicPath: '/static',
  };
  const {
    errors: indexErrors,
    metafile: { outputs: indexOutputs },
    warnings: indexWarnings,
  } = await build(indexOptions);
  if (indexErrors.length && indexWarnings.length) {
    for (const error of indexErrors) globalThis.console.error(error);
    for (const warning of indexWarnings) globalThis.console.warn(warning);
    return;
  }
  // build from sw entry
  const swOptions: BuildOptions = {
    ...buildOptions,
    define: {
      ...buildOptions.define,
      'self.__WB_MANIFEST': JSON.stringify(getPrecacheEntryList('dist')),
    },
    entryPoints: ['src/service-worker.ts'],
    inject: [],
    outdir: 'dist',
    publicPath: '/',
  };
  const {
    errors: swErrors,
    metafile: { outputs: swOutputs },
    warnings: swWarnings,
  } = await build(swOptions);
  if (swErrors.length && swWarnings.length) {
    for (const error of swErrors) globalThis.console.error(error);
    for (const warning of swWarnings) globalThis.console.warn(warning);
    return;
  }
  // log
  const outputs = Reflect.ownKeys({ ...indexOutputs, ...swOutputs })
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
})();
