import { createContext } from 'react';

import { EditorStore } from './store';

export type EditorContext = EditorStore;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EditorContext = createContext<EditorContext>(null);
