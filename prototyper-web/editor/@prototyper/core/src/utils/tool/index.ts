import { TryTool } from './TryTool';

export class Tool {
  static try<T>(cb: () => T) {
    return new TryTool(cb);
  }
}
