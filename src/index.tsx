import * as monaco from 'monaco-editor'
import { Component } from 'inferno'

declare global {
  interface Window { MonacoEnvironment: any }
}

interface IProps {
  width?: number | string
  height?: number | string
  value?: string
  language?: string
  theme?: string
  options?: { [key: string]: any }
  editorDidMount: (editor: monaco.editor.IEditor) => void
  editorWillMount: (editor: monaco.editor.IEditor) => void
  onChange: (event: Event) => void
  require?: any /** AMD Custom require function */
}

const noRequire = modules => {
  throw new Error(`Cannot use function require to load ${modules.join(', ')}`)
}

self.MonacoEnvironment = {
  getWorkerUrl: function(moduleId, label) {
    switch(label) {
      case 'json': return './json.worker.bundle.js'
      case 'css': return './css.worker.bundle.js'
      case 'html': return './html.worker.bundle.js'

      case 'javascript':
      case 'typescript': return './ts.worker.bundle.js'

      default: return './editor.worker.bundle.js'
    }
  }
}

export default class Editor extends Component<IProps, {}> {
  private wrapper: HTMLDivElement
  private editor: monaco.editor.ICodeEditor
  private value: string

  /**
   * Call event hooks props if they are present
   * 
   * @param name The prop name
   * @param data The data
   */
  private emit(name: string, ...data: any[]) {
    if(this.props[name]) {
      (this.props[name] as Function)(this, ...data)
    }
  }

  /**
   * Handle the element's ref
   * 
   * @param element The dom element
   */
  private handleReferral(element: HTMLDivElement) {
    this.wrapper = element
  }

  /**
   * Creates the editor
   */
  private createEditor() {
    this.editor = monaco.editor.create(this.wrapper, {
      value: this.props.value,
      language: this.props.language || 'typescript',
      theme: this.props.theme,
      ...this.props.options
    })

    this.value = this.props.value

    this.editor.onDidChangeModelContent(event => {
      this.value = this.editor.getValue()

      this.emit('onChange', this.value, event)
    })

    this.emit('editorDidMount', this.editor)
  }

  /**
   * Handle the inferno did mount event. Render the editor
   * and inform the consumer of that action via the editorDidMount callback
   */
  public componentDidMount() {
    this.createEditor() 
  }

  /**
   * Dispose the editor when the component unmounts
   */
  public componentWillUnmount() {
    this.emit('editorWillUnmount', this.editor)
    if(this.editor) this.editor.dispose()
  }

  /**
   * Catch update events and just change the editor options if 
   * there aren't any significat updates for the inferno wrapper
   */
  public shouldComponentUpdate(nextProps: IProps, nextState: {}, nextContext) {
    const monacoProps = ['value', 'language', 'theme', 'options']

    const changes: string[] = Object.keys(nextProps)
      .filter(prop => monacoProps.indexOf(prop) !== -1)
      .filter(prop => this.props[prop] !== nextProps[prop])
      .filter(prop => {
        if(!this.editor) return

        switch(prop) {
          case 'value':
            return this.editor.setValue(nextProps[prop]) 

          case 'theme':
            return monaco.editor.setTheme(nextProps[prop])
        
          case 'language':
            return monaco.editor.setModelLanguage(
              this.editor.getModel(), 
              nextProps[prop]
            )

          default: 
            return true 
        }
      })
    
    if(nextProps['options'] !== this.props.options && this.editor) {
      this.editor.updateOptions(nextProps['options'])  
      return false
    }
  
    return true
  }

  /**
   * Render the wrapper
   */
  public render() {
    return <div 
      ref={this.handleReferral.bind(this)}
      style={{
        width: this.props.width || '100%',
        height: this.props.height || '100%'
      }}
    />
  }
}