import {SDTextarea} from "./SDTextarea";
import {SDRoundRect} from "./SDRoundRect";
import {SDShape} from "./SDShape";
import {SDRect} from "./SDRect";
import {SDCircle} from "./SDCircle";
import {SDBlur} from "./SDBlur";
import {SDConfig} from "./SDConfig";

export class SDMenu {
  private dialog: HTMLDivElement;
  private closeButton!: HTMLButtonElement;
  private colors: { txt: string, bg: string, gray: string } = {txt: '#FFFEFE', bg: '#292D3E', gray: '#ABB2BF'};
  private colorButtons: HTMLButtonElement[] = [];
  private selectedColor: string = 'black';
  private shapes: SDShape[] = [];

  constructor() {
    this.dialog = this.createDialog();
    // this.closeButton = this.createCloseButton();
    // this.dialog.appendChild(this.closeButton);
    this.createCloseButton()
    this.createColorButtons()
    this.createActionButtons()
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
    dialog.style.zIndex = `${SDConfig.zIndexBase}`;
    // const title = document.createElement('div')
    // this.resetStyle(title)
    // title.style.color = this.colors.txt
    // title.style.display = 'inline-block'
    // title.style.fontSize = '12px'
    // title.innerText = '枠ポン'
    // dialog.appendChild(title)
    return dialog;
  }

  private createCloseButton(): void {
    const div = document.createElement('div');
    this.resetStyle(div);
    div.style.textAlign = 'right';
    const button = document.createElement('button');
    this.resetStyle(button);
    button.innerText = '閉じる';
    button.style.backgroundColor = 'transparent';
    button.style.textDecoration = 'underline';
    // button.style.fontSize = '12px';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.cursor = 'pointer';
    // button.style.float = 'right';
    // button.style.marginLeft = '10px';
    // return button;
    div.appendChild(button);
    this.dialog.appendChild(div);
    this.closeButton = button;

  }

  private createColorButtons(): void {
    const pallet = document.createElement('div');
    this.resetStyle(pallet);

    SDConfig.palletColors.forEach(color => {
      const button = document.createElement('button');
      button.dataset.value = color;
      button.style.backgroundColor = color;
      button.style.border = `solid 1px rgba(255, 255, 255, .4)`;
      button.style.color = 'white';
      button.style.margin = '4px';
      button.style.cursor = 'pointer';
      button.style.padding = '8px';
      button.style.borderRadius = '50%';
      button.addEventListener('click', () => this.selectColor(color));
      pallet.appendChild(button);
      this.colorButtons.push(button);
    });
    this.dialog.appendChild(pallet);
    this.selectedColor = SDConfig.palletColors[0];
    this.updateButtonStyles();
  }

  private createActionButtons(): void {
    const actionContainer = document.createElement('div');
    this.resetStyle(actionContainer);
    actionContainer.style.display = 'flex';
    actionContainer.style.gap = '10px';
    actionContainer.style.marginTop = '8px';

    const shapes = ['rect', 'roundRect', 'circle', 'textarea', 'blur'];
    shapes.forEach((shape, index) => {
      const button = document.createElement('button');
      button.innerHTML = SDConfig.shapeIcons[index];
      button.style.display = 'flex';
      button.style.alignItems = 'center';
      button.style.justifyContent = 'center';
      button.style.border = 'none';
      button.style.backgroundColor = 'transparent';
      button.style.cursor = 'pointer';
      button.style.width = '32px';
      button.style.height = '32px';
      button.style.margin = '0 5px';
      button.style.padding = '0';
      button.addEventListener('click', () => {
        const shapeId = this.shapes.length + 1;
        const klass = {
          textarea: SDTextarea,
          roundRect: SDRoundRect,
          rect: SDRect,
          circle: SDCircle,
          blur: SDBlur
        }[shape]
        klass && this.shapes.push(new klass(shapeId, this.selectedColor));
      })
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
