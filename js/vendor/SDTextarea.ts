import { SDShape } from './SDShape';

export class SDTextarea extends SDShape {
  textArea: HTMLTextAreaElement | null = null;
  fontSizeToggle: HTMLElement | null = null;
  textColor: string = '#ec4899';
  fontSize: string = '18px';

  constructor(shapeId: number) {
    super(shapeId);
  }

  createElement() {
    this.element = document.createElement('div');
    this.element.dataset.shapeId = this.shapeId.toString();
    this.textArea = document.createElement('textarea');
    this.textArea.placeholder = 'テキストを入力';
    this.setElementPositionToTopLeft();
    this.updateElementStyle();
    this.updateContentStyle();
    if (this.element && this.textArea) {
      this.element.appendChild(this.textArea);
    }
    this.createDeleteButton();
    if (this.element && this.deleteButton) {
      this.element.appendChild(this.deleteButton);
    }
    this.createResizeHandle();
    this.createFontSizeToggle();
  }

  updateContentStyle() {
    if (!this.textArea) return;
    Object.assign(this.textArea.style, {
      color: this.textColor,
      resize: 'none',
      boxSizing: 'border-box',
      width: `${this.width - 30}px`,
      height: `${this.height - 30}px`,
      marginTop: '15px',
      marginLeft: '15px',
      border: this.isInteracting ? `1px dashed ${this.borderColor}` : `1px dashed transparent`,
      borderRadius: '8px',
      padding: '4px',
      outline: 'none',
      overflow: 'hidden',
      fontSize: this.fontSize,
      fontWeight: 'bold',
      fontFamily: this.fontFamily,
      lineHeight: '1.3',
      background: 'transparent',
      textShadow: '2px 2px 0px #fff, -2px -2px 0px #fff, -2px 2px 0px #fff, 2px -2px 0px #fff, 2px 0px 0px #fff, -2px 0px 0px #fff, 0px 2px 0px #fff, 0px -2px 0px #fff, 0px 0px 2px #fff',
      boxShadow: 'none',
    });
  }

  createFontSizeToggle() {
    this.fontSizeToggle = document.createElement('div');
    this.fontSizeToggle.textContent = 'A';
    Object.assign(this.fontSizeToggle.style, {
      position: 'absolute',
      bottom: '0',
      left: '0',
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
      fontSize: '16px',
      fontFamily: this.fontFamily,
    });
    if (this.element && this.fontSizeToggle) {
      this.element.appendChild(this.fontSizeToggle);
    }
    this.fontSizeToggle.addEventListener('click', () => {
      this.toggleFontSize();
    });
  }

  toggleFontSize() {
    this.fontSize = this.fontSize === '18px' ? '36px' : '18px';
    this.updateContentStyle();
  }

  protected shouldIgnoreClick(e: MouseEvent): boolean {
    // FIXME: this.textAreaがnullの場合がある
    if (!this.textArea) {
      this.textArea = this.element!.querySelector('textarea');
    }
    return e.target === this.textArea;
  }
}
