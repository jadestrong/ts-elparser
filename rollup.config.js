import swc from '@rollup/plugin-swc'
import nodeResolve from '@rollup/plugin-node-resolve'
import dts from 'rollup-plugin-dts'

export default {
    input: 'src/index.ts',
    output: [
        {
            file: 'dist/index.js',
            format: 'cjs',
            sourcemap: true
        },
        {
            file: 'dist/index.min.js',
            format: 'cjs',
            sourcemap: true,
            plugins: [],
        },
        {
            file: 'dist/index.esm.js',
            format: 'esm',
            sourcemap: true
        },
        {
            file: 'dist/elparser.d.ts',
            format: 'es',
        },
    ],
    plugins: [
        nodeResolve({
            extensions: [".ts"],
        }),
        swc({
            include: ['src/**/*.ts'],
            jsc: {
                parser: {
                    syntax: "typescript",
                    tsx: false
                }
            }
        }),
        dts(),
    ]
}
