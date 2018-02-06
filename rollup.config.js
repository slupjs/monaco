import Typescript from 'rollup-plugin-typescript2'
import Babel from 'rollup-plugin-babel'

import { tmpDir } from 'os'
import { join } from 'path'

const generate = format => ({
  input: join(__dirname, 'src', 'index.tsx'),

  external: [ 'inferno' ],

  output: { 
    file: join(__dirname, 'dist', `bundle.${format}.js`), 
    format,
    
    /** UMD and Options */
    name: 'Slup.Monaco',
    globals: { inferno: 'Inferno' }
  },

  plugins: [ 
    Typescript({ cacheRoot: join(tmpDir(), '.rpt2_cache') }), 
    Babel({ plugins: [ ['inferno', { imports: true } ] ] }) 
  ]
})

export default ['es', 'cjs', 'amd', 'umd', 'iife'].map(generate)