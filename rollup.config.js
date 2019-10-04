import typescript from 'rollup-plugin-typescript2'
import commonjs from 'rollup-plugin-commonjs'
import nodeResolve from 'rollup-plugin-node-resolve'

const config = {
    input: './src/content/index.ts',
    output: {
        file: './build/content/index.js',
        format: 'iife',
    },
    plugins: [
        nodeResolve({
            browser: true,
            preferBuiltins: false,
            mainFields: ['module', 'main'],
        }),
        typescript({ tsconfig: './src/content/tsconfig.json' }),
        commonjs({
            extensions: ['.js', '.ts', '.tsx'],
            namedExports: {},
        }),
    ],
}

export default config
