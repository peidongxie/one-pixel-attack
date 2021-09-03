import { build } from 'esbuild';
import type { BuildOptions } from 'esbuild';
import { copy, emptyDir } from 'fs-extra';

const buildOptions: BuildOptions = {
  bundle: true,
  define: {},
  entryPoints: ['src/index.tsx'],
  external: ['react', 'react-dom'],
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
  publicPath: '/static',
  sourceRoot: '/static',
};

(async () => {
  await emptyDir('build');
  await copy('public', 'build');
  const { errors, warnings } = await build(buildOptions);
  for (const error of errors) console.error(error);
  for (const warning of warnings) console.warn(warning);
})();
