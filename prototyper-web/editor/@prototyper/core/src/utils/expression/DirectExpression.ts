import { Expression } from './Expression';

export class DirectExpression<T = undefined> implements Expression<T> {
  constructor(private readonly output?: T) {}
  run(context: object): T {
    return this.output;
  }
}
