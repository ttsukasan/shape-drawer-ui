export class SDConfig {
  static zIndexBase: number = 2147483500;
  static palletColors: string[] = ['#D52753', '#23974A', '#DF631C', '#275FE4', '#26272D'];
  // 並び順が実装に影響するけど許して
  static shapeIcons: string[] = [
    `<svg width="32" height="32"><rect width="24" height="24" x="4" y="4" style="fill:none;stroke:white;stroke-width:2;"/></svg>`,
    `<svg width="32" height="32"><rect x="4" y="4" width="24" height="24" rx="6" ry="6" style="fill:none;stroke:white;stroke-width:2;"/></svg>`,
    `<svg width="32" height="32"><circle cx="16" cy="16" r="12" style="fill:none;stroke:white;stroke-width:2;"/></svg>`,
    `<svg width="32" height="32"><text x="8" y="26" fill="white" font-size="26" font-family="Arial">A</text></svg>`,
    `<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M16 28 C24 28, 28 20, 16 4 C4 20, 8 28, 16 28 Z" style="fill:white; stroke:none; opacity:0.5;"/></svg>`
  ];
  static fontFamily: string = `"Helvetica Neue", Arial, "Hiragino Kaku Gothic ProN", "Hiragino Sans", Meiryo, sans-serif`
}
