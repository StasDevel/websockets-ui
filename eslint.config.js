import tseslint from 'typescript-eslint'
import eslintPluginPrettier from 'eslint-plugin-prettier'

const prettierConfig =
  eslintPluginPrettier.configs?.recommended?.[0] ||
  eslintPluginPrettier.configs?.recommended ||
  {}

export default tseslint.config(
  {
    ignores: ['node_modules', '**/*.spec.ts'],
  },
  ...tseslint.configs.recommended,
  prettierConfig,
  {
    rules: {
      'no-console': ['warn'],
      'no-debugger': ['error'],
      'prefer-const': ['error'],
      'no-duplicate-imports': ['error'],
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['warn'],
      '@typescript-eslint/no-explicit-any': ['warn'],
      '@typescript-eslint/no-non-null-assertion': ['warn'],
      '@typescript-eslint/no-empty-interface': ['warn'],
      '@typescript-eslint/no-inferrable-types': ['warn'],
      '@typescript-eslint/no-empty-function': ['warn'],
      '@typescript-eslint/no-var-requires': ['warn'],
      '@typescript-eslint/ban-ts-comment': ['warn'],
      quotes: ['warn', 'single', { avoidEscape: true }],
      semi: ['warn', 'never'],
      'comma-dangle': ['warn', 'always-multiline'],
      'arrow-parens': ['warn', 'as-needed'],
      'prefer-arrow-callback': ['warn'],
      'object-shorthand': ['warn'],
    },
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
)
