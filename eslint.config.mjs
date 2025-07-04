import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  { languageOptions: { parserOptions: { project: 'tsconfig.json' } } },
  { ignores: ['*.config.mjs', 'src/fixtures', 'src/**/*.spec.ts'] }
);