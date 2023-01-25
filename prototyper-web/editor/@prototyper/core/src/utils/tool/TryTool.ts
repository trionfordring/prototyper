export class TryTool<T> {
  private ret: T;
  private error: Error;
  constructor(private readonly cb: () => T) {
    try {
      this.ret = cb();
    } catch (e) {
      this.error = e;
    }
  }

  catch(cb: (err: Error) => T): T {
    if (this.error) {
      return cb(this.error);
    } else {
      return this.ret;
    }
  }
}
