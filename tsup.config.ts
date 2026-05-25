import { defineConfig } from 'tsup';

const shared = {
  format: ['cjs', 'esm'] as const,
  dts: true,
  sourcemap: true,
  clean: false,
  treeshake: true,
  external: ['react', 'react-dom', 'react/jsx-runtime'],
};

export default defineConfig([
  {
    ...shared,
    entry: { index: 'src/index.ts' },
    clean: true,
  },
  {
    ...shared,
    entry: {
      'dict-core':   'src/data/core.ts',
      'dict-social': 'src/data/social.ts',
    },
  },
]);
