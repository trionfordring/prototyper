import { ApplicationRenderer, createProtoComponent } from '@prototyper/core';
import { useEffect, useState } from 'react';

const component = createProtoComponent({
  type: 'virtual',
  dependencies: [
    { namespace: 'hello', name: 'Text' },
    { namespace: 'hello', name: 'Container' },
    { namespace: 'hello', name: 'Button' },
  ],

  virtualDom: {
    ROOT: {
      nodes: ['c1', 'c2', 'c3', 'component1'],
      hidden: false,
    },
    c1: {
      props: {
        color: '#E6A23C',
      },
      isCanvas: true,
      displayName: 'c1',
      parent: 'ROOT',
      linkedNodes: {},
      hidden: false,
      type: {
        resolvedName: 'hello.Container',
      },
      nodes: ['t1', 't2'],
    },
    c2: {
      props: {
        color: '#67C23A',
      },
      isCanvas: true,
      displayName: 'c2',
      parent: 'ROOT',
      linkedNodes: {},
      hidden: false,
      type: {
        resolvedName: 'hello.Container',
      },
      nodes: ['t3'],
    },
    t1: {
      props: {
        text: 't1:这个示例将帮助你理解虚拟组件的数据结构。',
      },
      isCanvas: false,
      displayName: 't1',
      parent: 'c1',
      linkedNodes: {},
      hidden: false,
      type: {
        resolvedName: 'hello.Text',
      },
      nodes: [],
    },
    t2: {
      props: {
        text: '这是t2。',
      },
      isCanvas: false,
      displayName: 't2',
      parent: 'c1',
      linkedNodes: {},
      hidden: false,
      type: {
        resolvedName: 'hello.Text',
      },
      nodes: [],
    },
    t3: {
      props: {
        text: '这是t3。',
      },
      isCanvas: false,
      displayName: 't3',
      parent: 'c2',
      linkedNodes: {},
      hidden: false,
      type: {
        resolvedName: 'hello.Text',
      },
      nodes: [],
    },

    c3: {
      props: {},
      isCanvas: true,
      displayName: 'c3',
      parent: 'ROOT',
      linkedNodes: {},
      hidden: false,
      type: {
        resolvedName: 'hello.Container',
      },
      nodes: ['t4', 'b1'],
    },
    t4: {
      props: {
        text: '父组件state.num=#{state.num}',
      },
      isCanvas: false,
      displayName: 't4',
      parent: 'c3',
      linkedNodes: {},
      hidden: false,
      type: {
        resolvedName: 'hello.Text',
      },
      nodes: [],
    },
    b1: {
      props: {
        textExpr: '父组件add',
        onClick: 'state.add',
      },
      isCanvas: false,
      displayName: 'b1',
      parent: 'c3',
      linkedNodes: {},
      hidden: false,
      type: {
        resolvedName: 'hello.Button',
      },
      nodes: [],
    },

    component1: {
      props: {
        descriptor: {
          namespace: 'hello',
          name: 'TestVirtualComp',
        },
        props: {
          onClick: 'state.add',
          numExpr: '#{state.num}',
        },
      },
      isCanvas: false,
      displayName: 'component1',
      parent: 'ROOT',
      linkedNodes: {},
      hidden: false,
      type: {
        resolvedName: 'ComponentRenderer',
      },
      nodes: [],
    },
  },
  useSetupStates: () => {
    const [num, setNum] = useState(1);
    return {
      num,
      add: () => setNum((n) => n + 1),
    };
  },
});

function RendererExample() {
  useEffect(() => {
    console.log('渲染根组件', component);
  }, []);

  return (
    <ApplicationRenderer
      app={{
        index: component,
        useSetupAppStates: () => ({}),
      }}
    ></ApplicationRenderer>
  );
}

export default RendererExample;
