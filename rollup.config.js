import swc from '@rollup/plugin-swc'
import nodeResolve from '@rollup/plugin-node-resolve'
import json from '@rollup/plugin-json'
import dts from 'rollup-plugin-dts'
import pkg from './package.json' assert { type: 'json' }

export default [{
    input: '.build/index.js',
    output: [
        { file: pkg.exports.import, format: 'es' },
        { file: pkg.exports.require, format: 'commonjs' },
    ],
    plugins: [
        nodeResolve({
            extensions: [".ts", ".js", ".json"],
        }),
        json(),
        swc({
            include: ['src/**/*.ts'],
            jsc: {
                parser: {
                    syntax: "typescript",
                    tsx: false
                }
            }
        }),
        // dts(),
    ]
}, {
    input: './.build/index.d.ts',
    output: [{ file: pkg.types, format: 'es' }],
    plugins: [dts()]
}]
