import { ID, PageMeta } from '@/types/api';
import { FragmentInfo, fragment } from '@/utils/fragments';
import { isNil } from 'lodash';

export interface Entity<T, I = ID> {
  id: I;
  attributes: T;
}

export interface ResponseFragmentType<T, I = ID> {
  data: Entity<T, I>;
}

export interface ResponseRelationCollectionFragmentType<T, I = ID> {
  data: Entity<T, I>[];
}

export interface ResponseCollectionFragmentType<T, I = ID> {
  meta: {
    pagination: PageMeta;
  };
  data: Entity<T, I>[];
}

function getFragmentName(
  typeName: string,
  suffix: string,
  attributesName?: string
) {
  const processedTypeName =
    typeName.charAt(0).toLowerCase() + typeName.substring(1);
  if (isNil(attributesName)) {
    return `${processedTypeName}ID${suffix}`;
  } else if (attributesName.toLowerCase() === typeName.toLowerCase()) {
    return `${processedTypeName}${suffix}`;
  } else {
    return `${attributesName}${suffix}`;
  }
}
function getTypeName(typeName: string, suffix: string) {
  return `${typeName.charAt(0).toUpperCase() + typeName.substring(1)}${suffix}`;
}

export function responseRelationCollection(
  typeName: string,
  attributes?: FragmentInfo
) {
  const realName = typeName.endsWith('Relation')
    ? typeName
    : typeName + 'Relation';
  const name = getFragmentName(realName, 'Collection', attributes?.name);
  const type = getTypeName(realName, 'ResponseCollection');
  const justId = isNil(attributes);
  if (justId)
    return fragment`fragment ${name} on ${type} {
    data {
      id
    }
  }
  `;
  return fragment`fragment ${name} on ${type} {
  data {
    id
    attributes {
      ...${attributes}
    }
  }
}
`;
}
export function responseCollectionFragment(
  typeName: string,
  attributes?: FragmentInfo
) {
  const name = getFragmentName(typeName, 'Collection', attributes?.name);
  const type = getTypeName(typeName, 'EntityResponseCollection');
  const justId = isNil(attributes);
  if (justId)
    return fragment`fragment ${name} on ${type} {
    meta {
      pagination {
        total
        page
        pageSize
        pageCount
      }
    }
    data {
      id
    }
  }
  `;
  return fragment`fragment ${name} on ${type} {
  meta {
    pagination {
      total
      page
      pageSize
      pageCount
    }
  }
  data {
    id
    attributes {
      ...${attributes}
    }
  }
}
`;
}

export function responseFragment(typeName: string, attributes?: FragmentInfo) {
  const name = getFragmentName(typeName, 'Entity', attributes?.name);
  const type = getTypeName(typeName, 'EntityResponse');
  const justId = isNil(attributes);
  if (justId)
    return fragment`fragment ${name} on ${type} {
    data {
      id
    }
  }
  `;
  return fragment`fragment ${name} on ${type} {
  data {
    id
    attributes {
      ...${attributes}
    }
  }
}
`;
}
