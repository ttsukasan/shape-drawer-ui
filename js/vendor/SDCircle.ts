import {SDShape} from './SDShape'

export class SDCircle extends SDShape {
  shape!: HTMLElement

  constructor(shapeId: number, color: string) {
    super(shapeId, color)
    this.width = 160
    this.height = 160
    this.resizeMinWidth = 32
    this.resizeMinHeight = 32
    this.updateShapeStyle()
  }

  createShape(container: HTMLElement): void {
    this.shape = document.createElement('div')
    container.appendChild(this.shape)
  }

  updateShapeStyle() {
    Object.assign(this.shape.style, {
      boxSizing: 'border-box',
      width: `${this.width - 4}px`,
      height: `${this.height - 4}px`,
      marginTop: '1px',
      marginLeft: '1px',
      border: `4px solid ${this.shapeColor}`,
      borderRadius: '50%',
    })
  }
}
