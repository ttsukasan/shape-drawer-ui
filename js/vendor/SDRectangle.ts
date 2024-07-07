import { SDShape } from './SDShape';

export class SDRectangle extends SDShape {
  shape!: HTMLElement;

  constructor(shapeId: number) {
    super(shapeId);
  }

  createElement(): HTMLElement {
    const element = document.createElement('div');
    element.dataset.shapeId = this.shapeId.toString();
    this.shape = document.createElement('div');
    this.setElementPositionToTopLeft(element);
    this.updateElementStyle();
    this.updateContentStyle();
    element.appendChild(this.shape);
    return element;
  }

  updateContentStyle() {
    Object.assign(this.shape.style, {
      boxSizing: 'border-box',
      width: `${this.width - 30}px`,
      height: `${this.height - 30}px`,
      marginTop: '15px',
      marginLeft: '15px',
      border: `4px solid ${this.borderColor}`,
      borderRadius: '15px',
    });
  }
}
