import typescript from 'rollup-plugin-typescript2'

const config = {
    input: './src/content/index.ts',
    output: {
        file: './build/content/index.js',
        format: 'iife',
    },
    plugins: [typescript({ tsconfig: './src/content/tsconfig.json' })],
}

export default config
