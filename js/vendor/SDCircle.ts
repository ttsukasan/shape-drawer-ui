import {SDShape} from './SDShape'

export class SDCircle extends SDShape {
  shape!: HTMLElement

  constructor(shapeId: number, color: string) {
    super(shapeId, color)
    this.width = 200
    this.height = 200
    this.updateShapeStyle()
  }

  createShape(container: HTMLElement): void {
    this.shape = document.createElement('div')
    container.appendChild(this.shape)
  }

  updateShapeStyle() {
    Object.assign(this.shape.style, {
      boxSizing: 'border-box',
      width: `${this.width - 30}px`,
      height: `${this.height - 30}px`,
      marginTop: '15px',
      marginLeft: '15px',
      border: `4px solid ${this.shapeColor}`,
      borderRadius: '50%',
    })
  }
}
