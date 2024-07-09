import {SDShape} from './SDShape'
import {SDConfig} from './SDConfig'

export class SDTextarea extends SDShape {
  textArea!: HTMLTextAreaElement
  fontSizeToggle!: HTMLElement
  fontSizes: string[] = ['18px', '24px', '36px']
  fontSize: string = '18px'

  constructor(shapeId: number, color: string) {
    super(shapeId, color)
    this.resizeMinWidth = 64
    this.resizeMinHeight = 64
    this.updateShapeStyle()
  }

  createShape(container: HTMLElement): void {
    this.textArea = document.createElement('textarea')
    this.textArea.placeholder = 'テキストを入力'
    container.appendChild(this.textArea)
    this.fontSizeToggle = this.createFontSizeToggle()
    container.appendChild(this.fontSizeToggle)
  }

  updateShapeStyle() {
    Object.assign(this.textArea.style, {
      color: this.shapeColor,
      resize: 'none',
      boxSizing: 'border-box',
      width: `${this.width - 30}px`,
      height: `${this.height - 30}px`,
      marginTop: '15px',
      marginLeft: '15px',
      border: this.isInteracting ? `1px dashed ${this.shapeColor}` : `1px dashed transparent`,
      borderRadius: '2px',
      padding: '5px',
      outline: 'none',
      overflow: 'hidden',
      fontSize: this.fontSize,
      fontWeight: 'bold',
      fontFamily: SDConfig.fontFamily,
      lineHeight: '1.3',
      background: 'transparent',
      textShadow: '2px 2px 0px #fff, -2px -2px 0px #fff, -2px 2px 0px #fff, 2px -2px 0px #fff, 2px 0px 0px #fff, -2px 0px 0px #fff, 0px 2px 0px #fff, 0px -2px 0px #fff, 0px 0px 2px #fff',
      boxShadow: 'none',
    })
  }

  createFontSizeToggle(): HTMLElement {
    const toggle = document.createElement('div')
    toggle.textContent = 'A'
    Object.assign(toggle.style, {
      position: 'absolute',
      bottom: '0',
      left: '0',
      width: '20px',
      height: '20px',
      background: this.accentColor,
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      userSelect: 'none',
      visibility: 'hidden',
      fontSize: '16px',
      fontFamily: SDConfig.fontFamily,
    })
    toggle.addEventListener('click', () => this.toggleFontSize())
    return toggle
  }

  toggleFontSize() {
    // fontSizesの次の項目に切り替える
    const index = this.fontSizes.indexOf(this.fontSize)
    this.fontSize = this.fontSizes[(index + 1) % this.fontSizes.length]
    this.updateShapeStyle()
  }

  protected shouldIgnoreClick(e: MouseEvent): boolean {
    return e.target === this.textArea
  }

  protected updateOptionStyle(): any {
    this.fontSizeToggle.style.visibility = this.isInteracting ? 'visible' : 'hidden'
  }
}
