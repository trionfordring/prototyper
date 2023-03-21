import {
  BgColorsOutlined,
  BuildOutlined,
  EditOutlined,
} from '@ant-design/icons';
import { EditorMode } from './EditorHeaderRight';
import styled from 'styled-components';

const Title = styled.span`
  font-weight: lighter;
  user-select: none;
  .anticon {
    color: #002766;
    margin-right: 0.6em;
  }
`;

export function EditorTitle({ mode }: { mode: EditorMode }) {
  if (mode === 'edit-script')
    return (
      <Title>
        <EditOutlined />
        Prototyper 脚本编辑器
      </Title>
    );
  if (mode === 'edit-container')
    return (
      <Title>
        <BgColorsOutlined />
        Prototyper 样式编辑器
      </Title>
    );
  return (
    <Title>
      <BuildOutlined />
      Prototyper 组件编辑器
    </Title>
  );
}
