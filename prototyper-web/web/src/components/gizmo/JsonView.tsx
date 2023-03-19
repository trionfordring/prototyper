import dynamic from 'next/dynamic';
import { ReactJsonViewProps } from 'react-json-view';

const JsonViewComponent = dynamic(() => import('react-json-view'), {
  ssr: false,
});
export function JsonView(props: ReactJsonViewProps) {
  return (
    <JsonViewComponent
      {...props}
      name={props.name || false}
      enableClipboard={props.enableClipboard || false}
      quotesOnKeys={props.quotesOnKeys || false}
    />
  );
}
