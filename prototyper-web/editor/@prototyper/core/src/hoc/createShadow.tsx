import React, {
  createRef,
  FC,
  PropsWithChildren,
  ReactNode,
  RefAttributes,
  useEffect,
  useState,
} from 'react';
import { createPortal } from 'react-dom';

type CreateProtalType = (
  children: ReactNode,
  container: Element | DocumentFragment
) => React.ReactNode;
const fallbackCreatePortal: CreateProtalType = (children, _) => children;
const doCreatePortal: CreateProtalType = createPortal || fallbackCreatePortal;

export function createShadow<T extends HTMLElement, P = {}>(
  Root: React.ComponentType<RefAttributes<T> & P>,
  Component: React.ComponentType<
    PropsWithChildren<
      P & {
        shadowRoot?: ShadowRoot;
      }
    >
  >
) {
  const ShadowComponent: FC<PropsWithChildren<P>> = ({
    children,
    ...props
  }) => {
    const ref = createRef<T>();
    const [root, setRoot] = useState<ShadowRoot | undefined>();
    useEffect(() => {
      const ele = ref.current;
      if (ele && !ele.shadowRoot) {
        setRoot(
          ele.attachShadow({
            mode: 'open',
          })
        );
      } else {
        setRoot(ele?.shadowRoot || undefined);
      }
    }, [ref]);
    let content: React.ReactNode = (
      <Component {...(props as P)} shadowRoot={root}>
        {children}
      </Component>
    );
    content = root && doCreatePortal(content, root);
    return (
      <Root {...(props as P)} ref={ref}>
        {content}
      </Root>
    );
  };
  return ShadowComponent;
}
