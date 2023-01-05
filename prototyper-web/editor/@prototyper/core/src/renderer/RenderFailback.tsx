import React, { PropsWithChildren } from 'react';

import { RenderError } from './RenderError';

export class RenderFailback extends React.Component<
  PropsWithChildren<{
    nodeName: string;
  }>,
  {
    error?: string;
  }
> {
  constructor(props) {
    super(props);
    this.state = { error: undefined };
  }

  componentDidCatch(error, errorInfo) {
    console.error('组件渲染失败', error, errorInfo);
    const msg = (error.message || error).toString();
    this.setState({ error: `节点[${this.props.nodeName}]渲染失败:${msg}` });
  }

  render() {
    if (this.state.error) {
      return <RenderError msg={this.state.error}></RenderError>;
    }

    return this.props.children;
  }
}
