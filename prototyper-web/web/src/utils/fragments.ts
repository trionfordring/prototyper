import { isNil } from 'lodash';

export class FragmentInfo {
  constructor(
    public readonly name: string,
    public readonly type: string,
    public readonly dependencies: FragmentInfo[],
    public readonly value: string
  ) {}

  public static stringify(
    self: FragmentInfo,
    definedMap: Record<string, FragmentInfo> = {}
  ): string {
    const ans: string[] = [];
    function doStringify(current: FragmentInfo) {
      if (definedMap[current.name]) return;
      definedMap[current.name] = current;
      current.dependencies.forEach(doStringify);
      ans.push(current.value);
    }
    doStringify(self);
    return ans.join('\n');
  }

  public stringify(): string {
    return FragmentInfo.stringify(this);
  }
}

const fragmentHeadReg = /fragment[\s]+([_a-z]+)[\s]+on[\s]+([a-z]+)/gi;

export function fragment(
  str: TemplateStringsArray,
  ...args: any[]
): FragmentInfo {
  const dependencies: FragmentInfo[] = [];
  const fragmentStr = str
    .reduce((pre: any[], cur: string, idx: number) => {
      pre.push(cur);
      let arg = args[idx];
      if (cur.endsWith('...')) {
        if (typeof arg === 'function') arg = arg();
        if (arg instanceof FragmentInfo) {
          dependencies.push(arg);
          pre.push(arg.name);
        } else {
          throw new Error(`输入了错误的fragment,类型为: ${typeof arg}`);
        }
      } else {
        arg && pre.push(String(arg));
      }
      return pre;
    }, [])
    .join('');
  const headerIter = fragmentStr.matchAll(fragmentHeadReg);
  const fragmentStarts: {
    index: number;
    name: string;
    type: string;
  }[] = [];
  for (
    let header = headerIter.next();
    !header.done;
    header = headerIter.next()
  ) {
    const arr = header.value;
    const name = arr[1];
    const type = arr[2];
    if (!name || !type || isNil(header.value.index)) continue;
    fragmentStarts.push({
      index: header.value.index,
      name,
      type,
    });
  }

  fragmentStarts.sort((a, b) => a.index - b.index);
  if (fragmentStarts.length === 0) {
    throw new Error('未解析到fragment表达式:\n' + fragmentStr);
  }
  if (fragmentStarts.length > 1)
    throw new Error('解析到了多个fragment表达式:\n' + fragmentStr);
  const { name, type } = fragmentStarts[0];
  return new FragmentInfo(name, type, dependencies, fragmentStr);
}
