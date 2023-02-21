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

  catchAnd(cb: (err: Error) => T): FinallyScope<T> {
    try {
      if (this.error) {
        cb(this.error);
      }
    } finally {
      return new FinallyScope(this.ret, this.error);
    }
  }
}

export class FinallyScope<T> {
  constructor(private readonly ret?: T, private readonly err?: Error) {}

  finally(cb: (ret?: T, err?: Error) => void) {
    try {
      cb(this.ret, this.err);
    } finally {
      return this.ret;
    }
  }
}
