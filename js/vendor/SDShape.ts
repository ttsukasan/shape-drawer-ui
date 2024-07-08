export abstract class SDShape {
  shapeId: number;
  container: HTMLElement;
  resizeHandle: HTMLElement;
  deleteButton: HTMLElement;
  isInteracting: boolean = false;
  isDragging: boolean = false;
  isResizing: boolean = false;
  width: number = 200;
  height: number = 90;
  mouseX: number = 0;
  mouseY: number = 0;
  offsetX: number = 0;
  offsetY: number = 0;
  boundResize: ((e: MouseEvent) => void) | null = null;
  boundStopResize: (() => void) | null = null;
  shapeColor: string = 'transparent';
  accentColor: string = 'rgb(107, 114, 128)';
  handleGradient: string = `linear-gradient(135deg, rgba(0,0,0,0) 60%, ${this.accentColor} 60%, ${this.accentColor} 70%, rgba(0,0,0,0) 70%, rgba(0,0,0,0) 80%, ${this.accentColor} 80%, ${this.accentColor} 90%, rgba(0,0,0,0) 90%)`;
  fontFamily: string = `"Helvetica Neue", Arial, "Hiragino Kaku Gothic ProN", "Hiragino Sans", Meiryo, sans-serif`;

  constructor(shapeId: number, color: string) {
    this.shapeId = shapeId;
    this.shapeColor = color;
    this.container = this.createContainer();
    this.createShape(this.container as HTMLElement);
    this.resizeHandle = this.createResizeHandle();
    this.deleteButton = this.createDeleteButton();
    document.body.prepend(this.container);
    this.updateElementStyle();
    this.updateContentStyle();
    this.attachEvents();
  }

  createContainer(): HTMLElement {
    const el = document.createElement('div');
    el.dataset.shapeId = this.shapeId.toString();
    this.setElementPositionToTopLeft(el);
    return el;
  }

  abstract createShape(container: HTMLElement): void;

  updateElementStyle() {
    if (!this.container) {
      return;
    }
    Object.assign(this.container.style, {
      width: `${this.width}px`,
      height: `${this.height}px`,
      position: 'absolute',
      zIndex: `${2147483647 - 100 + this.shapeId}`,
      cursor: 'move',
      display: 'flex',
      justifyContent: 'left',
      alignItems: 'normal',
      userSelect: 'none',
      border: this.isInteracting ? `1px solid ${this.accentColor}` : `1px solid transparent`,
      transition: 'border .2s ease-in-out',
      boxSizing: 'border-box',
    });
  }

  createDeleteButton(): HTMLElement {
    const button = document.createElement('div');
    Object.assign(button.style, {
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
    // button.textContent = '×';
    const label = document.createElement('div')
    label.textContent = '×' // '✖'
    label.style.marginTop = '-6px'
    label.style.marginRight = '-1px'
    button.appendChild(label);
    button.addEventListener('click', () => this.deleteElement());
    this.container.appendChild(button);
    return button;
  }

  createResizeHandle(): HTMLElement {
    const handle = document.createElement('div');
    Object.assign(handle.style, {
      position: 'absolute',
      width: '20px',
      height: '20px',
      bottom: '0',
      right: '0',
      background: this.handleGradient,
      cursor: 'nwse-resize',
      visibility: 'hidden',
    });
    handle.addEventListener('mousedown', (e: MouseEvent) => this.initResize(e));
    this.container.appendChild(handle);
    return handle;
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
    this.resizeHandle.style.visibility = 'visible';
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
      this.deleteButton.style.visibility = this.height < 40 ? 'hidden' : 'visible';
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

  setElementPositionToTopLeft(element: HTMLElement) {
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;
    element.style.left = `${scrollX + 30 + (this.shapeId - 1) * 15}px`;
    element.style.top = `${scrollY + 120 + (this.shapeId - 1) * 15}px`;
  }

  attachEvents() {
    this.container.addEventListener('mousedown', (e: MouseEvent) => {
      if (this.shouldIgnoreClick(e)) return;
      e.preventDefault();
      const rect = this.container.getBoundingClientRect();
      this.offsetX = e.clientX - rect.left;
      this.offsetY = e.clientY - rect.top;
      this.isDragging = true;
      // this.container.style.opacity = '0.8';
    });

    document.addEventListener('mousemove', (e: MouseEvent) => {
      if (this.isDragging) {
        e.preventDefault();
        const x = e.clientX - this.offsetX + window.scrollX;
        const y = e.clientY - this.offsetY + window.scrollY;
        this.container.style.left = `${x}px`;
        this.container.style.top = `${y}px`;
      }
    });

    document.addEventListener('mouseup', () => {
      if (this.isDragging) {
        this.isDragging = false;
        this.container.style.opacity = '1';
      }
    });

    this.container.addEventListener('mouseenter', () => {
      this.isInteracting = true;
      this.updateElementStyle();
      this.updateContentStyle();
      this.resizeHandle.style.visibility = 'visible';
      if (this.height >= 40) {
        this.deleteButton.style.visibility = 'visible';
      }
    });

    this.container.addEventListener('mouseleave', () => {
      this.isInteracting = false;
      this.updateElementStyle();
      this.updateContentStyle();
      if (!this.isResizing) {
        this.resizeHandle.style.visibility = 'hidden';
      }
      this.deleteButton.style.visibility = 'hidden';
    });
  }

  abstract updateContentStyle(): void;

  deleteElement() {
    if (document.body.contains(this.container)) {
      document.body.removeChild(this.container);
    }
  }

  protected shouldIgnoreClick(e: MouseEvent): boolean {
    return false;
  }
}
