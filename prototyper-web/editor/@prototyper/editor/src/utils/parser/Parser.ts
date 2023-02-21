export const LANG_LIST = ['jsx', 'js', 'ts', 'tsx'] as const;

type ExtractArray<T> = T extends ReadonlyArray<infer E> ? E : never;
export type LangType = ExtractArray<typeof LANG_LIST>;

export interface Parser {
  name(): string;

  support(lang: LangType): boolean;

  parse(code: string, inputLang: LangType): Promise<string>;
}
