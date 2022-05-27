import { build, type BuildOptions } from 'esbuild';
import fs from 'fs-extra';

const buildOptions: BuildOptions = {
  bundle: true,
  define: {},
  entryPoints: ['src/index.ts'],
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
  minify: true,
  minifyWhitespace: true,
  minifyIdentifiers: true,
  minifySyntax: true,
  outdir: 'build',
  platform: 'node',
  sourcemap: false,
  splitting: true,
  target: 'node14',
  write: true,
};

(async () => {
  await fs.emptyDir('build');
  await build(buildOptions);
})();
