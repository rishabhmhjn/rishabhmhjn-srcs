const { withNx } = require('@nx/rollup/with-nx');
const { readFileSync, writeFileSync, chmodSync } = require('fs');
const { join } = require('path');

const OUTPUT_PATH = join(__dirname, '../../../dist/packages/kaomoji');

/**
 * Post-build plugin that adds the "bin" field to the generated package.json
 * and makes the CLI file executable.
 */
const cliPostBuildPlugin = {
  name: 'kaomoji-cli-post-build',
  writeBundle: {
    sequential: true,
    order: 'post',
    handler() {
      try {
        const pkgPath = join(OUTPUT_PATH, 'package.json');
        const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
        pkg.bin = { kaomoji: './cli.cjs.js' };
        delete pkg.private;
        writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
      } catch {
        // package.json not generated yet
      }

      try {
        chmodSync(join(OUTPUT_PATH, 'cli.cjs.js'), 0o755);
      } catch {
        // CLI file not generated yet
      }
    },
  },
};

module.exports = withNx(
  {
    main: './src/index.ts',
    outputPath: '../../../dist/packages/kaomoji',
    tsConfig: './tsconfig.lib.json',
    compiler: 'swc',
    format: ['cjs', 'esm'],
    assets: [{ input: __dirname, output: '.', glob: '*.md' }],
    additionalEntryPoints: ['./src/cli.ts'],
  },
  {
    output: {
      banner: (chunk) => (chunk.name === 'cli' ? '#!/usr/bin/env node' : ''),
    },
    plugins: [cliPostBuildPlugin],
  },
);
