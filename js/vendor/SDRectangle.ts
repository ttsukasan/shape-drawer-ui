import { SDShape } from './SDShape';

export class SDRectangle extends SDShape {
  shape: HTMLElement | null = null;

  constructor(shapeId: number) {
    super(shapeId);
  }

  createElement() {
    this.element = document.createElement('div');
    this.element.dataset.shapeId = this.shapeId.toString();
    this.shape = document.createElement('div');
    this.shape.dataset.type = 'rectangle';
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
    this.shape ||= this.element?.querySelector(`[data-type="rectangle"]`) as HTMLElement;
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
