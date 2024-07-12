import {SDTextarea} from './SDTextarea'
import {SDRoundRect} from './SDRoundRect'
import {SDShape} from './SDShape'
import {SDRect} from './SDRect'
import {SDCircle} from './SDCircle'
import {SDBlur} from './SDBlur'
import {SDConfig} from './SDConfig'

export class SDMenu {
  private dialog: HTMLDivElement
  private closeButton!: HTMLButtonElement
  private colorButtons: HTMLButtonElement[] = []
  private selectedColor: string = 'black'
  private shapes: SDShape[] = []

  constructor() {
    this.dialog = this.createDialog()
    this.createCloseButton()
    this.createColorButtons()
    this.createActionButtons()
    document.body.appendChild(this.dialog)

    this.closeButton.addEventListener('click', () => this.hideDialog())
    document.addEventListener('mousemove', (event) => this.handleMouseMove(event))
  }

  private resetStyle(el: HTMLElement): void {
    let i = 'initial'
    el.style.color = i
    el.style.textDecoration = i
    el.style.fontFamily = i
    el.style.fontSize = i
    el.style.fontWeight = i
    el.style.lineHeight = i
    el.style.letterSpacing = i
    el.style.textAlign = i
    el.style.textTransform = i
    el.style.textIndent = i
    el.style.backgroundColor = i
  }

  private createDialog(): HTMLDivElement {
    const dialog = document.createElement('div')
    this.resetStyle(dialog)
    dialog.style.position = 'fixed'
    dialog.style.top = '0'
    dialog.style.left = '0'
    dialog.style.backgroundColor = SDConfig.bgColor
    dialog.style.color = SDConfig.textColor
    dialog.style.padding = '10px'
    dialog.style.zIndex = `${SDConfig.zIndexBase}`
    return dialog
  }

  private createCloseButton(): void {
    const div = document.createElement('div')
    this.resetStyle(div)
    div.style.textAlign = 'right'
    const button = document.createElement('button')
    this.resetStyle(button)
    button.innerText = '閉じる'
    button.style.backgroundColor = 'transparent'
    button.style.textDecoration = 'underline'
    button.style.color = 'white'
    button.style.border = 'none'
    button.style.cursor = 'pointer'
    div.appendChild(button)
    this.dialog.appendChild(div)
    this.closeButton = button

  }

  private createColorButtons(): void {
    const pallet = document.createElement('div')
    this.resetStyle(pallet)

    SDConfig.palletColors.forEach(color => {
      const button = document.createElement('button')
      button.dataset.value = color
      button.style.backgroundColor = color
      button.style.border = `solid 1px rgba(255, 254, 254, 0.3)` // #FFFEFE
      button.style.color = 'white'
      button.style.margin = '4px'
      button.style.cursor = 'pointer'
      button.style.padding = '8px'
      button.style.borderRadius = '50%'
      button.addEventListener('click', () => this.selectColor(color))
      pallet.appendChild(button)
      this.colorButtons.push(button)
    })
    this.dialog.appendChild(pallet)
    this.selectedColor = SDConfig.palletColors[0]
    this.updateButtonStyles()
  }

  private createActionButtons(): void {
    const actionContainer = document.createElement('div')
    this.resetStyle(actionContainer)
    actionContainer.style.width = '240px'
    actionContainer.style.display = 'flex'
    actionContainer.style.flexWrap = 'wrap'
    actionContainer.style.gap = '10px'
    actionContainer.style.marginTop = '8px'

    const shapes = [
      {key: 'rect', label: '四角', klass: SDRect},
      {key: 'roundRect', label: '角丸', klass: SDRoundRect},
      {key: 'circle', label: '円', klass: SDCircle},
      {key: 'textarea', label: 'TXT', klass: SDTextarea},
      {key: 'blur', label: 'ぼかし', klass: SDBlur},
    ]
    // const shapes = []
    shapes.forEach((shape, index) => {
      const button = document.createElement('button')
      this.resetStyle(button)
      button.innerText = shape.label
      button.style.display = 'flex'
      button.style.alignItems = 'center'
      button.style.justifyContent = 'center'
      button.style.color = SDConfig.textColor
      button.style.border = `solid 1px rgba(255, 254, 254, 0.3)` // #FFFEFE
      button.style.backgroundColor = 'transparent'
      button.style.cursor = 'pointer'
      button.style.width = 'calc((100% / 3) - 10px)'
      button.style.height = 'auto'
      button.style.borderRadius = '4px'
      button.style.margin = '0'
      button.style.padding = '5px'
      button.addEventListener('click', () => {
        const shapeId = this.shapes.length + 1 // shapeId(表示優先度)
        shape.klass && this.shapes.push(new shape.klass(shapeId, this.selectedColor))
      })
      actionContainer.appendChild(button)
    })

    this.dialog.appendChild(actionContainer)
  }

  private selectColor(color: string): void {
    this.selectedColor = color
    this.updateButtonStyles()
  }

  private updateButtonStyles(): void {
    this.colorButtons.forEach(button => {
      if (button.dataset.value === this.selectedColor) {
        button.style.outline = `2px solid ${SDConfig.textColor}`
      } else {
        button.style.outline = 'none'
      }
    })
  }

  private hideDialog(): void {
    this.dialog.style.display = 'none'
  }

  private showDialog(): void {
    this.dialog.style.display = 'block'
  }

  private handleMouseMove(event: MouseEvent): void {
    if (event.clientX < 50 && event.clientY < 50) {
      this.showDialog()
    }
  }
}
