import {
  ComponentDescriptor,
  DefaultPropsType,
  DefaultStatesType,
  ProtoComponent,
  WithDescriptor,
} from '../component';

export type UseSetupAppStates<S = DefaultStatesType> = () => S;

export type GetComponentFunc = (
  descriptor: ComponentDescriptor
) => (ProtoComponent & WithDescriptor) | undefined;

export interface ProtoApplication<S = DefaultStatesType> {
  index: ProtoComponent & Partial<WithDescriptor>;
  initProps?: DefaultPropsType;

  useSetupAppStates?: UseSetupAppStates<S>;
  getComponent?: GetComponentFunc;
}
