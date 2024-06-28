import eslintPluginAstro from 'eslint-plugin-astro'
import eslint from '@eslint/js';
// add this in once eslint v9 is supported https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/issues/978
// import jsxAlly from 'eslint-plugin-jsx-ally';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  // ...jsxAlly.config.strict,
  ...eslintPluginAstro.configs.recommended,
);
