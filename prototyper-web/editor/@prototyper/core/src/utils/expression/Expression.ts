export interface Expression<RET> {
  run(context: object): RET;
}
