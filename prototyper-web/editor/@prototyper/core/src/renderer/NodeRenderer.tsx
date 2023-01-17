import { NodeElement, NodeId, useNode } from '@craftjs/core';
import React, { FC, useMemo } from 'react';

import { RenderError } from './RenderError';
import { RenderFailback } from './RenderFailback';

import { ComponentWarpper } from '../component/ComponentWarpper';
import { defaultMapProps } from '../component/mapProps';
import { LoopContext, useComponentContext } from '../context';
import {
  ProtoExprContext,
  useProtoExprContext,
} from '../hook/useProtoExprContext';

function getRealProps(
  name: string,
  props: any,
  context: ProtoExprContext,
  mapFunc = defaultMapProps
): {
  realProps: any;
  error?: Error;
} {
  try {
    return {
      realProps: mapFunc(props, context),
    };
  } catch (e) {
    return {
      realProps: {},
      error: new Error(`节点[${name}]的属性计算失败: ${e.message || e}`),
    };
  }
}

function getRealCustom(
  name: string,
  custom: any,
  context: ProtoExprContext,
  mapFunc = defaultMapProps
): {
  realCustom: any;
  error?: Error;
} {
  try {
    return {
      realCustom: mapFunc(custom, context),
    };
  } catch (e) {
    return {
      realCustom: {},
      error: new Error(`节点[${name}]的通用设置计算失败: ${e.message || e}`),
    };
  }
}

function getForKey(
  name: string,
  forKey: any,
  context: ProtoExprContext,
  mapFunc = defaultMapProps
) {
  try {
    return mapFunc({ keyExpr: forKey }, context)['keyExpr'];
  } catch (e) {
    throw new Error(`节点[${name}]的循环key计算失败: ${e.message || e}`);
  }
}

function getRender(
  type: string | React.ComponentType,
  props: any,
  children: React.ReactNode
) {
  let render = React.createElement(type, props, children);
  if (typeof type == 'string') {
    render = <SimpleElement render={render} />;
  }
  return render;
}

export const NodeRenderer: FC = () => {
  const {
    type,
    props,
    nodes,
    hydrationTimestamp,
    id,
    connectors: { connect },
    name,
    custom,
  } = useNode((node) => ({
    type: node.data.type,
    props: node.data.props,
    nodes: node.data.nodes,
    hydrationTimestamp: node._hydrationTimestamp,
    id: node.id,
    name: node.data.displayName,
    custom: node.data.custom,
  }));
  const componentContext = useComponentContext();
  const exprContext = useProtoExprContext();

  const node = useMemo(() => {
    if (!type) return null;
    const protoComponent = componentContext.component;
    const { error: customError, realCustom } = getRealCustom(
      name,
      custom,
      exprContext,
      protoComponent.mapProps
    );
    if (customError) {
      return <RenderError msg={customError.message}></RenderError>;
    }

    // 应用hidden属性
    if (realCustom.hiddenVal) {
      return null;
    }

    // 子节点计算
    let children = props.children;
    if (nodes && nodes.length > 0) {
      children = (
        <React.Fragment>
          {nodes.map((id: NodeId) => (
            <NodeElement id={id} key={id} />
          ))}
        </React.Fragment>
      );
    }

    // 对于根节点，直接返回
    {
      const isRoot = id === 'ROOT';
      const isAppRoot = isRoot && componentContext.root;
      // 对于应用根节点，需要connect的Warpper
      if (isAppRoot) {
        const realProps = getRealProps(
          name,
          componentContext.props,
          exprContext,
          protoComponent.mapProps
        );

        if (realProps.error)
          return <RenderError msg={realProps.error.message}></RenderError>;
        return (
          <ComponentWarpper
            render={protoComponent.warpper}
            ref={(ref) => connect(ref)}
            props={realProps.realProps}
            className={protoComponent.className}
            editing={componentContext.editing}
            descriptor={protoComponent.descriptor}
            root
          >
            {children}
          </ComponentWarpper>
        );
      } else if (isRoot) {
        // 对于非应用根节点的root，直接渲染它的子节点即可(它的warpper会被它的父Render渲染)
        return children;
      }
    }

    let render;

    // 处理for循环
    let forVal = realCustom['forVal'];
    // 当forVal为一个数字，将重复该元素指定次数
    if (typeof forVal === 'number') {
      const undefList = [];
      for (let i = 0; i < forVal; i++) undefList.push(undefined);
      forVal = undefList;
    }
    // 进行数组映射
    if (Array.isArray(forVal)) {
      // 先映射props
      let propsWithLoopList;
      try {
        propsWithLoopList = forVal.map((value, index, array) => {
          // 通过custom.forKey计算key
          let key = custom.forKey
            ? getForKey(
                name,
                custom.forKey,
                {
                  ...exprContext,
                  loop: {
                    value,
                    index,
                    array,
                    key: undefined,
                  },
                },
                protoComponent.mapProps
              )
            : index;
          // 构造loop上下文
          const loop = {
            value,
            index,
            array,
            key,
          };
          // 基于loop上下文，计算realProps
          const realProps = getRealProps(name, props, {
            ...exprContext,
            loop,
          });
          return {
            realProps: realProps.realProps,
            loop,
            error: realProps.error,
          };
        });
      } catch (e) {
        return <RenderError msg={e.message || e}></RenderError>;
      }
      // 将映射完成的props渲染为react节点
      try {
        render = (
          <React.Fragment>
            {propsWithLoopList.map(({ realProps, loop, error }) => {
              if (error) {
                return (
                  <RenderError key={loop.key} msg={error.message}></RenderError>
                );
              }
              return (
                <LoopContext.Provider key={loop.key} value={loop}>
                  {getRender(type, realProps, children)}
                </LoopContext.Provider>
              );
            })}
          </React.Fragment>
        );
      } catch (e) {
        return (
          <RenderError
            msg={`节点[${name}]循环映射失败: ${e.message || e}`}
          ></RenderError>
        );
      }
    } else {
      // 如果无需循环，则直接渲染单个节点即可
      const { realProps, error } = getRealProps(
        name,
        props,
        exprContext,
        protoComponent.mapProps
      );
      if (error) {
        return <RenderError msg={error.message}></RenderError>;
      }
      render = getRender(type, realProps, children);
    }
    return render;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    type,
    componentContext.component,
    componentContext.root,
    componentContext.editing,
    name,
    custom,
    exprContext,
    props,
    nodes,
    id,
    connect,
    hydrationTimestamp,
  ]);
  return <RenderFailback nodeName={name}>{node}</RenderFailback>;
};

export const SimpleElement = ({ render }: any) => {
  const {
    connectors: { connect, drag },
  } = useNode();
  return typeof render.type === 'string'
    ? connect(drag(React.cloneElement(render)))
    : render;
};
