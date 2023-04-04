import { BasicPackageType } from '@/remote/package-gql';
import { ID } from '@/types/api';
import { identity, isEmpty } from 'lodash';
import { PropsWithChildren, useEffect, useRef, useState } from 'react';
import { DependenciesCheckbox } from './DependenciesCheckbox';
import { useUncontrolledState } from '@/hooks/useUncontrolledState';
import { useAsyncMemo } from '@/hooks/useAsyncMemo';
import { Button, Card, Modal, Space, Spin } from 'antd';
import styled from 'styled-components';
import { LoadingOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { loadBasicPackagesByIds } from '@/remote/package';
import { DependenciesMarket } from './DependenciesMarket';

const DepItem = styled.div`
  margin-bottom: 8px;
`;

export function DependenciesInput({
  value,
  onChange,
  defalutValue = [],
  cache: cacheProps,
  children,
}: PropsWithChildren<{
  value?: ID[];
  onChange?: (v: ID[]) => void;
  defalutValue?: ID[];
  cache?: Map<ID, BasicPackageType>;
}>) {
  const [openMarket, setOpenMarket] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalApi, modalContext] = Modal.useModal();
  const [depIds, setDepIds] = useUncontrolledState(
    value,
    onChange,
    defalutValue
  );
  const [depIdsInMarket, setDepIdsInMarket] = useState(depIds);
  const cacheRef = useRef(cacheProps);
  useEffect(() => {
    cacheRef.current = cacheProps;
    if (!cacheRef.current) cacheRef.current = new Map();
  }, [cacheProps]);
  async function loadPackages(ids: ID[]) {
    if (isEmpty(ids)) return;
    setLoading(true);
    try {
      const pkgs = await loadBasicPackagesByIds(ids);
      pkgs.forEach((p) => cacheRef.current.set(p.id, p));
    } finally {
      setLoading(false);
    }
  }
  async function getPackages(ids: ID[]) {
    const cache = cacheRef.current;
    const needFetchIds = ids.filter((id) => !cache.has(id));
    await loadPackages(needFetchIds);
    const pkgs = ids.map((id) => cache.get(id)).filter(identity);
    return pkgs;
  }
  function removeDep(dep: BasicPackageType) {
    modalApi.confirm({
      title: `注意`,
      content: (
        <>
          <p>{`确定要移除依赖[${dep.name}]吗?`}</p>
          <p>{`应用组件将无法访问到该资源包。`}</p>
        </>
      ),
      onOk() {
        setDepIds((ids) => ids.filter((i) => i !== dep.id));
      },
    });
  }
  const depList: BasicPackageType[] | undefined = useAsyncMemo(async () => {
    return await getPackages(depIds);
  }, [depIds]);
  if (!Array.isArray(depList)) return <></>;
  return (
    <div>
      {modalContext}
      {depList.map((dep) => (
        <DepItem key={dep.id}>
          <DependenciesCheckbox
            pkg={dep}
            checked
            onChange={() => removeDep(dep)}
          />
        </DepItem>
      ))}
      {isEmpty(depList) && !loading ? (
        <DepItem>
          <Card>...尚无依赖</Card>
        </DepItem>
      ) : null}
      {loading ? (
        <Spin indicator={<LoadingOutlined spin />} tip="正在载入...">
          <DepItem>
            <Card></Card>
          </DepItem>
        </Spin>
      ) : null}
      <div>
        <Space style={{ float: 'right' }}>
          <Button
            icon={<PlusCircleOutlined />}
            onClick={() => {
              setOpenMarket(true);
              setDepIdsInMarket(depIds);
            }}
          >
            物料市场
          </Button>
          {children}
        </Space>
      </div>
      <Modal
        title="物料市场"
        open={openMarket}
        onCancel={() => setOpenMarket(false)}
        onOk={() => {
          setDepIds(Array.from(depIdsInMarket));
          setOpenMarket(false);
        }}
      >
        <DependenciesMarket
          value={depIdsInMarket}
          onChange={setDepIdsInMarket}
        />
      </Modal>
    </div>
  );
}

export function toDepMap(arr: BasicPackageType[]): Map<ID, BasicPackageType> {
  const ans = new Map<ID, BasicPackageType>();
  if (isEmpty(arr)) return ans;
  arr.forEach((d) => ans.set(d.id, d));
  return ans;
}

export function toDepIds(arr: BasicPackageType[]): ID[] {
  if (isEmpty(arr)) return [];
  const idSet = new Set(arr.map((d) => d.id));
  return Array.from(idSet);
}
