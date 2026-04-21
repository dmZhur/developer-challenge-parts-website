// @ts-check
import eslintConfigPrettier from 'eslint-config-prettier';
import withNuxt from './.nuxt/eslint.config.mjs';

export default withNuxt()
  // ── Vue component rules ────────────────────────────────────────────────────
  .override('nuxt/vue/rules', {
    rules: {
      // Nuxt pages/layouts are intentionally single-word (index, default, etc.)
      'vue/multi-word-component-names': 'off',

      // Enforce <script setup> — Options API is not used in this project
      'vue/component-api-style': ['error', ['script-setup']],

      // TypeScript's `?` optional syntax makes this redundant
      'vue/require-default-prop': 'off',

      // Catch unused v-for keys and slot props early
      'vue/no-unused-vars': 'error',

      // v-html bypasses Vue's XSS protection — should be an explicit decision
      'vue/no-v-html': 'warn',

      // Consistent macro declaration order in <script setup>
      'vue/define-macros-order': [
        'error',
        {
          order: ['defineOptions', 'defineProps', 'defineEmits', 'defineSlots'],
        },
      ],
    },
  })

  // ── TypeScript rules ───────────────────────────────────────────────────────
  .override('nuxt/typescript/rules', {
    rules: {
      // Warn rather than block — useful escape hatch during prototyping
      '@typescript-eslint/no-explicit-any': 'warn',

      // Unused variables are almost always bugs; _prefix opts out intentionally
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],

      // Keeps type-only imports from polluting the runtime bundle
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          disallowTypeAnnotations: false,
        },
      ],
    },
  })

  // ── General JavaScript rules ───────────────────────────────────────────────
  .override('nuxt/javascript', {
    rules: {
      // console.log left in code is almost always accidental; warn/error are fine
      'no-console': ['warn', { allow: ['warn', 'error'] }],

      // var has unintuitive function-scope hoisting — use const/let instead
      'no-var': 'error',

      // Signals immutability intent; catches accidental re-assignments
      'prefer-const': 'error',

      // semi and quotes are intentionally absent — Prettier owns all formatting
    },
  })

  // Disable every ESLint rule that would conflict with Prettier's formatting
  .append(eslintConfigPrettier);
