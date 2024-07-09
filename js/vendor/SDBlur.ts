import {SDShape} from './SDShape'

export class SDBlur extends SDShape {
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
      width: `${this.width - 4}px`,
      height: `${this.height - 4}px`,
      marginTop: '1px',
      marginLeft: '1px',
      backgroundColor: 'rgba(255, 255, 255, 0)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
    })
  }
}
