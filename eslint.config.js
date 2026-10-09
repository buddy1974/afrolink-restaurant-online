import eslintPluginAstro from 'eslint-plugin-astro';
import tseslint from 'typescript-eslint';

export default [
  { ignores: ['dist/', '.vercel/', '.data/', '.astro/', 'node_modules/', 'legacy/'] },
  ...tseslint.configs.recommended,
  ...eslintPluginAstro.configs.recommended,
  ...eslintPluginAstro.configs['jsx-a11y-strict'],
  {
    rules: {
      // role="list" is intentional: Safari/VoiceOver drops list semantics when list-style is none.
      'astro/jsx-a11y/no-redundant-roles': ['error', { ul: ['list'], ol: ['list'] }],
      // Scrollable regions must be keyboard-focusable (WCAG 2.1.1) — allow tabindex on labelled regions.
      'astro/jsx-a11y/no-noninteractive-tabindex': ['error', { roles: ['tabpanel', 'region'] }],
    },
  },
];
