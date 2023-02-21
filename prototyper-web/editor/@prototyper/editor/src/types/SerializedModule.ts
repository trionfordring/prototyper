import { LangType } from '../utils/parser/Parser';

export interface SerializedModule {
  src: string;
  compiledSrc: string;

  parser?: string;
  langType: LangType;
}
