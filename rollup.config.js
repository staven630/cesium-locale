import pkg from './package.json'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import buble from '@rollup/plugin-buble'
import { terser } from 'rollup-plugin-terser'

export default {
  input: 'src/main.js',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      name: 'CesiumLocale',
      exports: 'auto'
    },
    {
      file: pkg.module,
      format: 'es',
      name: 'CesiumLocale'
    },
    {
      file: pkg.browser,
      format: 'umd',
      name: 'CesiumLocale'
    }
  ],
  external: [
    'cesium'
  ],
  plugins: [
    resolve(),
    commonjs({ extensions: ['.js'] }),
    buble({
      objectAssign: 'Object.assign',
      exclude: ['node_modules/**']
    }),
    terser({
      output: {
        ascii_only: true // 仅输出ascii字符
      },
      compress: {
        pure_funcs: ['console.log'] // 去掉console.log函数
      }
    })
  ],
  external: [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {})
  ]
}