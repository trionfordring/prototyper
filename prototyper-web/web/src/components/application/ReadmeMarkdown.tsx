import { Markdown } from '../gizmo/Markdown';

export function ReadmeMarkdown({ value }: { value?: string }) {
  return <Markdown value={value} />;
}
