import { SimplePackageType } from '@/remote/package';
import { JSONType, WithCreatedAndUpdatedAt, WithId } from './api';

export interface ProtoComponent extends WithId, WithCreatedAndUpdatedAt {
  name: string;
  data: JSONType;
  package: SimplePackageType;

  label?: string;
  description?: string;
  type?: string;
}
