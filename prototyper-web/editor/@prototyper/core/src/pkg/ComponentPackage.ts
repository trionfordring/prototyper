import { ProtoComponent } from '../component/ProtoComponent';
import { ProtoDragger } from '../dragger';

export interface ComponentPackage {
  namespace: string;
  components: Record<string, ProtoComponent>;
  draggers: ProtoDragger[];

  createComponent(component: ProtoComponent & { name: string }): void;
  addDragger(dragger: ProtoDragger): void;
}
