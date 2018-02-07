import Typescript from 'rollup-plugin-typescript2'
import Babel from 'rollup-plugin-babel'

import { tmpdir } from 'os'
import { join } from 'path'

const generate = format => ({
  input: join(__dirname, 'src', 'index.tsx'),

  external: [ 'inferno', 'inferno-component' ],

  output: { 
    file: join(__dirname, 'dist', `bundle.${format}.js`), 
    format,
    
    /** UMD and Options */
    name: 'Slup.Monaco',
    globals: { inferno: 'Inferno', 'inferno-component': 'Inferno.Component' }
  },

  plugins: [ 
    Typescript({ cacheRoot: join(tmpdir(), '.rpt2_cache') }), 
    Babel({ plugins: [ ['inferno', { imports: true } ] ] }) 
  ]
})

export default ['es', 'cjs', 'amd', 'umd'].map(generate)