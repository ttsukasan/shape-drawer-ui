import {SDShape} from './SDShape'

export class SDRect extends SDShape {
  shape!: HTMLElement

  constructor(shapeId: number, color: string) {
    super(shapeId, color)
  }

  createShape(container: HTMLElement): void {
    this.shape = document.createElement('div')
    container.appendChild(this.shape)
  }

  updateShapeStyle() {
    Object.assign(this.shape.style, {
      boxSizing: 'border-box',
      width: `${this.width - 20}px`,
      height: `${this.height - 20}px`,
      marginTop: '9px',
      marginLeft: '9px',
      border: `4px solid ${this.shapeColor}`,
    })
  }
}
