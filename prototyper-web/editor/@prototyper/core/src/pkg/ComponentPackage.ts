import { CreateProtoComponentType } from '../component';
import { ProtoComponent, WithDescriptor } from '../component/ProtoComponent';
import { ProtoDragger } from '../dragger';
import { Category } from '../types';
import { Setter } from '../utils';

export interface ComponentPackage {
  namespace: string;
  components: Record<string, ProtoComponent>;
  draggers: ProtoDragger[];
  catalogue: Category[];

  meta(): any;
  setMeta(meta: Setter): void;
  getComponent(name: string): (ProtoComponent & WithDescriptor) | undefined;
  createComponent(
    component: CreateProtoComponentType & {
      name?: string;
    } & Partial<WithDescriptor>
  ): void;
  addDragger(dragger: ProtoDragger): void;
  createCategory(
    name: string,
    label: string,
    order?: number
  ): CategoryOperations;
}

export interface CategoryOperations {
  addSubcategory(name: string, label: string, order?: number): void;
}
