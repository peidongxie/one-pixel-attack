import { ip } from 'address';
import { serve } from 'esbuild';
import type { ServeOptions, BuildOptions } from 'esbuild';
import { readJson } from 'fs-extra';

const serveOptions: ServeOptions = {
  port: 3000,
  host: 'localhost',
  servedir: 'public',
  onRequest: ({ method, path, status }) => {
    console.log(`${status} ${method} ${path}`);
  },
};

const buildOptions: BuildOptions = {
  bundle: true,
  define: {},
  entryPoints: ['src/index.tsx'],
  external: [],
  format: 'esm',
  inject: ['./scripts/react-shim.ts'],
  loader: { '.ts': 'tsx', '.svg': 'file' },
  minify: false,
  minifyWhitespace: false,
  minifyIdentifiers: false,
  minifySyntax: false,
  outdir: 'public/static',
  platform: 'browser',
  sourcemap: true,
  splitting: true,
  target: 'es6',
  watch: false,
  write: false,
  color: true,
  publicPath: '/static',
  sourceRoot: '/static',
};

(async () => {
  const { name } = await readJson('package.json');
  const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';
  const { host, port } = await serve(serveOptions, buildOptions);
  const local = `  ${protocol}://${host}:\x1b[1m${port}\x1b[0m`;
  const lan = await new Promise<string>((resolve, reject) => {
    const host = ip();
    if (/^10[.]|^172[.](1[6-9]|2[0-9]|3[0-1])[.]|^192[.]168[.]/.test(host)) {
      resolve(`  ${protocol}://${host}:\x1b[1m${port}\x1b[0m`);
    } else {
      reject();
    }
  }).catch(() => '');
  console.log('\x1b[32mCompiled successfully!\x1b[0m');
  console.log();
  console.log(`You can now view \x1b[1m${name}\x1b[0m in the browser.`);
  console.log();
  if (lan) {
    console.log(`  \x1b[1mLocal:\x1b[0m          ` + local);
    console.log(`  \x1b[1mOn Your Network:\x1b[0m` + lan);
  } else {
    console.log(local);
  }
  console.log();
})();
