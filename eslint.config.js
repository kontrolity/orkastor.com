import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import unusedImports from 'eslint-plugin-unused-imports';

// `npm run lint` had no flat config to load (ESLint 9 dropped .eslintrc), so the
// script failed before it ever looked at a file. This restores it using only the
// plugins already in devDependencies — no new packages.
export default [
  { ignores: ['dist/**', 'node_modules/**', 'public/**'] },
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: { ...globals.browser, ...globals.node },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    settings: { react: { version: 'detect' } },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'unused-imports': unusedImports,
    },
    rules: {
      ...react.configs.flat.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      // The JSX runtime is automatic (Vite React plugin) and props are documented
      // by the JSDoc/tsc pass, not PropTypes.
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'warn',
      // Copy on this site is written with real apostrophes and quotes; entity
      // escaping would make the source unreadable for no rendering benefit.
      'react/no-unescaped-entities': 'off',
      // Anonymous render callbacks inside memoised wrappers are used throughout
      // the existing landing components; the rule only affects devtools naming.
      'react/display-name': 'off',
      'react/no-unknown-property': ['error', { ignore: ['css'] }],
    },
  },
];
