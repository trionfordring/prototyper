import { CreateProtoComponentType } from '../component';
import { ProtoComponent } from '../component/ProtoComponent';
import { ProtoDragger } from '../dragger';

export interface ComponentPackage {
  namespace: string;
  components: Record<string, ProtoComponent>;
  draggers: ProtoDragger[];

  createComponent(component: CreateProtoComponentType & { name: string }): void;
  addDragger(dragger: ProtoDragger): void;
}
