/// <reference path="../node_modules/monaco-editor/monaco.d.ts" />
import Component from 'inferno-component'

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

declare global {
  interface Window {
    monaco: any
  }
}

export default class Editor extends Component<IProps, {}> {
  private wrapper: HTMLDivElement
  private loaded: boolean
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
    const editor = window.monaco.editor

    this.editor = editor.create(this.wrapper, {
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
    if (!this.loaded) {
      const require = this.props.require || (window as any).require || noRequire

      this.emit('editorWillMount', this.editor)
      require(['vs/editor/editor.main'], this.createEditor.bind(this))
    } else {
      this.createEditor()
    }

  }

  /**
   * Dispose the editor when the component unmounts
   */
  public componentWillUnmount() {
    this.emit('editorWillUnmount', this.editor)
    if(this.editor) this.editor.dispose
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
        switch(prop) {
          case 'value':
            return this.editor.setValue(nextProps[prop]) 

          case 'theme':
            return window.monaco.editor.setTheme(nextProps[prop])
        
          case 'language':
            return window.monaco.editor.setModelLanguage(
              this.editor.getModel(), 
              nextProps[prop]
            )

          default: 
            return true 
        }
      })
    
    if(nextProps['options'] !== this.props.options) {
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