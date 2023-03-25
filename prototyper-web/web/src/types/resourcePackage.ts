import { JSONType, WithCreatedAndUpdatedAt, WithId } from './api';
import { SimpleApplication } from './application';
import { ProtoComponent } from './component';
import { Dragger } from './dragger';
import { User } from './user';

export type PackageType = 'lib' | 'material' | 'application';

export interface ResourcePackage extends WithId, WithCreatedAndUpdatedAt {
  name: string;
  version: string;
  type: PackageType;
  creator?: User;
  umds?: ResourceUrl[];
  dts?: ResourceUrl[];
  public: boolean;

  flatDependencies?: ResourcePackage[];
  flatDevDependencies?: ResourcePackage[];
  dependencies?: ResourcePackage[];
  devDependencies?: ResourcePackage[];
  excludeDependencies?: JSONType;
  globalSymbols?: JSONType;

  components?: ProtoComponent[];
  application?: SimpleApplication;
  draggers?: Dragger[];
  catalogue?: JSONType;
}

export interface ResourceUrl extends WithId, WithCreatedAndUpdatedAt {
  name: string;
  ext?: string;
  mime: string;
  size: number;
  url: string;
  provider: string;
  width?: number;
  height?: number;
}
