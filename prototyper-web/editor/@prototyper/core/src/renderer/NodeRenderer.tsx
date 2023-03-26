import { useNode } from '@craftjs/core';
import React, { FC, useMemo } from 'react';

import { RenderError } from './RenderError';
import { RenderFailback } from './RenderFailback';

import { ComponentWarpper } from '../component/ComponentWarpper';
import { LoopContext, useComponentContext } from '../context';
import { useNodeChildren } from '../hook/useNodeChildren';
import { useNodeCustom } from '../hook/useNodeCustom';
import { useNodeProps } from '../hook/useNodeProps';
import { useProtoExprContext } from '../hook/useProtoExprContext';
import { Tool } from '../utils';

export const NodeRenderer = () => {
  const { name } = useNode((node) => ({ name: node.data.displayName }));
  return (
    <RenderFailback nodeName={name}>
      <NodeRenderer1></NodeRenderer1>
    </RenderFailback>
  );
};

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

const NodeRenderer1: FC = () => {
  const {
    type,
    hydrationTimestamp,
    id,
    connectors: { connect },
  } = useNode((node) => ({
    type: node.data.type,
    hydrationTimestamp: node._hydrationTimestamp,
    id: node.id,
  }));
  const componentContext = useComponentContext();
  const exprContext = useProtoExprContext();
  const children = useNodeChildren();

  const { propsExpr, error: propsError } = useNodeProps();
  const {
    hiddenExpr,
    hiddenExprError,
    forValExpr,
    forValExprError,
    forKeyExpr,
    forKeyExprError,
  } = useNodeCustom();

  return useMemo(() => {
    if (!type) return null;
    const syntaxError =
      propsError || hiddenExprError || forValExprError || forKeyExprError;
    if (syntaxError) {
      return (
        <RenderError
          msg={`设置存在语法错误:${syntaxError.message}`}
          withPrefix
        />
      );
    }
    let nodeScopeError: Error | undefined;
    // 应用hidden属性
    if (
      Tool.try(() => hiddenExpr.run(exprContext)).catch((err) => {
        nodeScopeError = err;
        return true;
      })
    ) {
      return nodeScopeError ? (
        <RenderError
          msg={`隐藏属性计算失败:${nodeScopeError.message}`}
          withPrefix
        />
      ) : null;
    }
    if (!componentContext)
      return <RenderError msg={`找不到组件上下文`} withPrefix />;
    const protoComponent = componentContext.component;
    // 对于根节点，直接返回
    {
      const isRoot = id === 'ROOT';
      const isAppRoot = isRoot && componentContext.root;
      // 对于应用根节点，需要connect的Warpper
      if (isAppRoot) {
        return Tool.try(() => {
          const realProps = componentContext.props;
          return (
            <ComponentWarpper
              render={protoComponent.warpper}
              ref={(ref) => connect(ref)}
              props={realProps}
              className={protoComponent.className}
              editing={componentContext.editing}
              descriptor={protoComponent.descriptor}
              root
            >
              {children}
            </ComponentWarpper>
          );
        }).catch((e) => {
          return <RenderError msg={`应用根节点渲染失败:${e.message}`} />;
        });
      } else if (isRoot) {
        // 对于非应用根节点的root，直接渲染它的子节点即可(它的warpper会被它的父Render渲染)
        return children;
      }
    }

    let render;

    // 处理for循环
    let forVal = Tool.try(() => forValExpr.run(exprContext)).catch(
      (e) => (nodeScopeError = e)
    );
    if (nodeScopeError) {
      return (
        <RenderError
          msg={`无法通过表达式循环节点:${nodeScopeError.message}`}
          withPrefix
        />
      );
    }
    // 当forVal为一个数字，将重复该元素指定次数
    if (typeof forVal === 'number') {
      const undefList: any[] = [];
      for (let i = 0; i < forVal; i++) undefList.push(undefined);
      forVal = undefList;
    }
    // 进行数组映射
    if (Array.isArray(forVal)) {
      // 先映射props
      let propsWithLoopList = Tool.try(() =>
        forVal.map((value, index, array) => {
          // 通过custom.forKey计算key
          const key =
            forKeyExpr.run({
              ...exprContext,
              loop: {
                value,
                index,
                array,
                key: undefined,
              },
            }) || index;
          // 构造loop上下文
          const loop = {
            value,
            index,
            array,
            key,
          };
          let err;
          // 基于loop上下文，计算realProps
          const realProps = Tool.try(() =>
            propsExpr?.run({
              ...exprContext,
              loop,
            })
          ).catch((e) => (err = e));
          return {
            realProps: realProps,
            loop,
            error: err,
          };
        })
      ).catch((e) => (nodeScopeError = e));
      if (nodeScopeError) {
        return (
          <RenderError
            msg={`循环key计算失败:${(nodeScopeError as Error).message}`}
            withPrefix
          />
        );
      }
      // 将映射完成的props渲染为react节点
      render = (
        <>
          {propsWithLoopList.map(({ realProps, loop, error }) => {
            if (error) {
              return (
                <RenderError
                  key={loop.key}
                  msg={`[${loop.key}]:${error.message}`}
                  withPrefix
                ></RenderError>
              );
            }
            return (
              <LoopContext.Provider key={loop.key} value={loop}>
                {getRender(type, realProps, children)}
              </LoopContext.Provider>
            );
          })}
        </>
      );
    } else {
      // 如果无需循环，则直接渲染单个节点即可
      render = Tool.try(() => {
        const realProps = propsExpr?.run(exprContext);
        return getRender(type, realProps, children);
      }).catch((e) => {
        return <RenderError msg={`节点属性计算失败:${e.message}`} withPrefix />;
      });
    }
    return render;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    type,
    hiddenExpr,
    exprContext,
    componentContext,
    id,
    children,
    forKeyExpr,
    propsExpr,
    forValExpr,
    hydrationTimestamp,
  ]);
};

export const SimpleElement = ({ render }: any) => {
  const {
    connectors: { connect, drag },
  } = useNode();
  return typeof render.type === 'string'
    ? connect(drag(React.cloneElement(render)))
    : render;
};
