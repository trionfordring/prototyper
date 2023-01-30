import React, {
  createRef,
  FC,
  PropsWithChildren,
  ReactNode,
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

const supportShadowDom = document?.body?.attachShadow && createPortal;
export function createShadow<T extends HTMLElement, P = {}>(
  Root: any,
  Component: React.ComponentType<
    P & {
      shadowRoot?: ShadowRoot;
    }
  >
) {
  const ShadowComponent: FC<PropsWithChildren<P>> = ({
    children,
    ...props
  }) => {
    const ref = createRef<T>();
    const [root, setRoot] = useState<ShadowRoot>(null);
    useEffect(() => {
      const ele = ref.current;
      if (supportShadowDom && !ele.shadowRoot) {
        setRoot(
          ele.attachShadow({
            mode: 'open',
          })
        );
      } else {
        setRoot(ele.shadowRoot);
      }
    }, [ref]);
    let content: React.ReactNode = (
      <Component {...(props as P)} shadowRoot={root}>
        {children}
      </Component>
    );
    if (supportShadowDom) {
      content = root && doCreatePortal(content, root);
    }
    return (
      <Root {...(props as P)} ref={ref}>
        {content}
      </Root>
    );
  };
  return ShadowComponent;
}
