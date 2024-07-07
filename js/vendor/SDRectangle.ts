import { SDShape } from './SDShape';

export class SDRectangle extends SDShape {
  shape: HTMLElement | null;

  constructor(shapeId: number) {
    super(shapeId);
    this.shape = null;
    this.init();
  }

  createElement() {
    this.element = document.createElement('div');
    this.element.dataset.shapeId = this.shapeId.toString();
    this.shape = document.createElement('div');
    this.setElementPositionToTopLeft();
    this.updateElementStyle();
    this.updateContentStyle();
    if (this.element && this.shape) {
      this.element.appendChild(this.shape);
    }
    this.createDeleteButton();
    if (this.element && this.deleteButton) {
      this.element.appendChild(this.deleteButton);
    }
    this.createResizeHandle();
  }

  updateContentStyle() {
    if (!this.shape) return;
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
