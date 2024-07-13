import {SDTextarea} from './SDTextarea'
import {SDRoundRect} from './SDRoundRect'
import {SDShape} from './SDShape'
import {SDRect} from './SDRect'
import {SDCircle} from './SDCircle'
import {SDBlur} from './SDBlur'
import {SDConfig} from './SDConfig'

export class SDMenu {
  private dialog: HTMLDivElement
  private toolbar: HTMLDivElement
  private closeButton!: HTMLButtonElement
  private colorButtons: HTMLButtonElement[] = []
  private selectedColor: string = SDConfig.palletColors[0]
  private shapes: SDShape[] = []

  constructor() {
    this.dialog = this.createDialog()
    this.createToolBar()
    this.createColorButtons()
    this.createCloseButton()
    this.createActionButtons()
    document.body.appendChild(this.dialog)

    this.closeButton.addEventListener('click', () => this.hideDialog())
    document.addEventListener('mousemove', (event) => this.handleMouseMove(event))
  }

  private resetStyle(el: HTMLElement): void {
    const i = 'initial'
    Object.assign(el.style, {
      color: i,
      textDecoration: i,
      fontFamily: i,
      fontSize: i,
      fontWeight: i,
      lineHeight: i,
      letterSpacing: i,
      textAlign: i,
      textTransform: i,
      textIndent: i,
      backgroundColor: i,
    })
  }

  private createDialog(): HTMLDivElement {
    const dialog = document.createElement('div')
    this.resetStyle(dialog)
    Object.assign(dialog.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      backgroundColor: SDConfig.bgColor,
      color: SDConfig.textColor,
      padding: '10px',
      zIndex: `${SDConfig.zIndexBase}`,
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    })
    return dialog
  }

  private createToolBar(): void {
    const toolbar = document.createElement('div')
    this.resetStyle(toolbar)
    Object.assign(toolbar.style, {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '8px',
    })
    this.toolbar = toolbar
    this.dialog.appendChild(toolbar)
  }

  private applyTooltip(button: HTMLButtonElement): void {
    // ツールチップメッセージ
    const tooltip = document.createElement('span')
    this.resetStyle(tooltip)
    tooltip.innerText = '画面左上にマウスを移動するとメニューが再表示されます'
    Object.assign(tooltip.style, {
      zIndex: `${SDConfig.zIndexBase + 1}`,
      backgroundColor: 'rgba(0,0,0,0.7)',
      color: SDConfig.textColor,
      padding: '4px 8px',
      borderRadius: '4px',
      fontSize: 'small',
      position: 'fixed',
      display: 'none',
    })
    document.body.appendChild(tooltip)

    // mouseover時に表示、mouseoutで非表示
    button.addEventListener('mouseover', (event) => {
      tooltip.style.display = 'block'
      tooltip.style.left = `${event.clientX + 10}px`
      tooltip.style.top = `${event.clientY}px`
    })
    button.addEventListener('mouseout', () => {
      tooltip.style.display = 'none'
    })
    button.addEventListener('mousemove', (event) => {
      tooltip.style.left = `${event.clientX + 10}px`
      tooltip.style.top = `${event.clientY}px`
    })
  }

  private createCloseButton(): void {
    const div = document.createElement('div')
    this.resetStyle(div)
    div.style.textAlign = 'right'
    div.style.flexGrow = '1' // Add this line
    const button = document.createElement('button')
    this.resetStyle(button)
    button.innerText = '閉じる'
    Object.assign(button.style, {
      backgroundColor: 'transparent',
      textDecoration: 'underline',
      color: SDConfig.textColor,
      border: 'none',
      cursor: 'pointer',
    })
    this.applyTooltip(button)
    div.appendChild(button)

    this.toolbar.appendChild(div)
    this.closeButton = button
  }

  private createColorButtons(): void {
    const pallet = document.createElement('div')
    this.resetStyle(pallet)
    pallet.style.display = 'flex' // Add this line
    pallet.style.justifyContent = 'space-between' // Add this line
    pallet.style.color = SDConfig.textColor
    pallet.innerText = '色: '

    SDConfig.palletColors.forEach((color, i) => {
      const button = document.createElement('button')
      button.dataset.value = color
      Object.assign(button.style, {
        backgroundColor: color,
        border: `solid 1px rgba(255, 254, 254, 0.3)`, // #FFFEFE
        color: 'white',
        margin: '4px',
        cursor: 'pointer',
        padding: '8px',
        borderRadius: '50%',
      })
      i === 0 && (button.style.marginLeft = '8px')
      button.addEventListener('click', () => this.selectColor(color))
      pallet.appendChild(button)
      this.colorButtons.push(button)
    })
    this.toolbar.appendChild(pallet)
    this.updateButtonStyles()
  }

  private createActionButtons(): void {
    const actionContainer = document.createElement('div')
    this.resetStyle(actionContainer)
    Object.assign(actionContainer.style, {
      width: '240px',
      display: 'flex',
      flexWrap: 'wrap',
      gap: '10px',
      marginTop: '8px',
    })
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
      Object.assign(button.style, {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: SDConfig.textColor,
        border: `solid 1px rgba(255, 254, 254, 0.3)`, // #FFFEFE
        backgroundColor: 'transparent',
        cursor: 'pointer',
        width: 'calc((100% / 3) - 10px)',
        height: 'auto',
        borderRadius: '4px',
        margin: '0',
        padding: '5px',
      })
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

  // 閉じる動作とアニメーション
  private hideDialog(): void {
    Object.assign(this.dialog.style, {
      transition: 'all 0.3s ease-out',
      transform: 'translate(-50%, -50%) scale(0.2)',
      opacity: '0.5',
    })
    setTimeout(() => {
      Object.assign(this.dialog.style, {
        display: 'none',
        transform: 'none',
        opacity: '1',
      })
    }, 300)
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
