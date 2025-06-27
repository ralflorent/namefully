import { writeFile } from 'node:fs/promises';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';

const bundle = { format: 'umd', name: 'namefully', exports: 'named' };

const moduleResolve = () => ({
  async writeBundle() {
    await Promise.all([
      writeFile('dist/esm/package.json', '{"type": "module"}'),
      writeFile('dist/cjs/package.json', '{"type": "commonjs"}'),
    ]);
  },
});

export default {
  input: 'src/index.ts',
  output: [
    { file: 'dist/namefully.js', ...bundle },
    { file: 'dist/namefully.min.js', ...bundle, plugins: [terser()] },
  ],
  plugins: [typescript({ outDir: undefined }), moduleResolve()],
};
