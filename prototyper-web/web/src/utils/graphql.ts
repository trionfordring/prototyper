import { FragmentInfo } from './fragments';

const MutationHeaderReg = /(mutation|query) ([a-z]+)/i;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class GraphQLDocument<R = {}, T = {}> {
  private readonly value: string;
  public readonly name: string;
  public readonly type: 'query' | 'mutation';
  constructor(
    public readonly documentStr: string,
    public readonly dependencies: FragmentInfo[]
  ) {
    const depMap = {};
    const fragmentStrs = dependencies.map((dep) =>
      FragmentInfo.stringify(dep, depMap)
    );
    this.value = fragmentStrs.join('\n').concat(documentStr);

    const trimedDocumentStr = documentStr.trim();
    if (trimedDocumentStr.startsWith('{')) {
      this.name = '';
      this.type = 'query';
    } else {
      const match = documentStr.match(MutationHeaderReg);
      if (match?.length === 3) this.name = match[2];
      else this.name = '';
      if (match?.[1] === 'mutation') this.type = 'mutation';
      else this.type = 'query';
    }
  }

  public stringify(): string {
    return this.value;
  }

  public info(): string {
    return `graphql[${this.type} ${this.name}]`;
  }
}

export function graphql<R = {}, T = {}>(): typeof graphql1<R, T> {
  return graphql1;
}

function graphql1<R = {}, T = {}>(
  str: TemplateStringsArray,
  ...args: any[]
): GraphQLDocument<R, T> {
  const dependencies: FragmentInfo[] = [];
  const documentStr = str
    .reduce((pre: any[], cur: string, idx: number) => {
      pre.push(cur);
      let arg = args[idx];
      if (cur.endsWith('...')) {
        if (typeof arg === 'function') arg = arg();
        if (arg instanceof FragmentInfo) {
          dependencies.push(arg);
          pre.push(arg.name);
        } else throw new Error('输入了错误的fragment');
      } else {
        arg && pre.push(String(arg));
      }
      return pre;
    }, [])
    .join('');
  return new GraphQLDocument(documentStr, dependencies);
}
