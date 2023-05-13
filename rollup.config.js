import { builtinModules } from 'module'
import swc from '@rollup/plugin-swc'
import nodeResolve from '@rollup/plugin-node-resolve'
import json from '@rollup/plugin-json'
import dts from 'rollup-plugin-dts'
import pkg from './package.json' assert { type: 'json' }

const external =  Object.keys(pkg.dependencies || {})
        .concat(Object.keys(pkg.peerDependencies || {}))
        .concat(builtinModules);

/** @type {import('rollup').RollupOptions} */
export default [{
    input: '.build/index.js',
    external,
    output: [
        { file: pkg.exports.import, format: 'es' },
        { file: pkg.exports.require, format: 'commonjs' },
    ],
    plugins: [
        nodeResolve(),
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
    external,
    plugins: [dts()]
}]
