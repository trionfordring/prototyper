import { CloseOutlined } from '@ant-design/icons';
import { Button, Modal } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';

export type EditorMode = 'edit-canvas' | 'edit-script' | 'edit-container';

export function EditorHeaderRight({ mode }: { mode: EditorMode }) {
  const [closing, setClosing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const appId = router.query.appId as string | undefined;
  const href = appId ? `/app/${encodeURIComponent(appId)}` : '/';
  const clickHerf = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setClosing(true);
    router.push(href).finally(() => {
      setClosing(false);
      setIsModalOpen(false);
    });
  };
  if (mode !== 'edit-canvas') return <></>;
  return (
    <>
      <Modal
        centered
        title="确认关闭"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => setIsModalOpen(false)}
        confirmLoading={closing}
        cancelText="返回"
        okText="确认关闭编辑器"
      >
        <p>请确认已保存当前的工作。</p>
      </Modal>
      <Link legacyBehavior passHref href={href}>
        <Button type="primary" icon={<CloseOutlined />} onClick={clickHerf}>
          退出编辑器
        </Button>
      </Link>
    </>
  );
}
