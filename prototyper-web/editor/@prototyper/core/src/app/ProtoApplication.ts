import {
  ComponentDescriptor,
  DefaultPropsType,
  DefaultStatesType,
  ProtoComponent,
  WithDescriptor,
} from '../component';
import { PropDeclear } from '../utils';

export type UseSetupAppStates<S = DefaultStatesType> = () => S;

export type GetComponentFunc = (
  descriptor: ComponentDescriptor
) => (ProtoComponent & WithDescriptor) | undefined;

export interface ProtoApplication<S = DefaultStatesType> {
  baseurl?: string;
  index: ProtoComponent & Partial<WithDescriptor>;
  initProps?: DefaultPropsType;
  initPropsMapper?: PropDeclear;

  useSetupAppStates?: UseSetupAppStates<S>;
  getComponent?: GetComponentFunc;
}
