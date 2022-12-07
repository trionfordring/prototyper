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
    border: 1px solid #000;
    padding: 5px;
  }
`;
function EditorExample() {
  return (
    <Editor
      app={{
        index:
          globalPackagesRegistry.getPackage('hello').components[
            'TestVirtualComp'
          ],
      }}
    >
      <style>{editorStyle}</style>
    </Editor>
  );
}

export default EditorExample;
