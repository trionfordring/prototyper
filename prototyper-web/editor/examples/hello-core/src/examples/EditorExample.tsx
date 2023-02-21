import { globalPackagesRegistry } from '@prototyper/core';
import { Editor } from '@prototyper/editor';

import styled from '../utils/FakeStyled';

const editorStyle = styled`
  body {
    /* 由于样式隔离，这段css不会生效 */
    background-color: red;
  }
  /* 可以通过root类访问到根渲染器 */
  .root {
  }
`;

function EditorExample() {
  const pkg = globalPackagesRegistry.getPackage('hello');
  const stdPkg = globalPackagesRegistry.getPackage('std');
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      }}
    >
      <Editor
        app={{
          index: pkg.getComponent('StdComponent') as any,
        }}
        draggers={[...pkg.draggers, ...stdPkg.draggers]}
      >
        <style>{editorStyle}</style>
      </Editor>
    </div>
  );
}

export default EditorExample;
