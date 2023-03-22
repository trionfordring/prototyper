import Markdoc from '@markdoc/markdoc';
import { useMemo } from 'react';
import React from 'react';
import 'github-markdown-css';

export function Markdown({
  value,
  variables,
}: {
  value?: string;
  variables?: Record<string, any>;
}) {
  const ast = useMemo(() => {
    return Markdoc.parse(value);
  }, [value]);
  const content = useMemo(() => {
    return Markdoc.transform(ast, {
      variables,
    });
  }, [ast, variables]);
  return (
    <article className="markdown-body">
      {Markdoc.renderers.react(content, React)}
    </article>
  );
}
