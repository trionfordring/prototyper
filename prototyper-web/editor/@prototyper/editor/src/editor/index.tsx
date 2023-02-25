import {
  ApplicationEditor,
  ApplicationEditorInstance,
  ComponentDescriptor,
  ProtoDragger,
} from '@prototyper/core';
import { Typography } from 'antd';
import React, {
  ComponentProps,
  forwardRef,
  PropsWithChildren,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Props as RndProps } from 'react-rnd';
import styled from 'styled-components';

import EditorHeader, { EditorMode } from './header';
import EditorLeft from './leftarea';
import EditorMainContent from './main';
import { CanvasMode, ModeSlider } from './main/ModeSlider';
import EditorRight from './rightarea';
import { CONTAINER_TEMPLATE, SCRIPT_TEMPLATE } from './template';

import { TsxEditor } from '../components/code-editor/TsxEditor';
import { useSerializedComponent } from '../hooks/useSerializedComponent';
import { useSerializedModule } from '../hooks/useSerializedModule';
import { SerializedProtoApplication } from '../types/SerializedProtoApplication';
import {
  META_EDITOR_KEY,
  SerializedProtoComponent,
} from '../types/SerializedProtoComponent';

const EditorBox = styled.section`
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  height: 100%;
`;

const EditorBody = styled.div`
  position: relative;
  flex-grow: 1;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  background-color: #f5f5f5;

  overflow: hidden;
`;

const EditorMain = styled.div`
  flex-grow: 1;
  min-height: 1px;
  height: calc(100% - 45px);
  position: relative;
  margin: 15px;
`;
function getEditorMeta(component: SerializedProtoComponent) {
  if (!component.meta) return undefined;
  return component.meta[META_EDITOR_KEY];
}

export const Editor = forwardRef<
  HTMLDivElement,
  PropsWithChildren<
    ComponentProps<typeof ApplicationEditor> & {
      app: SerializedProtoApplication;
      draggers: ProtoDragger[];
      container?: React.ComponentType;
    }
  >
>(({ children, draggers, container, app, ...props }, ref) => {
  const applicationInstanceRef = useRef<ApplicationEditorInstance>();
  const [editorMode, setEditorMode] = useState<EditorMode>('edit-canvas');
  const { mode, setMode, position, setPosition, size, setSize, mainRef } =
    useCanvasInfo();
  const {
    version,
    useSetupAppStates,
    index,
    setUseSetupStates,
    setWarpper,
    script,
    setScript,
    containerScript,
    setContainerScript,
    setNodes,
    setSettings,
  } = useCodeInfo(app);
  function warpCodeSave(cb: Function) {
    return (...args: any) => {
      const instance = applicationInstanceRef.current;
      if (instance) {
        const nodes = instance.getSerializedNodes();
        console.log('暂存节点树', nodes);
        setNodes(nodes);
      } else {
        console.warn('保存代码时applicationInstance为空.');
      }
      cb(...args);
    };
  }
  const editorArea = (() => {
    switch (editorMode) {
      case 'edit-script':
        return (
          <TsxEditor
            key="script"
            name="script"
            label={<EditorName descriptor={index.descriptor} target="脚本" />}
            defaultCode={SCRIPT_TEMPLATE}
            initCode={script}
            onChange={setScript}
            onSave={warpCodeSave(setUseSetupStates)}
          ></TsxEditor>
        );
      case 'edit-container':
        return (
          <TsxEditor
            key="container"
            name="container"
            label={<EditorName descriptor={index.descriptor} target="容器" />}
            defaultCode={CONTAINER_TEMPLATE}
            initCode={containerScript}
            onChange={setContainerScript}
            onSave={warpCodeSave(setWarpper)}
          ></TsxEditor>
        );
      default:
        return null;
    }
  })();
  return (
    <EditorBox ref={ref}>
      <EditorHeader
        size={size}
        setSize={setSize}
        mode={editorMode}
        setMode={setEditorMode}
      />
      <EditorBody>
        <ApplicationEditor
          {...props}
          key={version}
          app={{
            initProps: app.initProps,
            initPropsMapper: app.initPropsMapper,
            useSetupAppStates,
            index,
          }}
          onApplicationMounted={(instance) =>
            (applicationInstanceRef.current = instance)
          }
          disabled={props.disabled || mode !== 'edit'}
        >
          {editorMode === 'edit-canvas' && (
            <React.Fragment>
              <EditorLeft draggers={draggers} />
              <ModeSlider mode={mode} setMode={setMode} />
              <EditorMain ref={mainRef}>
                <EditorMainContent
                  position={position}
                  setPosition={setPosition}
                  container={container}
                  enableDragging={mode === 'drag'}
                  size={size}
                  setSize={setSize}
                >
                  {children}
                </EditorMainContent>
              </EditorMain>
              <EditorRight
                onSettingsMetaChange={(settings) => {
                  console.log('设置组件的设置器:', settings);
                  setSettings(settings);
                  applicationInstanceRef.current.setRootMeta((meta) => {
                    return {
                      ...meta,
                      [META_EDITOR_KEY]: {
                        ...meta?.[META_EDITOR_KEY],
                        settings,
                      },
                    };
                  });
                }}
              />
            </React.Fragment>
          )}
        </ApplicationEditor>
        {editorArea}
      </EditorBody>
    </EditorBox>
  );
});

function EditorName({
  descriptor,
  target,
}: {
  descriptor: ComponentDescriptor;
  target: React.ReactNode;
}) {
  return (
    <Typography.Text type="secondary">
      正在编辑
      <Typography.Text strong code>
        {`${descriptor.namespace}-${descriptor.name}`}
      </Typography.Text>
      的{target}
    </Typography.Text>
  );
}

function useCanvasInfo() {
  const [mode, setMode] = useState<CanvasMode>('edit');
  const [position, setPosition] = useState<RndProps['position']>({
    x: 0,
    y: 0,
  });
  const [size, setSize] = useState<RndProps['size']>({
    height: 'auto',
    width: '100%',
  });
  const mainRef = useRef<HTMLDivElement>();
  const resetCanvas = useCallback(() => {
    setPosition({
      x: 0,
      y: 0,
    });
    const dom = mainRef.current;
    if (dom) {
      const { height, width } = dom.getBoundingClientRect();
      setSize({
        height,
        width,
      });
    }
  }, []);
  useEffect(() => {
    resetCanvas();
  }, [resetCanvas]);

  return {
    mode,
    setMode,
    position,
    setPosition,
    size,
    setSize,
    mainRef,
    resetCanvas,
  };
}

function useCodeInfo(app: SerializedProtoApplication) {
  const [useSetupAppStatesInfo, setUseSetupAppStates] = useState(
    app.useSetupAppStatesInfo
  );
  const useSetupAppStates = useSerializedModule(
    useSetupAppStatesInfo,
    app.useSetupAppStates
  );
  const [warpperInfo, setWarpper] = useState(getEditorMeta(app.index)?.warpper);
  const [useSetupStatesInfo, setUseSetupStates] = useState(
    getEditorMeta(app.index)?.useSetupStates
  );

  const [nodes, setNodes] = useState(app.index?.virtualDom);

  const [settings, setSettings] = useState(getEditorMeta(app.index)?.settings);

  const index = useSerializedComponent(
    app.index,

    useSetupStatesInfo,
    warpperInfo,
    nodes,
    settings
  );
  const [version, setVersion] = useState(0);
  const initMark = useRef(false);
  useEffect(() => {
    if (!initMark.current) {
      initMark.current = true;
      return;
    }
    console.log('刷新画布状态');
    setVersion((v) => v + 1);
  }, [useSetupStatesInfo, warpperInfo, useSetupAppStatesInfo]);

  const [script, setScript] = useState(useSetupStatesInfo?.src);
  const [containerScript, setContainerScript] = useState(warpperInfo?.src);
  return {
    useSetupAppStatesInfo,
    setUseSetupAppStates,
    useSetupAppStates,

    warpperInfo,
    setWarpper,

    useSetupStatesInfo,
    setUseSetupStates,

    script,
    setScript,
    containerScript,
    setContainerScript,

    nodes,
    setNodes,

    setSettings,

    index,
    version,
  };
}
