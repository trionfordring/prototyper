import { CloseOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';

export type EditorMode = 'edit-canvas' | 'edit-script' | 'edit-container';

export function EditorHeaderRight({ mode }: { mode: EditorMode }) {
  const router = useRouter();
  const appId = router.query.appId as string | undefined;

  return (
    <Link
      legacyBehavior
      passHref
      href={appId ? `/app/${encodeURIComponent(appId)}` : '/'}
    >
      <Button type="primary" icon={<CloseOutlined />}>
        退出编辑器
      </Button>
    </Link>
  );
}
