import { CreateProtoComponentType } from '../component';
import { ProtoComponent, WithDescriptor } from '../component/ProtoComponent';
import { ProtoDragger } from '../dragger';

export interface ComponentPackage {
  namespace: string;
  components: Record<string, ProtoComponent>;
  draggers: ProtoDragger[];

  getComponent(name: string): (ProtoComponent & WithDescriptor) | undefined;
  createComponent(component: CreateProtoComponentType & { name: string }): void;
  addDragger(dragger: ProtoDragger): void;
}
