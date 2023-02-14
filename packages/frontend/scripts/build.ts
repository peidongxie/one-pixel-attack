import { createHash } from 'crypto';
import { build, type BuildOptions } from 'esbuild';
import { filesize } from 'filesize';
import {
  copySync,
  ensureDirSync,
  emptyDirSync,
  readdirSync,
  readFileSync,
  statSync,
} from 'fs-extra';
import { basename, dirname, extname, join, sep } from 'path';
import { gzipSync } from 'zlib';

const getPrecacheEntryList = (
  dir: string,
): { revision: string; url: string }[] => {
  const files = readdirSync(dir);
  return files
    .map((file) => {
      const path = join(dir, file);
      const stats = statSync(path);
      if (stats.isDirectory()) {
        return getPrecacheEntryList(path);
      }
      if (stats.isFile()) {
        if (['.css', '.htm', '.html', '.js'].includes(extname(file))) {
          return {
            revision: createHash('md5')
              .update(readFileSync(path))
              .digest('hex'),
            url: path.substring(path.indexOf('/')),
          };
        }
      }
      return null;
    })
    .filter((v): v is { revision: string; url: string } => v !== null)
    .flat();
};

const indexOptions: BuildOptions & { metafile: true } = {
  // General options
  bundle: true,
  platform: 'browser',
  tsconfig: 'tsconfig.json',
  // Input
  entryPoints: ['src/index.tsx'],
  loader: {
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
  // Output contents
  format: 'esm',
  splitting: true,
  // Output location
  chunkNames: 'chunks/[hash]',
  outdir: 'dist/static',
  publicPath: '/static',
  write: true,
  // Path resolution
  external: [],
  // Transformation
  target: 'es2018',
  // Optimization
  define: {
    'process.env.ASSET_PATH': JSON.stringify(
      process.env.ASSET_PATH || '/static',
    ),
    'process.env.PUBLIC_URL': JSON.stringify(process.env.PUBLIC_URL || '/'),
  },
  inject: ['scripts/react-shim.ts'],
  minify: true,
  // Source maps
  sourcemap: true,
  // Build metadata
  metafile: true,
  // Logging
  color: true,
  // Plugins
  plugins: [],
};

const swOptions: BuildOptions & { metafile: true } = {
  // General options
  bundle: true,
  platform: 'browser',
  tsconfig: 'tsconfig.json',
  // Input
  entryPoints: ['src/service-worker.ts'],
  loader: {},
  // Output contents
  format: 'esm',
  splitting: true,
  // Output location
  chunkNames: 'chunks/[hash]',
  outdir: 'dist',
  publicPath: '/',
  write: true,
  // Path resolution
  external: [],
  // Transformation
  target: 'es2018',
  // Optimization
  define: {
    'process.env.ASSET_PATH': JSON.stringify(
      process.env.ASSET_PATH || '/static',
    ),
    'process.env.PUBLIC_URL': JSON.stringify(process.env.PUBLIC_URL || '/'),
  },
  inject: [],
  minify: true,
  // Source maps
  sourcemap: true,
  // Build metadata
  metafile: true,
  // Logging
  color: true,
  // Plugins
  plugins: [],
};

(async () => {
  // prepare
  ensureDirSync('./dist');
  emptyDirSync('dist');
  copySync('public', 'dist');
  // build from index entry
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
  const {
    errors: swErrors,
    metafile: { outputs: swOutputs },
    warnings: swWarnings,
  } = await build({
    ...swOptions,
    define: {
      ...swOptions.define,
      'self.__WB_MANIFEST': JSON.stringify(getPrecacheEntryList('dist')),
    },
  });
  // log
  if (swErrors.length && swWarnings.length) {
    for (const error of swErrors) globalThis.console.error(error);
    for (const warning of swWarnings) globalThis.console.warn(warning);
    return;
  }
  const descriptions = Reflect.ownKeys({ ...indexOutputs, ...swOutputs })
    .filter<string>((output): output is string => {
      return typeof output === 'string' && !output.endsWith('.map');
    })
    .map((output) => ({
      size: gzipSync(readFileSync(output)).length,
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
  globalThis.console.log('File sizes after gzip:');
  globalThis.console.log();
  for (const { size, dirName, baseName } of descriptions) {
    globalThis.console.log(
      `  ${size.padEnd(length, ' ')}  ${dirName}${baseName}`,
    );
  }
  globalThis.console.log();
  globalThis.console.log(
    'The \x1b[36mdist\x1b[39m folder is ready to be deployed.',
  );
})();
