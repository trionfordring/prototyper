import { useEditor, useNode } from '@prototyper/core';
import { FC, useEffect, useState } from 'react';
import ContentEditable from 'react-contenteditable';
export const Text: FC<{
  textExpr: string;
}> = ({ textExpr }) => {
  const {
    connectors: { connect, drag },
    actions: { setProp },
    hasSelectedNode,
    props,
  } = useNode((state) => ({
    hasSelectedNode: state.events.selected,
    props: state.data.props,
  }));
  const { enabled } = useEditor((state) => ({
    enabled: state.options.enabled,
  }));
  const [editable, setEditable] = useState(false);
  const [editContent, setEditContent] = useState<string>();

  useEffect(() => {
    if (!hasSelectedNode) {
      setEditable(false);
      if (editContent) {
        setProp((props: any) => (props.textExpr = editContent));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasSelectedNode]);
  return (
    <h3
      onClick={() => {
        if (enabled && !editable) {
          setEditContent(props.textExpr);
          setEditable(true);
        }
      }}
      ref={(ref) => connect(drag(ref as HTMLElement))}
    >
      {editable ? (
        <div style={{ padding: '5px', border: '1px solid blue' }}>
          <ContentEditable
            disabled={!editable}
            html={editContent || ''}
            onChange={(e) => {
              setEditContent(e.target.value.replace(/<\/?[^>]+(>|$)/g, ''));
            }}
          ></ContentEditable>
        </div>
      ) : (
        textExpr
      )}
    </h3>
  );
};
