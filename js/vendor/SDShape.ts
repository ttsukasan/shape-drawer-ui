export abstract class SDShape {
  shapeId: number;
  element: HTMLElement | null;
  resizeHandle: HTMLElement | null;
  deleteButton: HTMLElement | null;
  isInteracting: boolean;
  isDragging: boolean;
  isResizing: boolean;
  width: number;
  height: number;
  mouseX: number;
  mouseY: number;
  offsetX: number;
  offsetY: number;
  boundResize: ((e: MouseEvent) => void) | null;
  boundStopResize: (() => void) | null;
  borderColor: string;
  accentColor: string;
  handleGradient: string;
  fontFamily: string;

  constructor(shapeId: number) {
    this.shapeId = shapeId;
    this.element = null;
    this.resizeHandle = null;
    this.deleteButton = null;
    this.isInteracting = false;
    this.isDragging = false;
    this.isResizing = false;
    this.width = 200;
    this.height = 90;
    this.mouseX = 0;
    this.mouseY = 0;
    this.offsetX = 0;
    this.offsetY = 0;
    this.boundResize = null;
    this.boundStopResize = null;
    this.borderColor = '#ec4899';
    this.accentColor = 'rgb(107, 114, 128)';
    this.handleGradient = `linear-gradient(135deg, rgba(0,0,0,0) 60%, ${this.accentColor} 60%, ${this.accentColor} 70%, rgba(0,0,0,0) 70%, rgba(0,0,0,0) 80%, ${this.accentColor} 80%, ${this.accentColor} 90%, rgba(0,0,0,0) 90%)`;
    this.fontFamily = `"Helvetica Neue", Arial, "Hiragino Kaku Gothic ProN", "Hiragino Sans", Meiryo, sans-serif`;
  }

  init() {
    this.createElement();
    if (this.element) {
      document.body.prepend(this.element);
      this.attachEvents();
    }
    this.boundResize = null;
    this.boundStopResize = null;
  }

  abstract createElement(): void;

  updateElementStyle() {
    if (!this.element) return;
    Object.assign(this.element.style, {
      width: `${this.width}px`,
      height: `${this.height}px`,
      position: 'absolute',
      zIndex: 10000000 + this.shapeId,
      cursor: 'move',
      display: 'flex',
      justifyContent: 'left',
      alignItems: 'normal',
      userSelect: 'none',
      border: this.isInteracting ? `1px solid ${this.accentColor}` : `1px solid transparent`,
      boxSizing: 'border-box',
    });
  }

  createDeleteButton() {
    this.deleteButton = document.createElement('div');
    Object.assign(this.deleteButton.style, {
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
      fontFamily: this.fontFamily,
    });
    this.deleteButton.textContent = '×';
    this.deleteButton.addEventListener('click', () => {
      this.deleteElement();
    });
  }

  createResizeHandle() {
    this.resizeHandle = document.createElement('div');
    Object.assign(this.resizeHandle.style, {
      position: 'absolute',
      width: '20px',
      height: '20px',
      bottom: '0',
      right: '0',
      background: this.handleGradient,
      cursor: 'nwse-resize',
      visibility: 'hidden',
    });
    if (this.element && this.resizeHandle) {
      this.element.appendChild(this.resizeHandle);
    }
    this.resizeHandle.addEventListener('mousedown', (e: MouseEvent) => {
      this.initResize(e);
    });
  }

  initResize(e: MouseEvent) {
    e.stopPropagation();
    this.isResizing = true;
    this.mouseX = e.clientX;
    this.mouseY = e.clientY;
    this.boundResize = this.resize.bind(this);
    this.boundStopResize = this.stopResize.bind(this);
    document.addEventListener('mousemove', this.boundResize);
    document.addEventListener('mouseup', this.boundStopResize);
    if (this.resizeHandle) {
      this.resizeHandle.style.visibility = 'visible';
    }
  }

  resize(e: MouseEvent) {
    if (this.isResizing) {
      const widthChange = e.clientX - this.mouseX;
      const heightChange = e.clientY - this.mouseY;
      this.width = Math.max(60, this.width + widthChange);
      this.height = Math.max(38, this.height + heightChange);
      this.isInteracting = true;
      this.updateElementStyle();
      this.updateContentStyle();
      if (this.deleteButton) {
        this.deleteButton.style.visibility = this.height < 40 ? 'hidden' : 'visible';
      }
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    }
  }

  stopResize() {
    if (this.isResizing) {
      this.isResizing = false;
    }
    if (this.boundResize && this.boundStopResize) {
      document.removeEventListener('mousemove', this.boundResize);
      document.removeEventListener('mouseup', this.boundStopResize);
      this.boundResize = null;
      this.boundStopResize = null;
    }
  }

  setElementPositionToTopLeft() {
    if (!this.element) return;
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;
    this.element.style.left = `${scrollX + 100 + (this.shapeId - 1) * 15}px`;
    this.element.style.top = `${scrollY + 80 + (this.shapeId - 1) * 15}px`;
  }

  attachEvents() {
    if (!this.element) return;
    this.element.addEventListener('mousedown', (e: MouseEvent) => {
      e.preventDefault();
      const rect = this.element!.getBoundingClientRect();
      this.offsetX = e.clientX - rect.left;
      this.offsetY = e.clientY - rect.top;
      this.isDragging = true;
      this.element!.style.opacity = '0.8';
    });

    document.addEventListener('mousemove', (e: MouseEvent) => {
      if (this.isDragging) {
        e.preventDefault();
        const x = e.clientX - this.offsetX + window.scrollX;
        const y = e.clientY - this.offsetY + window.scrollY;
        this.element!.style.left = `${x}px`;
        this.element!.style.top = `${y}px`;
      }
    });

    document.addEventListener('mouseup', () => {
      if (this.isDragging) {
        this.isDragging = false;
        this.element!.style.opacity = '1';
      }
    });

    this.element.addEventListener('mouseenter', () => {
      this.isInteracting = true;
      this.updateElementStyle();
      this.updateContentStyle();
      if (this.resizeHandle) {
        this.resizeHandle.style.visibility = 'visible';
      }
      if (this.height >= 40 && this.deleteButton) {
        this.deleteButton.style.visibility = 'visible';
      }
    });

    this.element.addEventListener('mouseleave', () => {
      this.isInteracting = false;
      this.updateElementStyle();
      this.updateContentStyle();
      if (!this.isResizing && this.resizeHandle) {
        this.resizeHandle.style.visibility = 'hidden';
      }
      if (this.deleteButton) {
        this.deleteButton.style.visibility = 'hidden';
      }
    });
  }

  abstract updateContentStyle(): void;

  deleteElement() {
    if (this.element && document.body.contains(this.element)) {
      document.body.removeChild(this.element);
    }
  }
}
