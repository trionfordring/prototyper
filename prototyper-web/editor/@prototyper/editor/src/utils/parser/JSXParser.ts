import { transform, Transform } from 'sucrase';

import { LangType, Parser } from './Parser';

export class JSXParser implements Parser {
  static SUPPORT_LIST: LangType[] = ['js', 'jsx', 'ts', 'tsx'];
  static NAME: string = 'JSXParser';
  name(): string {
    return JSXParser.NAME;
  }
  support(lang: LangType): boolean {
    return JSXParser.SUPPORT_LIST.includes(lang);
  }
  async parse(code: string, inputLang: LangType): Promise<string> {
    const transforms: Transform[] = ['imports', 'jsx'];
    if (inputLang.startsWith('ts')) transforms.push('typescript');
    const parsedCode = transform(code, {
      transforms,
    }).code;
    console.log('代码编译完成', {
      code,
      parsedCode,
    });
    return `
      const exports = {};
      ${parsedCode}
      return exports;
    `;
  }
}
