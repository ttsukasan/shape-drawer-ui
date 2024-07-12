import {SDConfig} from './SDConfig'

export abstract class SDShape {
  shapeId: number
  container: HTMLElement
  resizeHandle: HTMLElement
  deleteButton: HTMLElement
  isInteracting: boolean = false
  isDragging: boolean = false
  isResizing: boolean = false
  width: number = 180
  height: number = 120
  resizeMinWidth: number = 60
  resizeMinHeight: number = 26
  mouseX: number = 0
  mouseY: number = 0
  offsetX: number = 0
  offsetY: number = 0
  shapeColor: string = 'transparent'
  accentColor: string = SDConfig.bgColor
  handleGradient: string = `linear-gradient(135deg, rgba(0,0,0,0) 60%, ${this.accentColor} 60%, ${this.accentColor} 70%, rgba(0,0,0,0) 70%, rgba(0,0,0,0) 80%, ${this.accentColor} 80%, ${this.accentColor} 90%, rgba(0,0,0,0) 90%)`

  constructor(shapeId: number, color: string) {
    this.shapeId = shapeId
    this.shapeColor = color
    this.container = this.createContainer()
    this.createShape(this.container as HTMLElement)
    this.resizeHandle = this.createResizeHandle()
    this.deleteButton = this.createDeleteButton()
    document.body.prepend(this.container)
    this.updateContainerStyle()
    this.updateShapeStyle()
    this.attachEvents()
  }

  createContainer(): HTMLElement {
    const el = document.createElement('div')
    const scrollX = window.scrollX
    const scrollY = window.scrollY
    el.style.left = `${scrollX + 30 + (this.shapeId - 1) * 15}px`
    el.style.top = `${scrollY + 200 + (this.shapeId - 1) * 15}px`
    el.dataset.shapeId = this.shapeId.toString()
    return el
  }

  abstract createShape(container: HTMLElement): void;

  updateContainerStyle() {
    Object.assign(this.container.style, {
      width: `${this.width}px`,
      height: `${this.height}px`,
      position: 'absolute',
      zIndex: `${SDConfig.zIndexBase + this.shapeId}`,
      cursor: 'move',
      display: 'flex',
      justifyContent: 'left',
      alignItems: 'normal',
      userSelect: 'none',
      border: this.isInteracting ? `1px solid ${this.accentColor}` : `1px solid transparent`,
      transition: 'border .2s ease-in-out',
      boxSizing: 'border-box',
    })
    this.updateOptionStyle()
  }

  createDeleteButton(): HTMLElement {
    const button = document.createElement('div')
    Object.assign(button.style, {
      position: 'absolute',
      top: '0',
      right: '0',
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
      fontSize: '24px',
      fontFamily: SDConfig.fontFamily,
    })
    // button.textContent = '×';
    const label = document.createElement('div')
    label.textContent = '×' // '✖'
    label.style.marginTop = '-6px'
    label.style.marginRight = '-1px'
    button.appendChild(label)
    button.addEventListener('click', () => this.deleteElement())
    this.container.appendChild(button)
    return button
  }

  createResizeHandle(): HTMLElement {
    const handle = document.createElement('div')
    Object.assign(handle.style, {
      position: 'absolute',
      width: '20px',
      height: '20px',
      bottom: '0',
      right: '0',
      background: this.handleGradient,
      cursor: 'nwse-resize',
      visibility: 'hidden',
    })
    handle.addEventListener('mousedown', (e: MouseEvent) => this.startResize(e))
    this.container.appendChild(handle)
    return handle
  }

  startResize(e: MouseEvent) {
    e.stopPropagation() // リサイズ中にドラッグ移動をしない
    this.isResizing = true
    this.mouseX = e.clientX
    this.mouseY = e.clientY
  }

  resize(e: MouseEvent) {
    if (this.isResizing) {
      const widthChange = e.clientX - this.mouseX
      const heightChange = e.clientY - this.mouseY
      this.width = Math.max(this.resizeMinWidth, this.width + widthChange)
      this.height = Math.max(this.resizeMinHeight, this.height + heightChange)
      this.isInteracting = true
      this.updateContainerStyle()
      this.updateShapeStyle()
      this.deleteButton.style.visibility = this.height < 40 ? 'hidden' : 'visible'
      this.mouseX = e.clientX
      this.mouseY = e.clientY
    }
  }

  attachEvents() {
    this.container.addEventListener('mousedown', (e: MouseEvent) => {
      if (this.shouldIgnoreClick(e)) return
      e.preventDefault()
      const rect = this.container.getBoundingClientRect()
      this.offsetX = e.clientX - rect.left
      this.offsetY = e.clientY - rect.top
      this.isDragging = true
    })

    document.addEventListener('mousemove', (e: MouseEvent) => {
      if (this.isDragging) {
        e.preventDefault()
        const x = e.clientX - this.offsetX + window.scrollX
        const y = e.clientY - this.offsetY + window.scrollY
        this.container.style.left = `${x}px`
        this.container.style.top = `${y}px`
      }
      if (this.isResizing) {
        this.resize(e)
      }
    })

    document.addEventListener('mouseup', (e: MouseEvent) => {
      console.log('mouseup', this.isResizing, this.isDragging, this.isInteracting)
      this.isResizing = false
      this.isDragging = false
      // カーソルがcontainerの外にある場合、isInteractingをfalseに設定
      if (!this.container.contains(e.target as Node)) {
        this.isInteracting = false
        this.resizeHandle.style.visibility = 'hidden'
        this.deleteButton.style.visibility = 'hidden'
      }
      this.updateContainerStyle()
    })
    this.container.addEventListener('mouseenter', () => {
      this.isInteracting = true
      this.updateContainerStyle()
      this.updateShapeStyle()
      this.resizeHandle.style.visibility = 'visible'
      if (this.height >= 40) {
        this.deleteButton.style.visibility = 'visible'
      }
    })

    this.container.addEventListener('mouseleave', () => {
      this.isInteracting = false
      this.updateContainerStyle()
      this.updateShapeStyle()
      if (!this.isResizing) {
        this.resizeHandle.style.visibility = 'hidden'
      }
      this.deleteButton.style.visibility = 'hidden'
    })
  }

  abstract updateShapeStyle(): void;

  deleteElement() {
    if (document.body.contains(this.container)) {
      document.body.removeChild(this.container)
    }
  }

  // クリックイベントを許可する判定。テキストエリア入力で利用
  protected shouldIgnoreClick(e: MouseEvent): boolean {
    return false
  }

  // Container内にオプションを表示する場合に利用
  protected updateOptionStyle() {
    return void (0)
  }
}
