import { render } from 'inferno'
import Component from 'inferno-component'
import Editor from '..'

class App extends Component {
  constructor() {
    super(arguments)
    this.state = { value: 'Initial value' }
  }

  render() {
    console.log('render', this.state)
    return(
      <div>
        <Editor height='50%' theme={this.state.theme ? 'vs-dark' : 'vs-light'} value={this.state.value} />
        <textarea onInput={e => this.setState({ value: e.target.value })} />
        <button onClick={e => this.setState({ theme: !this.state.theme})}>Toggle theme</button>
      </div>
    )
  }
}

render(
  <App />, 
  document.getElementById('root')
)