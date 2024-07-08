export class SDMenu {
  private dialog: HTMLDivElement;
  private closeButton: HTMLButtonElement;
  private colors: { txt: string, bg: string, gray: string } = {txt: '#FFFEFE', bg: '#292D3E', gray: '#ABB2BF'};
  private palletColors: string[] = ['#E4E5F1', '#D52753', '#23974A', '#DF631C', '#275FE4', '#26272D',]; // Bluloco Zsh Light
  private colorButtons: HTMLButtonElement[] = [];
  private selectedColor: string = 'black';

  constructor() {
    this.dialog = this.createDialog();
    this.closeButton = this.createCloseButton();
    this.dialog.appendChild(this.closeButton);
    this.createColorButtons();
    this.createActionButtons();
    document.body.appendChild(this.dialog);

    this.closeButton.addEventListener('click', () => this.hideDialog());
    document.addEventListener('mousemove', (event) => this.handleMouseMove(event));
  }

  private resetStyle(el: HTMLElement): void {
    let i = 'initial';
    el.style.color = i;
    el.style.textDecoration = i;
    el.style.fontFamily = i;
    el.style.fontSize = i;
    el.style.fontWeight = i;
    el.style.lineHeight = i;
    el.style.letterSpacing = i;
    el.style.textAlign = i;
    el.style.textTransform = i;
    el.style.textIndent = i;
    el.style.backgroundColor = i;
  }

  private createDialog(): HTMLDivElement {
    const dialog = document.createElement('div');
    this.resetStyle(dialog);
    dialog.style.position = 'fixed';
    dialog.style.top = '0';
    dialog.style.left = '0';
    dialog.style.backgroundColor = this.colors.bg;
    dialog.style.color = this.colors.txt;
    dialog.style.padding = '10px';
    dialog.style.zIndex = '1000';
    dialog.innerText = 'SDMenu';
    return dialog;
  }

  private createCloseButton(): HTMLButtonElement {
    const button = document.createElement('button');
    this.resetStyle(button);
    button.innerText = '✖';
    button.style.backgroundColor = 'transparent';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.cursor = 'pointer';
    button.style.float = 'right';
    button.style.marginLeft = '10px';
    return button;
  }

  private createColorButtons(): void {
    const pallet = document.createElement('div');
    this.resetStyle(pallet);

    const colors = this.palletColors;
    colors.forEach(color => {
      const button = document.createElement('button');
      button.dataset.value = color;
      button.style.backgroundColor = color;
      button.style.border = `solid 1px rgba(255, 255, 255, .4)`;
      button.style.color = 'white';
      button.style.margin = '5px';
      button.style.cursor = 'pointer';
      button.style.padding = '10px';
      button.style.borderRadius = '50%';
      button.addEventListener('click', () => this.selectColor(color));
      pallet.appendChild(button);
      this.colorButtons.push(button);
    });
    this.dialog.appendChild(pallet);
    this.selectedColor = colors[1];
    this.updateButtonStyles();
  }

  private createActionButtons(): void {
    const actionContainer = document.createElement('div');
    this.resetStyle(actionContainer);
    actionContainer.style.display = 'flex';
    actionContainer.style.gap = '10px';
    actionContainer.style.marginTop = '8px';

    const shapes = ['rect', 'roundRect', 'circle', 'textarea',];
    const shapeIcons = [
      `<svg width="32" height="32"><rect width="24" height="24" x="4" y="4" style="fill:none;stroke:white;stroke-width:2;"/></svg>`,
      `<svg width="32" height="32"><rect x="4" y="4" width="24" height="24" rx="6" ry="6" style="fill:none;stroke:white;stroke-width:2;"/></svg>`,
      `<svg width="32" height="32"><circle cx="16" cy="16" r="12" style="fill:none;stroke:white;stroke-width:2;"/></svg>`,
      `<svg width="32" height="32"><text x="8" y="26" fill="white" font-size="26" font-family="Arial">A</text></svg>`,
    ];

    shapes.forEach((shape, index) => {
      const button = document.createElement('button');
      button.innerHTML = shapeIcons[index];
      button.style.display = 'flex';
      button.style.alignItems = 'center';
      button.style.justifyContent = 'center';
      button.style.border = 'none';
      button.style.backgroundColor = 'transparent';
      button.style.cursor = 'pointer';
      button.style.width = '32px';
      button.style.height = '32px';
      button.style.margin = '0 5px';
      button.addEventListener('click', () => console.log(`${shape}ボタンがクリックされました`));
      actionContainer.appendChild(button);
    });

    this.dialog.appendChild(actionContainer);
  }

  private selectColor(color: string): void {
    this.selectedColor = color;
    this.updateButtonStyles();
  }

  private updateButtonStyles(): void {
    this.colorButtons.forEach(button => {
      if (button.dataset.value === this.selectedColor) {
        button.style.outline = `2px solid ${this.colors.txt}`;
      } else {
        button.style.outline = 'none';
      }
    });
  }

  private hideDialog(): void {
    this.dialog.style.display = 'none';
  }

  private showDialog(): void {
    this.dialog.style.display = 'block';
  }

  private handleMouseMove(event: MouseEvent): void {
    if (event.clientX < 50 && event.clientY < 50) {
      this.showDialog();
    }
  }
}
