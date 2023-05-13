import swc from '@rollup/plugin-swc'
import nodeResolve from '@rollup/plugin-node-resolve'

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
        }
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
        })
    ]
}
