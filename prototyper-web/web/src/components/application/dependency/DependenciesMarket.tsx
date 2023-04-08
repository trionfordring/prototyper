import { useUncontrolledState } from '@/hooks/useUncontrolledState';
import { useBasicPackages } from '@/remote/package';
import { ID } from '@/types/api';
import { LoadingOutlined } from '@ant-design/icons';
import { Card, Input, Pagination, Space, Spin } from 'antd';
import { useState } from 'react';
import { DependenciesCheckbox } from './DependenciesCheckbox';
import styled from 'styled-components';

const DepItem = styled.div`
  margin-bottom: 8px;
`;
const ContextCard = styled(Card)`
  & > .ant-card-body {
    min-height: 440px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .contnxt {
    flex-grow: 1;
  }
`;

export function DependenciesMarket({
  value,
  onChange,
  defalutValue = [],
}: {
  value?: ID[];
  onChange?: (v: ID[]) => void;
  defalutValue?: ID[];
}) {
  const [depIds, setDepIds] = useUncontrolledState(
    value,
    onChange,
    defalutValue
  );
  const [searchKey, setSearchKey] = useState('');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(6);
  const { isLoading, packages, pageMeta } = useBasicPackages(searchKey, {
    pageSize,
    page,
  });
  function setDepId(id: ID, status: boolean) {
    if (status) {
      setDepIds((ids) => {
        if (ids.includes(id)) return ids;
        return [...ids, id];
      });
    } else {
      setDepIds((ids) => {
        const idx = ids.findIndex((i) => i === id);
        if (idx < 0) return ids;
        const ans = Array.from(ids);
        ans.splice(idx, 1);
        return ans;
      });
    }
  }
  return (
    <div>
      <Input.Search
        placeholder="通过名称检索"
        onSearch={(v) => {
          if (v === searchKey) return;
          setSearchKey(v);
          setPage(0);
        }}
      />
      <Spin
        spinning={isLoading}
        indicator={<LoadingOutlined spin />}
        tip="正在载入"
      >
        <ContextCard
          style={{
            minHeight: '420px',
          }}
        >
          {packages ? (
            <>
              <div className="contnxt">
                {packages.map((p) => (
                  <DepItem key={p.id}>
                    <DependenciesCheckbox
                      small
                      pkg={p}
                      checked={depIds.includes(p.id)}
                      onChange={(e) => {
                        setDepId(p.id, e.target.checked);
                      }}
                    />
                  </DepItem>
                ))}
              </div>
              <Pagination
                showQuickJumper
                pageSize={pageMeta?.pageSize}
                total={pageMeta?.total}
                current={pageMeta?.page}
                onChange={(pageNumber, pageSize) => {
                  setPage(pageNumber);
                  setPageSize(pageSize);
                }}
              />
            </>
          ) : null}
        </ContextCard>
      </Spin>
    </div>
  );
}
