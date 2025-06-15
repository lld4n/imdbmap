import taiga from '@taiga-ui/eslint-plugin-experience-next';

export default [
    ...taiga.configs.recommended,
    {
        ignores: ['**/.angular/**', '**/.prettierrc.js'],
    },
    {
        files: ['**/*'],
        rules: {
            '@typescript-eslint/no-unnecessary-type-conversion': 'off',
        },
    },
];
