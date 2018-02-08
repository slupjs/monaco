<h6 align='center'>
📝
@slup/monaco
</h6>

This package is a [`Inferno`](https://infernojs.org) component that wraps the amazing [`monaco-editor`](https://github.com/Microsoft/monaco-editor)
text editor from Microsoft. It is used in VSCode, CodeSandbox and StackBlitz among the others. This simple and lightweight
components loads via AMD Require the editor located in the `vs` folder on your host, and creates a editor in
a div wrapper. This project is heavily inspired by the great [`react-monaco-editor`](https://github.com/superRaytin/react-monaco-editor)

Plese note that this package hasn't got all the features provided in the react version, but tries to be minimalistic and yet easy to integrate.

## Installation

This package can be installed via `yarn` or `npm`, tough nowdays yarn is favourited:

```bash
yarn add -E @slup/monaco
npm i --save @slup/monaco
```

## Prerequirements

As said in the beginnging this package loads the monaco's core from the `vs` folder located at the root of your
webserver's static hosting. In a typical modern environment with webpack bundling, you're advised to use `copy-webpack-plguin`

So, once installed this plugin, use it like so:

```javascript
const CopyPlugin = require('copy-webpack-plugin')

// Later in your webpack's config
plugins: [
  //... Other stuff
    new CopyPlugin([
      {
        from: 'node_modules/monaco-editor/min/vs',
        to: 'vs'
      }
    ])
]
```

Or if you want to use a CDN or a custom url of some sort, you can follow the same steps as show [here](https://github.com/superRaytin/react-monaco-editor#using-with-requireconfig-do-not-need-webpack)

## Usage
This component can be used as follows:

```javascript
import { render } from 'inferno'
import Editor from '@slup/monaco'

const myEditor = () => <Editor 
  value=`const typedValue: string[] = ['This', 'is', 'cool!']`
  theme='vs-dark'
  language='typescript'
/>

render(<MyEditor />, document.body)
