import { useApplicationInfo } from '@/components/context/ApplicationInfoProvider';
import { DependenciesInput, toDepIds } from './DependenciesInput';
import { useState } from 'react';
import { Button, message } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { useUpdatePackageDeps } from '@/remote/package';
import { AsyncButton } from '@/components/gizmo/AsyncButton';

export function DependenciesForm() {
  const app = useApplicationInfo();
  const [ids, setIds] = useState(() => toDepIds(app.mainPackage.dependencies));
  const [changed, setChanged] = useState(false);
  const { updatePackageDeps } = useUpdatePackageDeps();
  const [messageApi, messageContext] = message.useMessage();
  return (
    <DependenciesInput
      onChange={(v) => {
        setIds(v);
        setChanged(true);
      }}
      value={ids}
    >
      {messageContext}
      {changed && (
        <AsyncButton
          type="primary"
          icon={<SaveOutlined />}
          onClick={async () => {
            await updatePackageDeps(ids);
            setChanged(false);
            messageApi.success('操作成功!');
          }}
        >
          保存
        </AsyncButton>
      )}
    </DependenciesInput>
  );
}
