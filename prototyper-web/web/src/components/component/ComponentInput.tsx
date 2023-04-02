import { useFlatDevDependenciesCached } from '@/remote/package';
import { useApplicationInfo } from '../context/ApplicationInfoProvider';
import { useMemo } from 'react';
import { ComponentDescriptor, WithDescriptor } from '@prototyper/core';
import { ProtoComponent } from '@/types/component';
import { AutoComplete, Space } from 'antd';
import { noop } from 'lodash';
import { useUncontrolledState } from '@/hooks/useUncontrolledState';

function match(provider?: string, searchKey?: string) {
  if (!provider) return false;
  if (!searchKey) return true;
  return provider.toLowerCase().includes(searchKey.toLowerCase());
}

export function ComponentInput({
  value,
  onChange = noop,
  defaultValue,
  disabledNamespace = false,
  onBulr,
}: {
  value?: ComponentDescriptor;
  onChange?: (v?: ComponentDescriptor) => void;
  defaultValue?: ComponentDescriptor;
  disabledNamespace?: boolean;
  onBulr?: () => void;
}) {
  const application = useApplicationInfo();
  const { flatDevDependencies } = useFlatDevDependenciesCached(
    application?.mainPackage?.id
  );
  const [packageName, setPackageName] = useUncontrolledState<string>(
    value?.namespace,
    onNamespaceChange,
    defaultValue?.namespace
  );
  const [name, setName] = useUncontrolledState<string>(
    value?.name,
    onNameChange,
    defaultValue?.name
  );
  function onNamespaceChange(n: string) {
    onChange({
      name,
      namespace: n,
    });
  }
  function onNameChange(n: string) {
    onChange({
      name: n,
      namespace: packageName,
    });
  }
  const components: (ProtoComponent & WithDescriptor)[] = useMemo(() => {
    if (!flatDevDependencies) return [];
    return flatDevDependencies.flatMap((r) =>
      r.components.map((c) => {
        return {
          ...c.data,
          descriptor: {
            namespace: r.name,
            name: c.name,
          },
        };
      })
    );
  }, [flatDevDependencies]);
  const packageOptions = useMemo(() => {
    const pkgs = new Set<string>();
    components.forEach((c) => pkgs.add(c.descriptor.namespace));
    return Array.from(pkgs)
      .filter((p) => match(p, packageName))
      .map((n) => ({
        label: n,
        value: n,
      }));
  }, [components, packageName]);
  const componentOptions = useMemo(() => {
    const names = new Set<string>();
    components
      .filter((c) => c.descriptor.namespace === packageName)
      .forEach((c) => names.add(c.descriptor.name));
    return Array.from(names)
      .filter((n) => match(n, name))
      .map((n) => ({
        label: n,
        value: n,
      }));
  }, [components, name, packageName]);
  return (
    <Space.Compact block>
      <AutoComplete
        value={packageName}
        onChange={setPackageName}
        options={packageOptions}
        disabled={disabledNamespace}
        placeholder="namespace"
        onBlur={onBulr}
      />
      <AutoComplete
        value={name}
        onChange={setName}
        options={componentOptions}
        placeholder="name"
        onBlur={onBulr}
      />
    </Space.Compact>
  );
}
