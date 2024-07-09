import {SDShape} from './SDShape'

export class SDRoundRect extends SDShape {
  shape!: HTMLElement

  constructor(shapeId: number, color: string) {
    super(shapeId, color)
  }

  createShape(container: HTMLElement): void {
    this.shape = document.createElement('div')
    container.appendChild(this.shape)
  }

  updateContentStyle() {
    Object.assign(this.shape.style, {
      boxSizing: 'border-box',
      width: `${this.width - 30}px`,
      height: `${this.height - 30}px`,
      marginTop: '15px',
      marginLeft: '15px',
      border: `4px solid ${this.shapeColor}`,
      borderRadius: '15px',
    })
  }
}
